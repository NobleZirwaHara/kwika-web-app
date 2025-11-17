<?php

namespace App\Http\Controllers;

use App\Contracts\Broadcasting\RealtimeMessenger;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Service;
use App\Services\MessageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BookingController extends Controller
{
    protected MessageService $messageService;
    protected RealtimeMessenger $messenger;

    public function __construct(MessageService $messageService, RealtimeMessenger $messenger)
    {
        $this->messageService = $messageService;
        $this->messenger = $messenger;
    }

    /**
     * Show booking form for a service (only for verified providers)
     */
    public function create(Request $request)
    {
        $serviceId = $request->query('service_id');

        if (!$serviceId) {
            return redirect()->route('home')->withErrors(['error' => 'Service not found']);
        }

        $service = Service::with(['serviceProvider', 'category'])
            ->where('id', $serviceId)
            ->where('is_active', true)
            ->whereHas('serviceProvider', function ($query) {
                $query->where('verification_status', 'approved')
                      ->where('is_active', true);
            })
            ->firstOrFail();

        return Inertia::render('Booking/Create', [
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->description,
                'base_price' => $service->base_price,
                'price_type' => $service->price_type,
                'max_price' => $service->max_price,
                'currency' => $service->currency,
                'duration' => $service->duration,
                'max_attendees' => $service->max_attendees,
                'category_name' => $service->category->name,
                'provider' => [
                    'id' => $service->serviceProvider->id,
                    'business_name' => $service->serviceProvider->business_name,
                    'location' => $service->serviceProvider->location,
                    'city' => $service->serviceProvider->city,
                ],
            ],
        ]);
    }

    /**
     * Store booking and redirect to payment selection
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'event_date' => ['required', 'date', 'after:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'event_end_date' => ['nullable', 'date', 'after_or_equal:event_date'],
            'event_location' => ['nullable', 'string', 'max:500'],
            'event_latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'event_longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'attendees' => ['nullable', 'integer', 'min:1'],
            'special_requests' => ['nullable', 'string', 'max:2000'],
        ]);

        $service = Service::with('serviceProvider')
            ->where('id', $validated['service_id'])
            ->whereHas('serviceProvider', function ($query) {
                $query->where('verification_status', 'approved')
                      ->where('is_active', true);
            })
            ->firstOrFail();

        // Calculate total amount
        $totalAmount = $this->calculateBookingAmount($service, $validated);

        // Calculate deposit if required
        $depositAmount = 0;
        $remainingAmount = $totalAmount;

        if ($service->requires_deposit && $service->deposit_percentage > 0) {
            $depositAmount = ($totalAmount * $service->deposit_percentage) / 100;
            $remainingAmount = $totalAmount - $depositAmount;
        }

        // Create booking
        $booking = Booking::create([
            'booking_number' => 'BK-' . strtoupper(Str::random(10)),
            'user_id' => Auth::id(),
            'service_id' => $service->id,
            'service_provider_id' => $service->service_provider_id,
            'event_date' => $validated['event_date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'event_end_date' => $validated['event_end_date'] ?? null,
            'event_location' => $validated['event_location'] ?? null,
            'event_latitude' => $validated['event_latitude'] ?? null,
            'event_longitude' => $validated['event_longitude'] ?? null,
            'attendees' => $validated['attendees'] ?? null,
            'special_requests' => $validated['special_requests'] ?? null,
            'total_amount' => $totalAmount,
            'deposit_amount' => $depositAmount,
            'remaining_amount' => $remainingAmount,
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);

        // Load the service relationship for the message
        $booking->load('service');

        // Create conversation and send booking request message
        try {
            $message = $this->messageService->sendBookingRequestMessage($booking);
            $this->messenger->broadcastMessage($message);
        } catch (\Exception $e) {
            // Log error but don't fail the booking creation
            \Log::error('Failed to send booking request message', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
            ]);
        }

        return redirect()->route('bookings.payment.select', $booking->id);
    }

    /**
     * Show payment method selection page
     */
    public function selectPaymentMethod(Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $booking->load(['service', 'serviceProvider']);

        return Inertia::render('Booking/PaymentSelect', [
            'booking' => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'total_amount' => $booking->total_amount,
                'deposit_amount' => $booking->deposit_amount,
                'remaining_amount' => $booking->remaining_amount,
                'currency' => 'MWK',
                'event_date' => $booking->event_date->format('M d, Y'),
                'service' => [
                    'name' => $booking->service->name,
                ],
                'provider' => [
                    'business_name' => $booking->serviceProvider->business_name,
                ],
            ],
        ]);
    }

    /**
     * Show bank transfer payment page
     */
    public function showBankTransfer(Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $booking->load(['service', 'serviceProvider']);

        return Inertia::render('Booking/PaymentBankTransfer', [
            'booking' => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'total_amount' => $booking->total_amount,
                'currency' => 'MWK',
            ],
            'bankDetails' => [
                'bank_name' => 'National Bank of Malawi',
                'account_name' => 'Kwika Events Ltd',
                'account_number' => '1234567890',
                'swift_code' => 'NATMMWMW',
                'branch' => 'Lilongwe',
            ],
        ]);
    }

    /**
     * Process bank transfer payment
     */
    public function processBankTransfer(Request $request, Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'proof_of_payment' => ['required', 'image', 'max:5120'], // 5MB
            'reference_number' => ['required', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        // Upload proof of payment
        $file = $request->file('proof_of_payment');
        $filename = 'payments/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('', $filename, 'public');

        // Create payment record
        Payment::create([
            'transaction_id' => 'TXN-' . strtoupper(Str::random(12)),
            'user_id' => Auth::id(),
            'booking_id' => $booking->id,
            'payment_type' => 'booking',
            'amount' => $booking->deposit_amount > 0 ? $booking->deposit_amount : $booking->total_amount,
            'currency' => 'MWK',
            'payment_method' => 'bank_transfer',
            'status' => 'pending',
            'gateway_transaction_id' => $validated['reference_number'],
            'proof_of_payment' => $path,
            'notes' => $validated['notes'] ?? null,
        ]);

        //$booking->update(['payment_status' => 'pending_verification']);

        return redirect()->route('bookings.confirmation', $booking->id);
    }

    /**
     * Show mobile money payment page
     */
    public function showMobileMoney(Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $booking->load(['service', 'serviceProvider']);

        return Inertia::render('Booking/PaymentMobileMoney', [
            'booking' => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'total_amount' => $booking->total_amount,
                'deposit_amount' => $booking->deposit_amount,
                'currency' => 'MWK',
            ],
            'mobileMoneyDetails' => [
                'provider' => 'Airtel Money',
                'business_number' => '300300',
                'account_number' => 'KWIKA',
            ],
        ]);
    }

    /**
     * Process mobile money payment
     */
    public function processMobileMoney(Request $request, Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'phone_number' => ['required', 'string', 'regex:/^(\+265|0)(88|99|77|21)\d{7}$/'],
            'mpesa_code' => ['required', 'string', 'max:20'],
        ]);

        // Create payment record
        Payment::create([
            'transaction_id' => 'TXN-' . strtoupper(Str::random(12)),
            'user_id' => Auth::id(),
            'booking_id' => $booking->id,
            'payment_type' => 'booking',
            'amount' => $booking->deposit_amount > 0 ? $booking->deposit_amount : $booking->total_amount,
            'currency' => 'MWK',
            'payment_method' => 'mobile_money',
            'payment_gateway' => 'mpesa',
            'status' => 'pending',
            'gateway_transaction_id' => $validated['mpesa_code'],
            'phone_number' => $validated['phone_number'],
        ]);

        $booking->update(['payment_status' => 'pending_verification']);

        return redirect()->route('bookings.confirmation', $booking->id);
    }

    /**
     * Show card payment page
     */
    public function showCardPayment(Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $booking->load(['service', 'serviceProvider']);

        return Inertia::render('Booking/PaymentCard', [
            'booking' => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'total_amount' => $booking->total_amount,
                'deposit_amount' => $booking->deposit_amount,
                'currency' => 'MWK',
            ],
        ]);
    }

    /**
     * Process card payment
     */
    public function processCardPayment(Request $request, Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'card_number' => ['required', 'string', 'regex:/^\d{16}$/'],
            'card_holder' => ['required', 'string', 'max:100'],
            'expiry_month' => ['required', 'integer', 'between:1,12'],
            'expiry_year' => ['required', 'integer', 'min:2024'],
            'cvv' => ['required', 'string', 'regex:/^\d{3,4}$/'],
        ]);

        // In production, integrate with actual payment gateway (Stripe, Flutterwave, etc.)
        // For now, simulate successful payment

        Payment::create([
            'transaction_id' => 'TXN-' . strtoupper(Str::random(12)),
            'user_id' => Auth::id(),
            'booking_id' => $booking->id,
            'payment_type' => 'booking',
            'amount' => $booking->deposit_amount > 0 ? $booking->deposit_amount : $booking->total_amount,
            'currency' => 'MWK',
            'payment_method' => 'card',
            'payment_gateway' => 'stripe',
            'status' => 'completed',
            'gateway_transaction_id' => 'ch_' . Str::random(24),
            'paid_at' => now(),
        ]);

        $booking->update([
            'payment_status' => 'paid',
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        return redirect()->route('bookings.confirmation', $booking->id);
    }

    /**
     * Show booking confirmation page
     */
    public function confirmation(Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $booking->load(['service', 'serviceProvider', 'payments']);

        return Inertia::render('Booking/Confirmation', [
            'booking' => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'status' => $booking->status,
                'payment_status' => $booking->payment_status,
                'total_amount' => $booking->total_amount,
                'deposit_amount' => $booking->deposit_amount,
                'remaining_amount' => $booking->remaining_amount,
                'currency' => 'MWK',
                'event_date' => $booking->event_date->format('M d, Y'),
                'start_time' => $booking->start_time,
                'end_time' => $booking->end_time,
                'event_location' => $booking->event_location,
                'attendees' => $booking->attendees,
                'service' => [
                    'name' => $booking->service->name,
                ],
                'provider' => [
                    'business_name' => $booking->serviceProvider->business_name,
                    'phone' => $booking->serviceProvider->phone,
                    'email' => $booking->serviceProvider->email,
                ],
                'payment' => $booking->payments->first() ? [
                    'method' => $booking->payments->first()->payment_method,
                    'status' => $booking->payments->first()->status,
                    'amount' => $booking->payments->first()->amount,
                ] : null,
            ],
        ]);
    }

    /**
     * Show single booking details
     */
    public function show(Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $booking->load(['service', 'serviceProvider', 'payments']);

        return Inertia::render('Booking/Show', [
            'booking' => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'status' => $booking->status,
                'payment_status' => $booking->payment_status,
                'total_amount' => $booking->total_amount,
                'deposit_amount' => $booking->deposit_amount,
                'remaining_amount' => $booking->remaining_amount,
                'currency' => 'MWK',
                'event_date' => $booking->event_date->format('M d, Y g:i A'),
                'event_location' => $booking->event_location,
                'attendees' => $booking->attendees,
                'special_requests' => $booking->special_requests,
                'service' => [
                    'name' => $booking->service->name,
                    'description' => $booking->service->description,
                ],
                'provider' => [
                    'business_name' => $booking->serviceProvider->business_name,
                    'phone' => $booking->serviceProvider->phone,
                    'email' => $booking->serviceProvider->email,
                    'location' => $booking->serviceProvider->location,
                ],
                'payments' => $booking->payments->map(function ($payment) {
                    return [
                        'id' => $payment->id,
                        'amount' => $payment->amount,
                        'method' => $payment->payment_method,
                        'status' => $payment->status,
                        'created_at' => $payment->created_at->format('M d, Y g:i A'),
                    ];
                }),
            ],
        ]);
    }

    /**
     * Cancel a booking
     */
    public function cancel(Request $request, Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        if (in_array($booking->status, ['cancelled', 'completed'])) {
            return redirect()->back()->withErrors(['error' => 'This booking cannot be cancelled']);
        }

        $validated = $request->validate([
            'cancellation_reason' => ['required', 'string', 'max:500'],
        ]);

        $booking->update([
            'status' => 'cancelled',
            'cancellation_reason' => $validated['cancellation_reason'],
            'cancelled_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Booking cancelled successfully');
    }

    /**
     * Get provider availability (booked dates and time slots)
     */
    public function getProviderAvailability(Request $request, $providerId)
    {
        $startDate = $request->query('start_date', now()->format('Y-m-d'));
        $endDate = $request->query('end_date', now()->addMonths(3)->format('Y-m-d'));
        $specificDate = $request->query('date'); // For getting time slots for a specific date

        // If requesting time slots for a specific date
        if ($specificDate) {
            $bookedTimeSlots = Booking::where('service_provider_id', $providerId)
                ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
                ->whereDate('event_date', $specificDate)
                ->select('start_time', 'end_time')
                ->get()
                ->flatMap(function ($booking) {
                    // Generate all time slots between start_time and end_time
                    $slots = [];
                    if ($booking->start_time && $booking->end_time) {
                        $start = new \DateTime($booking->start_time);
                        $end = new \DateTime($booking->end_time);

                        // Add slots in 30-minute intervals
                        $current = clone $start;
                        while ($current <= $end) {
                            $slots[] = $current->format('H:i');
                            $current->modify('+30 minutes');
                        }
                    }
                    return $slots;
                })
                ->unique()
                ->values();

            return response()->json([
                'booked_time_slots' => $bookedTimeSlots,
            ]);
        }

        // Get all bookings for this provider that are confirmed or pending
        $bookedDates = Booking::where('service_provider_id', $providerId)
            ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
            ->whereBetween('event_date', [$startDate, $endDate])
            ->select('event_date', 'event_end_date')
            ->get()
            ->flatMap(function ($booking) {
                // Create array of all dates between event_date and event_end_date
                $dates = [];
                $start = new \DateTime($booking->event_date);
                $end = $booking->event_end_date ? new \DateTime($booking->event_end_date) : clone $start;

                $interval = new \DateInterval('P1D');
                $dateRange = new \DatePeriod($start, $interval, $end->modify('+1 day'));

                foreach ($dateRange as $date) {
                    $dates[] = $date->format('Y-m-d');
                }

                return $dates;
            })
            ->unique()
            ->values();

        return response()->json([
            'booked_dates' => $bookedDates,
        ]);
    }

    /**
     * Calculate booking amount based on service pricing
     */
    private function calculateBookingAmount(Service $service, array $bookingData): float
    {
        $amount = $service->base_price;

        // Adjust based on price type
        if ($service->price_type === 'hourly' && $service->duration) {
            $hours = ceil($service->duration / 60);
            $amount = $service->base_price * $hours;
        } elseif ($service->price_type === 'daily') {
            $days = 1;
            if (isset($bookingData['event_end_date'])) {
                $start = new \DateTime($bookingData['event_date']);
                $end = new \DateTime($bookingData['event_end_date']);
                $days = max(1, $start->diff($end)->days);
            }
            $amount = $service->base_price * $days;
        }

        return $amount;
    }
}
