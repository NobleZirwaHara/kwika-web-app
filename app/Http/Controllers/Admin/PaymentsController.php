<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentsController extends Controller
{
    /**
     * Display a listing of payments
     */
    public function index(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        // Get filter parameters
        $search = $request->input('search');
        $status = $request->input('status', 'all'); // all, pending, completed, failed, refunded
        $paymentMethod = $request->input('payment_method'); // bank_transfer, mobile_money, card
        $paymentType = $request->input('payment_type'); // deposit, full_payment, subscription
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Build query
        $query = Payment::with(['user', 'booking.service', 'booking.serviceProvider', 'providerSubscription'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('transaction_id', 'like', "%{$search}%")
                        ->orWhere('gateway_transaction_id', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                              ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('booking', function ($q) use ($search) {
                            $q->where('booking_number', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status !== 'all', function ($q) use ($status) {
                return $q->where('status', $status);
            })
            ->when($paymentMethod, function ($q) use ($paymentMethod) {
                return $q->where('payment_method', $paymentMethod);
            })
            ->when($paymentType, function ($q) use ($paymentType) {
                return $q->where('payment_type', $paymentType);
            });

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $payments = $query->paginate(20)->withQueryString();

        // Transform data for frontend
        $paymentsData = $payments->through(function ($payment) {
            return [
                'id' => $payment->id,
                'transaction_id' => $payment->transaction_id,
                'payment_type' => $payment->payment_type,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'payment_method' => $payment->payment_method,
                'status' => $payment->status,
                'payment_gateway' => $payment->payment_gateway,
                'gateway_transaction_id' => $payment->gateway_transaction_id,
                'phone_number' => $payment->phone_number,
                'proof_of_payment' => $payment->proof_of_payment,
                'notes' => $payment->notes,
                'paid_at' => $payment->paid_at?->format('M d, Y H:i'),
                'created_at' => $payment->created_at->format('M d, Y H:i'),
                'user' => [
                    'id' => $payment->user->id,
                    'name' => $payment->user->name,
                    'email' => $payment->user->email,
                ],
                'booking' => $payment->booking ? [
                    'id' => $payment->booking->id,
                    'booking_number' => $payment->booking->booking_number,
                    'status' => $payment->booking->status,
                    'service' => $payment->booking->service ? [
                        'id' => $payment->booking->service->id,
                        'name' => $payment->booking->service->name,
                    ] : null,
                    'service_provider' => $payment->booking->serviceProvider ? [
                        'id' => $payment->booking->serviceProvider->id,
                        'business_name' => $payment->booking->serviceProvider->business_name,
                    ] : null,
                ] : null,
                'provider_subscription' => $payment->providerSubscription ? [
                    'id' => $payment->providerSubscription->id,
                ] : null,
            ];
        });

        // Get statistics
        $stats = [
            'total' => Payment::count(),
            'pending' => Payment::where('status', 'pending')->count(),
            'completed' => Payment::where('status', 'completed')->count(),
            'failed' => Payment::where('status', 'failed')->count(),
            'refunded' => Payment::where('status', 'refunded')->count(),
            'total_amount' => Payment::where('status', 'completed')->sum('amount'),
            'pending_amount' => Payment::where('status', 'pending')->sum('amount'),
        ];

        return Inertia::render('Admin/Payments/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'payments' => $paymentsData,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'payment_method' => $paymentMethod,
                'payment_type' => $paymentType,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show payment details
     */
    public function show($id)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        $payment = Payment::with(['user', 'booking.service', 'booking.serviceProvider', 'providerSubscription'])
            ->findOrFail($id);

        return Inertia::render('Admin/Payments/Show', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'payment' => [
                'id' => $payment->id,
                'transaction_id' => $payment->transaction_id,
                'payment_type' => $payment->payment_type,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'payment_method' => $payment->payment_method,
                'status' => $payment->status,
                'payment_gateway' => $payment->payment_gateway,
                'gateway_transaction_id' => $payment->gateway_transaction_id,
                'gateway_response' => $payment->gateway_response,
                'phone_number' => $payment->phone_number,
                'proof_of_payment' => $payment->proof_of_payment,
                'notes' => $payment->notes,
                'paid_at' => $payment->paid_at?->format('M d, Y H:i'),
                'created_at' => $payment->created_at->format('M d, Y H:i'),
                'updated_at' => $payment->updated_at->format('M d, Y H:i'),
                'user' => [
                    'id' => $payment->user->id,
                    'name' => $payment->user->name,
                    'email' => $payment->user->email,
                    'phone' => $payment->user->phone,
                ],
                'booking' => $payment->booking ? [
                    'id' => $payment->booking->id,
                    'booking_number' => $payment->booking->booking_number,
                    'status' => $payment->booking->status,
                    'payment_status' => $payment->booking->payment_status,
                    'event_date' => $payment->booking->event_date->format('M d, Y H:i'),
                    'total_amount' => $payment->booking->total_amount,
                    'deposit_amount' => $payment->booking->deposit_amount,
                    'remaining_amount' => $payment->booking->remaining_amount,
                    'service' => $payment->booking->service ? [
                        'id' => $payment->booking->service->id,
                        'name' => $payment->booking->service->name,
                    ] : null,
                    'service_provider' => $payment->booking->serviceProvider ? [
                        'id' => $payment->booking->serviceProvider->id,
                        'business_name' => $payment->booking->serviceProvider->business_name,
                    ] : null,
                ] : null,
            ],
        ]);
    }

    /**
     * Verify a pending payment
     */
    public function verify(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_payments')) {
            return back()->with('error', 'You do not have permission to verify payments.');
        }

        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $payment = Payment::with('booking')->findOrFail($id);

        if ($payment->status !== 'pending') {
            return back()->with('error', 'Only pending payments can be verified.');
        }

        DB::beginTransaction();
        try {
            $oldStatus = $payment->status;

            // Update payment status
            $payment->update([
                'status' => 'completed',
                'paid_at' => now(),
                'notes' => $request->input('notes'),
            ]);

            // Update booking payment status if applicable
            if ($payment->booking) {
                $booking = $payment->booking;

                // Check if all payments for this booking are completed
                $totalPaid = $booking->payments()->where('status', 'completed')->sum('amount');

                if ($totalPaid >= $booking->total_amount) {
                    $booking->update(['payment_status' => 'paid']);
                } elseif ($totalPaid >= $booking->deposit_amount) {
                    $booking->update(['payment_status' => 'partially_paid']);
                }
            }

            // Log admin action
            $admin->logAdminAction(
                'verified',
                Payment::class,
                $payment->id,
                ['status' => $oldStatus],
                ['status' => 'completed'],
                'Payment verified and approved' . ($request->input('notes') ? ': ' . $request->input('notes') : '')
            );

            DB::commit();

            return back()->with('success', 'Payment verified successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to verify payment: ' . $e->getMessage());
        }
    }

    /**
     * Reject a pending payment
     */
    public function reject(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_payments')) {
            return back()->with('error', 'You do not have permission to reject payments.');
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $payment = Payment::findOrFail($id);

        if ($payment->status !== 'pending') {
            return back()->with('error', 'Only pending payments can be rejected.');
        }

        DB::beginTransaction();
        try {
            $oldStatus = $payment->status;

            $payment->update([
                'status' => 'failed',
                'notes' => 'Rejected: ' . $request->input('reason'),
            ]);

            // Log admin action
            $admin->logAdminAction(
                'rejected',
                Payment::class,
                $payment->id,
                ['status' => $oldStatus],
                ['status' => 'failed'],
                'Payment rejected: ' . $request->input('reason')
            );

            DB::commit();

            return back()->with('success', 'Payment rejected successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to reject payment: ' . $e->getMessage());
        }
    }

    /**
     * Process a refund
     */
    public function refund(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_payments')) {
            return back()->with('error', 'You do not have permission to process refunds.');
        }

        $request->validate([
            'refund_amount' => 'required|numeric|min:0.01',
            'reason' => 'required|string|max:500',
        ]);

        $payment = Payment::with('booking')->findOrFail($id);

        if ($payment->status !== 'completed') {
            return back()->with('error', 'Only completed payments can be refunded.');
        }

        $refundAmount = $request->input('refund_amount');
        if ($refundAmount > $payment->amount) {
            return back()->with('error', 'Refund amount cannot exceed payment amount.');
        }

        DB::beginTransaction();
        try {
            $oldStatus = $payment->status;

            // Update payment status to refunded
            $payment->update([
                'status' => 'refunded',
                'notes' => 'Refunded ' . $payment->currency . ' ' . number_format($refundAmount, 2) . ': ' . $request->input('reason'),
            ]);

            // Update booking payment status if applicable
            if ($payment->booking) {
                $booking = $payment->booking;

                // Recalculate total paid after refund
                $totalPaid = $booking->payments()->where('status', 'completed')->sum('amount');

                if ($totalPaid <= 0) {
                    $booking->update(['payment_status' => 'pending']);
                } elseif ($totalPaid < $booking->total_amount) {
                    $booking->update(['payment_status' => 'partially_paid']);
                }
            }

            // Log admin action
            $admin->logAdminAction(
                'refunded',
                Payment::class,
                $payment->id,
                ['status' => $oldStatus, 'amount' => $payment->amount],
                ['status' => 'refunded', 'refund_amount' => $refundAmount],
                'Payment refunded: ' . $request->input('reason')
            );

            DB::commit();

            return back()->with('success', 'Refund processed successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to process refund: ' . $e->getMessage());
        }
    }
}
