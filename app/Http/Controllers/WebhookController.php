<?php

namespace App\Http\Controllers;

use App\Services\PaymentGatewayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    protected PaymentGatewayService $paymentService;

    public function __construct(PaymentGatewayService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Handle Flutterwave webhook.
     */
    public function flutterwave(Request $request)
    {
        try {
            // Verify webhook signature
            $isValid = $this->paymentService->verifyWebhookSignature(
                'flutterwave',
                $request->headers->all(),
                $request->getContent()
            );

            if (!$isValid) {
                Log::warning('Invalid Flutterwave webhook signature');
                return response()->json(['error' => 'Invalid signature'], 401);
            }

            // Log webhook for debugging
            Log::info('Flutterwave webhook received', $request->all());

            // Handle webhook
            $this->paymentService->handleWebhook('flutterwave', $request->all());

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Flutterwave webhook error: ' . $e->getMessage(), [
                'payload' => $request->all(),
            ]);

            return response()->json(['error' => 'Webhook processing failed'], 500);
        }
    }

    /**
     * Handle Stripe webhook.
     */
    public function stripe(Request $request)
    {
        try {
            // Verify webhook signature
            $isValid = $this->paymentService->verifyWebhookSignature(
                'stripe',
                $request->headers->all(),
                $request->getContent()
            );

            if (!$isValid) {
                Log::warning('Invalid Stripe webhook signature');
                return response()->json(['error' => 'Invalid signature'], 401);
            }

            // Log webhook for debugging
            Log::info('Stripe webhook received', $request->all());

            // Handle webhook
            $this->paymentService->handleWebhook('stripe', $request->all());

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Stripe webhook error: ' . $e->getMessage(), [
                'payload' => $request->all(),
            ]);

            return response()->json(['error' => 'Webhook processing failed'], 500);
        }
    }

    /**
     * Handle M-Pesa webhook (if using direct integration).
     */
    public function mpesa(Request $request)
    {
        try {
            Log::info('M-Pesa webhook received', $request->all());

            // TODO: Implement M-Pesa webhook handling if using direct integration
            // For now, M-Pesa payments through Flutterwave are handled by flutterwave webhook

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('M-Pesa webhook error: ' . $e->getMessage(), [
                'payload' => $request->all(),
            ]);

            return response()->json(['error' => 'Webhook processing failed'], 500);
        }
    }
}
