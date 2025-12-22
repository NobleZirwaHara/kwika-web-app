<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\TicketOrder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentGatewayService
{
    private string $defaultGateway;

    public function __construct()
    {
        $this->defaultGateway = config('payment.default_gateway', 'flutterwave');
    }

    /**
     * Create a payment intent for an order.
     *
     * @return array ['payment_url' => string, 'reference' => string]
     */
    public function createPaymentIntent(TicketOrder $order, ?string $gateway = null): array
    {
        $gateway = $gateway ?? $this->defaultGateway;

        return match ($gateway) {
            'flutterwave' => $this->createFlutterwavePayment($order),
            'stripe' => $this->createStripePayment($order),
            default => throw new \Exception("Unsupported payment gateway: {$gateway}"),
        };
    }

    /**
     * Process payment and create Payment record.
     */
    public function processPayment(TicketOrder $order, array $paymentData, ?string $gateway = null): Payment
    {
        $gateway = $gateway ?? $this->defaultGateway;

        $payment = Payment::create([
            'user_id' => $order->user_id,
            'payment_method' => $paymentData['payment_method'] ?? 'card',
            'amount' => $order->final_amount,
            'currency' => $order->currency,
            'status' => 'pending',
            'transaction_reference' => $paymentData['reference'] ?? Str::uuid(),
            'payment_gateway' => $gateway,
            'metadata' => json_encode([
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'event_id' => $order->event_id,
            ]),
        ]);

        // Update order with payment reference
        $order->update([
            'payment_id' => $payment->id,
            'payment_status' => 'pending',
        ]);

        return $payment;
    }

    /**
     * Handle webhook from payment gateway.
     */
    public function handleWebhook(string $gateway, array $payload): void
    {
        match ($gateway) {
            'flutterwave' => $this->handleFlutterwaveWebhook($payload),
            'stripe' => $this->handleStripeWebhook($payload),
            default => Log::warning("Unknown webhook gateway: {$gateway}"),
        };
    }

    /**
     * Refund a payment.
     */
    public function refundPayment(Payment $payment, ?float $amount = null): bool
    {
        $refundAmount = $amount ?? $payment->amount;

        try {
            $success = match ($payment->payment_gateway) {
                'flutterwave' => $this->refundFlutterwavePayment($payment, $refundAmount),
                'stripe' => $this->refundStripePayment($payment, $refundAmount),
                default => false,
            };

            if ($success) {
                $payment->update([
                    'status' => 'refunded',
                    'refunded_at' => now(),
                    'refund_amount' => $refundAmount,
                ]);

                // Update related order
                if (isset($payment->metadata['order_id'])) {
                    $order = TicketOrder::find($payment->metadata['order_id']);
                    $order?->update([
                        'status' => 'refunded',
                        'payment_status' => 'refunded',
                    ]);
                }
            }

            return $success;
        } catch (\Exception $e) {
            Log::error('Refund failed: ' . $e->getMessage(), [
                'payment_id' => $payment->id,
                'amount' => $refundAmount,
            ]);
            return false;
        }
    }

    /**
     * Verify webhook signature for security.
     */
    public function verifyWebhookSignature(string $gateway, array $headers, string $payload): bool
    {
        return match ($gateway) {
            'flutterwave' => $this->verifyFlutterwaveSignature($headers, $payload),
            'stripe' => $this->verifyStripeSignature($headers, $payload),
            default => false,
        };
    }

    // ==================== FLUTTERWAVE METHODS ====================

    /**
     * Create Flutterwave payment.
     */
    private function createFlutterwavePayment(TicketOrder $order): array
    {
        $reference = 'FLW-' . strtoupper(Str::random(16));

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('payment.flutterwave.secret_key'),
            'Content-Type' => 'application/json',
        ])->post('https://api.flutterwave.com/v3/payments', [
            'tx_ref' => $reference,
            'amount' => $order->final_amount,
            'currency' => $order->currency,
            'redirect_url' => route('ticket-orders.confirmation', $order),
            'payment_options' => 'card,mobilemoney,ussd,bank_transfer',
            'customer' => [
                'email' => $order->billing_email,
                'name' => $order->billing_name,
                'phonenumber' => $order->billing_phone,
            ],
            'customizations' => [
                'title' => 'Event Ticket Purchase',
                'description' => "Tickets for {$order->event->title}",
                'logo' => asset('kwika-logo.png'),
            ],
            'meta' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'event_id' => $order->event_id,
            ],
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return [
                'payment_url' => $data['data']['link'],
                'reference' => $reference,
            ];
        }

        throw new \Exception('Failed to create Flutterwave payment: ' . $response->body());
    }

    /**
     * Handle Flutterwave webhook.
     */
    private function handleFlutterwaveWebhook(array $payload): void
    {
        if (!isset($payload['event']) || $payload['event'] !== 'charge.completed') {
            return;
        }

        $data = $payload['data'] ?? [];
        $status = $data['status'] ?? '';
        $reference = $data['tx_ref'] ?? '';

        // Find payment by reference
        $payment = Payment::where('transaction_reference', $reference)->first();

        if (!$payment) {
            Log::warning('Payment not found for Flutterwave webhook', ['reference' => $reference]);
            return;
        }

        // Prevent duplicate processing
        if ($payment->status === 'completed') {
            return;
        }

        // Update payment status
        if ($status === 'successful') {
            $payment->update([
                'status' => 'completed',
                'paid_at' => now(),
                'gateway_response' => json_encode($data),
            ]);

            // Update order
            $metadata = is_string($payment->metadata) ? json_decode($payment->metadata, true) : $payment->metadata;
            if ($orderId = $metadata['order_id'] ?? null) {
                $order = TicketOrder::find($orderId);
                if ($order) {
                    $order->update([
                        'status' => 'confirmed',
                        'payment_status' => 'completed',
                    ]);

                    // Trigger ticket generation
                    $this->generateTicketsForOrder($order);
                }
            }
        } else {
            $payment->update([
                'status' => 'failed',
                'gateway_response' => json_encode($data),
            ]);
        }
    }

    /**
     * Verify Flutterwave webhook signature.
     */
    private function verifyFlutterwaveSignature(array $headers, string $payload): bool
    {
        $secretHash = config('payment.flutterwave.webhook_secret');
        $signature = $headers['verif-hash'] ?? $headers['Verif-Hash'] ?? null;

        if (!$signature || !$secretHash) {
            return false;
        }

        return $signature === $secretHash;
    }

    /**
     * Refund Flutterwave payment.
     */
    private function refundFlutterwavePayment(Payment $payment, float $amount): bool
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('payment.flutterwave.secret_key'),
            'Content-Type' => 'application/json',
        ])->post('https://api.flutterwave.com/v3/refunds', [
            'id' => $payment->transaction_reference,
            'amount' => $amount,
        ]);

        return $response->successful();
    }

    // ==================== STRIPE METHODS ====================

    /**
     * Create Stripe payment.
     */
    private function createStripePayment(TicketOrder $order): array
    {
        // TODO: Implement Stripe payment creation
        throw new \Exception('Stripe integration not yet implemented');
    }

    /**
     * Handle Stripe webhook.
     */
    private function handleStripeWebhook(array $payload): void
    {
        // TODO: Implement Stripe webhook handling
        Log::info('Stripe webhook received but not yet implemented', $payload);
    }

    /**
     * Verify Stripe webhook signature.
     */
    private function verifyStripeSignature(array $headers, string $payload): bool
    {
        // TODO: Implement Stripe signature verification
        return false;
    }

    /**
     * Refund Stripe payment.
     */
    private function refundStripePayment(Payment $payment, float $amount): bool
    {
        // TODO: Implement Stripe refund
        return false;
    }

    // ==================== HELPER METHODS ====================

    /**
     * Generate tickets after successful payment.
     */
    private function generateTicketsForOrder(TicketOrder $order): void
    {
        // This will be called by a queued job in production
        // For now, we'll just log it
        Log::info('Tickets should be generated for order', ['order_id' => $order->id]);

        // TODO: Dispatch ticket generation job
        // dispatch(new GenerateTicketsJob($order));
    }
}
