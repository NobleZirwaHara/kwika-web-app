<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PushSubscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class PushNotificationController extends Controller
{
    /**
     * Subscribe to push notifications
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'subscription' => 'required|array',
            'subscription.endpoint' => 'required|string',
            'preferences' => 'array',
        ]);

        $subscription = $request->input('subscription');
        $preferences = $request->input('preferences', [
            'bookings' => true,
            'messages' => true,
            'promotions' => true,
            'updates' => false,
            'reminders' => true,
        ]);

        // Extract browser and device info from user agent
        $userAgent = $request->userAgent();
        $browser = $this->detectBrowser($userAgent);
        $deviceType = $this->detectDeviceType($userAgent);

        // Create or update subscription
        $pushSubscription = PushSubscription::updateOrCreate(
            ['endpoint' => $subscription['endpoint']],
            [
                'user_id' => Auth::id(),
                'public_key' => $subscription['keys']['p256dh'] ?? null,
                'auth_token' => $subscription['keys']['auth'] ?? null,
                'content_encoding' => $subscription['contentEncoding'] ?? 'aesgcm',
                'preferences' => $preferences,
                'browser' => $browser,
                'device_type' => $deviceType,
                'active' => true,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Successfully subscribed to push notifications',
            'subscription_id' => $pushSubscription->id,
        ]);
    }

    /**
     * Update notification preferences
     */
    public function updatePreferences(Request $request)
    {
        $request->validate([
            'preferences' => 'required|array',
        ]);

        $userId = Auth::id();

        if ($userId) {
            PushSubscription::forUser($userId)
                ->active()
                ->update(['preferences' => $request->input('preferences')]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Preferences updated successfully',
        ]);
    }

    /**
     * Unsubscribe from push notifications
     */
    public function unsubscribe(Request $request)
    {
        $userId = Auth::id();

        if ($userId) {
            PushSubscription::forUser($userId)
                ->update(['active' => false]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Successfully unsubscribed from push notifications',
        ]);
    }

    /**
     * Get pending notifications (for polling)
     */
    public function pending()
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json([]);
        }

        // This would typically fetch from a notifications table
        // For now, return empty array
        return response()->json([]);
    }

    /**
     * Track dismissed notifications
     */
    public function dismissed(Request $request)
    {
        $request->validate([
            'trackingId' => 'required|string',
            'timestamp' => 'required|numeric',
        ]);

        // Log dismissed notification for analytics
        // You might want to store this in a database

        return response()->json(['success' => true]);
    }

    /**
     * Send a test notification
     */
    public function test(Request $request)
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $subscriptions = PushSubscription::forUser($userId)->active()->get();

        if ($subscriptions->isEmpty()) {
            return response()->json(['error' => 'No active subscriptions found'], 404);
        }

        $auth = [
            'VAPID' => [
                'subject' => config('app.url'),
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ];

        $webPush = new WebPush($auth);

        $payload = json_encode([
            'title' => 'Test Notification',
            'body' => 'This is a test notification from Kwika Events!',
            'icon' => '/android-icon-192x192.png',
            'badge' => '/android-icon-96x96.png',
            'url' => '/',
            'tag' => 'test-' . time(),
        ]);

        foreach ($subscriptions as $subscription) {
            $sub = Subscription::create([
                'endpoint' => $subscription->endpoint,
                'publicKey' => $subscription->public_key,
                'authToken' => $subscription->auth_token,
                'contentEncoding' => $subscription->content_encoding,
            ]);

            $webPush->queueNotification($sub, $payload);
        }

        $results = [];
        foreach ($webPush->flush() as $report) {
            $endpoint = $report->getRequest()->getUri()->__toString();

            if ($report->isSuccess()) {
                $results[] = ['endpoint' => $endpoint, 'success' => true];
            } else {
                $results[] = [
                    'endpoint' => $endpoint,
                    'success' => false,
                    'reason' => $report->getReason(),
                ];

                // If subscription expired, deactivate it
                if ($report->isSubscriptionExpired()) {
                    PushSubscription::where('endpoint', $endpoint)->update(['active' => false]);
                }
            }
        }

        return response()->json([
            'success' => true,
            'results' => $results,
        ]);
    }

    /**
     * Send notification to specific user
     */
    public function sendToUser($userId, $title, $body, $data = [])
    {
        $subscriptions = PushSubscription::forUser($userId)->active()->get();

        if ($subscriptions->isEmpty()) {
            return false;
        }

        $auth = [
            'VAPID' => [
                'subject' => config('app.url'),
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ];

        $webPush = new WebPush($auth);

        $payload = json_encode(array_merge([
            'title' => $title,
            'body' => $body,
            'icon' => '/android-icon-192x192.png',
            'badge' => '/android-icon-96x96.png',
            'timestamp' => time(),
        ], $data));

        foreach ($subscriptions as $subscription) {
            // Check preferences
            if (!$this->shouldSendBasedOnPreferences($subscription, $data['type'] ?? 'general')) {
                continue;
            }

            $sub = Subscription::create([
                'endpoint' => $subscription->endpoint,
                'publicKey' => $subscription->public_key,
                'authToken' => $subscription->auth_token,
                'contentEncoding' => $subscription->content_encoding,
            ]);

            $webPush->queueNotification($sub, $payload);
        }

        foreach ($webPush->flush() as $report) {
            if ($report->isSubscriptionExpired()) {
                $endpoint = $report->getRequest()->getUri()->__toString();
                PushSubscription::where('endpoint', $endpoint)->update(['active' => false]);
            }
        }

        return true;
    }

    /**
     * Check if notification should be sent based on preferences
     */
    private function shouldSendBasedOnPreferences($subscription, $type)
    {
        $preferences = $subscription->preferences ?? [];

        $typeMapping = [
            'booking' => 'bookings',
            'message' => 'messages',
            'promotion' => 'promotions',
            'update' => 'updates',
            'reminder' => 'reminders',
        ];

        $preferenceKey = $typeMapping[$type] ?? null;

        if (!$preferenceKey) {
            return true; // Send if type not in preferences
        }

        return $preferences[$preferenceKey] ?? true;
    }

    /**
     * Detect browser from user agent
     */
    private function detectBrowser($userAgent)
    {
        if (strpos($userAgent, 'Chrome') !== false) return 'chrome';
        if (strpos($userAgent, 'Firefox') !== false) return 'firefox';
        if (strpos($userAgent, 'Safari') !== false) return 'safari';
        if (strpos($userAgent, 'Edge') !== false) return 'edge';
        if (strpos($userAgent, 'Opera') !== false) return 'opera';
        return 'other';
    }

    /**
     * Detect device type from user agent
     */
    private function detectDeviceType($userAgent)
    {
        if (preg_match('/Mobile|Android|iPhone/i', $userAgent)) return 'mobile';
        if (preg_match('/Tablet|iPad/i', $userAgent)) return 'tablet';
        return 'desktop';
    }
}
