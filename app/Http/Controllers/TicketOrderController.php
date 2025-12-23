<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventTicket;
use App\Models\TicketOrder;
use App\Models\TicketPackage;
use App\Services\PaymentGatewayService;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TicketOrderController extends Controller
{
    protected TicketService $ticketService;
    protected PaymentGatewayService $paymentService;

    public function __construct(TicketService $ticketService, PaymentGatewayService $paymentService)
    {
        $this->ticketService = $ticketService;
        $this->paymentService = $paymentService;
    }

    /**
     * Show checkout page.
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'packages' => 'required|array|min:1',
            'packages.*.package_id' => 'required|exists:ticket_packages,id',
            'packages.*.quantity' => 'required|integer|min:1|max:10',
        ]);

        $event = Event::with('serviceProvider')->findOrFail($request->event_id);
        
        // Get selected ticket packages with details
        $selectedTickets = collect($request->packages)->map(function ($item) {
            $package = TicketPackage::findOrFail($item['package_id']);
            return [
                'package_id' => $package->id,
                'quantity' => $item['quantity'],
                'package' => [
                    'id' => $package->id,
                    'name' => $package->name,
                    'price' => $package->price,
                    'currency' => $package->currency,
                ],
            ];
        });

        // Calculate total
        $totalAmount = $selectedTickets->sum(function ($ticket) {
            return $ticket['package']['price'] * $ticket['quantity'];
        });

        return Inertia::render('Ticketing/Checkout', [
            'event' => $event,
            'selectedTickets' => $selectedTickets,
            'totalAmount' => $totalAmount,
        ]);
    }

    /**
     * Create a new ticket order.
     */
    public function create(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'tickets' => 'required|array|min:1',
            'tickets.*.package_id' => 'required|exists:ticket_packages,id',
            'tickets.*.quantity' => 'required|integer|min:1|max:10',
            'tickets.*.attendees' => 'required|array',
            'tickets.*.attendees.*.name' => 'required|string|max:255',
            'tickets.*.attendees.*.email' => 'required|email',
            'tickets.*.attendees.*.phone' => 'nullable|string|max:20',
            'seats' => 'nullable|array',
            'seats.*' => 'exists:seats,id',
            'billing_name' => 'required|string|max:255',
            'billing_email' => 'required|email',
            'billing_phone' => 'required|string|max:20',
            'promo_code' => 'nullable|string|max:50',
        ]);

        try {
            DB::beginTransaction();

            $event = Event::findOrFail($validated['event_id']);

            // Calculate total amount
            $totalAmount = 0;
            $ticketDetails = [];

            foreach ($validated['tickets'] as $ticketData) {
                $package = TicketPackage::findOrFail($ticketData['package_id']);
                $quantity = $ticketData['quantity'];
                $totalAmount += $package->price * $quantity;

                $ticketDetails[] = [
                    'package' => $package,
                    'quantity' => $quantity,
                    'attendees' => $ticketData['attendees'],
                ];
            }

            // Apply promo code if provided
            $discountAmount = 0;
            if (!empty($validated['promo_code'])) {
                // TODO: Implement promo code validation and discount calculation
                // $discountAmount = $this->calculatePromoDiscount($validated['promo_code'], $totalAmount);
            }

            // Reserve seats if provided
            if (!empty($validated['seats'])) {
                $seatsReserved = $this->ticketService->reserveSeats($validated['seats']);
                if (!$seatsReserved) {
                    DB::rollBack();
                    return back()->with('error', 'Some selected seats are no longer available.');
                }
            }

            // Create order
            $order = TicketOrder::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(12)),
                'user_id' => Auth::id(),
                'event_id' => $event->id,
                'total_amount' => $totalAmount,
                'currency' => $event->currency ?? 'MWK',
                'status' => 'pending',
                'payment_status' => 'pending',
                'billing_name' => $validated['billing_name'],
                'billing_email' => $validated['billing_email'],
                'billing_phone' => $validated['billing_phone'],
                'promo_code' => $validated['promo_code'] ?? null,
                'discount_amount' => $discountAmount,
            ]);

            // Create individual tickets
            $seatIndex = 0;
            foreach ($ticketDetails as $detail) {
                foreach ($detail['attendees'] as $attendee) {
                    $seatId = null;
                    if (!empty($validated['seats'])) {
                        $seatId = $validated['seats'][$seatIndex] ?? null;
                        $seatIndex++;
                    }

                    $this->ticketService->createTicketWithQR([
                        'event_id' => $event->id,
                        'ticket_package_id' => $detail['package']->id,
                        'user_id' => Auth::id(),
                        'order_id' => $order->id,
                        'attendee_name' => $attendee['name'],
                        'attendee_email' => $attendee['email'],
                        'attendee_phone' => $attendee['phone'] ?? null,
                        'seat_id' => $seatId,
                        'status' => 'valid',
                    ]);
                }
            }

            DB::commit();

            // Redirect to payment
            return redirect()->route('ticket-orders.payment', $order);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create order: ' . $e->getMessage());
        }
    }

    /**
     * Show order details.
     */
    public function show(TicketOrder $order)
    {
        $this->authorize('view', $order);

        $order->load(['event', 'eventTickets.ticketPackage', 'eventTickets.seat.section', 'payment']);

        return Inertia::render('Ticketing/OrderDetail', [
            'order' => $order,
        ]);
    }

    /**
     * Show payment page.
     */
    public function payment(TicketOrder $order)
    {
        $this->authorize('view', $order);

        if ($order->payment_status === 'completed') {
            return redirect()->route('ticket-orders.confirmation', $order);
        }

        $order->load(['event', 'eventTickets']);

        return Inertia::render('Ticketing/Payment', [
            'order' => $order,
            'paymentMethods' => config('payment.methods'),
        ]);
    }

    /**
     * Process payment.
     */
    public function processPayment(Request $request, TicketOrder $order)
    {
        $this->authorize('view', $order);

        $validated = $request->validate([
            'payment_method' => 'required|string',
            'payment_gateway' => 'nullable|string|in:flutterwave,stripe',
        ]);

        try {
            // Create payment intent
            $paymentIntent = $this->paymentService->createPaymentIntent(
                $order,
                $validated['payment_gateway'] ?? null
            );

            // Create payment record
            $payment = $this->paymentService->processPayment($order, [
                'payment_method' => $validated['payment_method'],
                'reference' => $paymentIntent['reference'],
            ]);

            // Redirect to payment gateway
            return Inertia::location($paymentIntent['payment_url']);
        } catch (\Exception $e) {
            return back()->with('error', 'Payment processing failed: ' . $e->getMessage());
        }
    }

    /**
     * Show order confirmation page.
     */
    public function confirmation(TicketOrder $order)
    {
        $this->authorize('view', $order);

        $order->load(['event', 'eventTickets.ticketPackage', 'payment']);

        return Inertia::render('Ticketing/Confirmation', [
            'order' => $order,
        ]);
    }

    /**
     * Cancel an order.
     */
    public function cancel(TicketOrder $order)
    {
        $this->authorize('update', $order);

        if (!$order->isPending()) {
            return back()->with('error', 'Only pending orders can be cancelled.');
        }

        try {
            DB::beginTransaction();

            // Release reserved seats
            $order->eventTickets()->whereNotNull('seat_id')->get()->each(function ($ticket) {
                $ticket->seat?->release();
            });

            // Cancel tickets
            $order->eventTickets()->update(['status' => 'cancelled']);

            // Cancel order
            $order->update(['status' => 'cancelled']);

            DB::commit();

            return redirect()->route('my-tickets')->with('success', 'Order cancelled successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to cancel order: ' . $e->getMessage());
        }
    }

    /**
     * Show user's tickets dashboard.
     */
    public function myTickets()
    {
        $user = Auth::user();

        $upcomingTickets = EventTicket::where('user_id', $user->id)
            ->whereIn('status', ['valid', 'used'])
            ->whereHas('event', fn($q) => $q->where('start_datetime', '>', now()))
            ->with(['event', 'ticketPackage', 'seat.section'])
            ->orderBy('created_at', 'desc')
            ->get();

        $pastTickets = EventTicket::where('user_id', $user->id)
            ->whereIn('status', ['valid', 'used'])
            ->whereHas('event', fn($q) => $q->where('start_datetime', '<=', now()))
            ->with(['event', 'ticketPackage', 'seat.section'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Ticketing/MyTickets', [
            'upcomingTickets' => $upcomingTickets,
            'pastTickets' => $pastTickets,
        ]);
    }

    /**
     * Download ticket PDF.
     */
    public function downloadTicket(EventTicket $ticket)
    {
        $this->authorize('view', $ticket);

        try {
            $pdfPath = $this->ticketService->generateTicketPDF($ticket);
            return Storage::download($pdfPath);
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to generate ticket: ' . $e->getMessage());
        }
    }
}
