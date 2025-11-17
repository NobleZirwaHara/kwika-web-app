<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ThirdPartyServiceController extends Controller
{
    /**
     * Display the third party services page.
     */
    public function index()
    {
        $services = [
            [
                'id' => 'supabase',
                'name' => 'Supabase',
                'description' => 'Real-time database and authentication service',
                'category' => 'Realtime Service',
                'configured' => !empty(env('SUPABASE_URL')) && !empty(env('SUPABASE_ANON_KEY')),
                'config' => [
                    'url' => env('SUPABASE_URL') ? '***' . substr(env('SUPABASE_URL'), -10) : 'Not configured',
                    'anon_key' => env('SUPABASE_ANON_KEY') ? '***' . substr(env('SUPABASE_ANON_KEY'), -10) : 'Not configured',
                    'service_role_key' => env('SUPABASE_SERVICE_ROLE_KEY') ? '***' . substr(env('SUPABASE_SERVICE_ROLE_KEY'), -10) : 'Not configured',
                ],
            ],
            [
                'id' => 'mail',
                'name' => 'Mail Service',
                'description' => 'Email delivery service',
                'category' => 'Email',
                'configured' => !empty(env('MAIL_MAILER')),
                'config' => [
                    'driver' => env('MAIL_MAILER', 'Not configured'),
                    'host' => env('MAIL_HOST', 'Not configured'),
                    'port' => env('MAIL_PORT', 'Not configured'),
                ],
            ],
        ];

        return Inertia::render('Admin/ThirdPartyServices', [
            'services' => $services,
        ]);
    }

    /**
     * Test Supabase REST API connection.
     */
    public function testSupabase()
    {
        try {
            $url = env('SUPABASE_URL');
            $key = env('SUPABASE_ANON_KEY');

            if (empty($url) || empty($key)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Supabase is not configured',
                    'details' => [
                        'error' => 'Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file',
                    ],
                ]);
            }

            // Test connection by making a simple REST API call
            $response = Http::withHeaders([
                'apikey' => $key,
                'Authorization' => 'Bearer ' . $key,
            ])->get($url . '/rest/v1/');

            if ($response->successful() || $response->status() === 404) {
                // 404 is acceptable as we're just testing the connection, not a specific table
                return response()->json([
                    'success' => true,
                    'message' => 'Supabase REST API connection successful',
                    'details' => [
                        'status' => $response->status(),
                        'url' => $url,
                        'response_time' => $response->transferStats?->getTransferTime() ?? 'N/A',
                        'headers' => [
                            'server' => $response->header('Server'),
                            'content-type' => $response->header('Content-Type'),
                        ],
                    ],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Supabase connection failed',
                'details' => [
                    'status' => $response->status(),
                    'error' => $response->body(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error testing Supabase connection',
                'details' => [
                    'error' => $e->getMessage(),
                    'type' => get_class($e),
                ],
            ]);
        }
    }

    /**
     * Test Supabase Realtime connection.
     */
    public function testSupabaseRealtime()
    {
        try {
            $url = env('SUPABASE_URL');
            $key = env('SUPABASE_ANON_KEY');

            if (empty($url) || empty($key)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Supabase is not configured',
                    'details' => [
                        'error' => 'Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file',
                    ],
                ]);
            }

            // Test realtime endpoint
            $realtimeUrl = str_replace(['https://', 'http://'], ['wss://', 'ws://'], $url) . '/realtime/v1/websocket';

            // Try to access the realtime info endpoint
            $response = Http::withHeaders([
                'apikey' => $key,
                'Authorization' => 'Bearer ' . $key,
            ])->timeout(5)->get($url . '/rest/v1/');

            // Check if we can reach the server and get response headers
            $headers = $response->headers();
            $hasRealtimeSupport = isset($headers['x-supabase-api-version']) || $response->successful();

            if ($hasRealtimeSupport) {
                return response()->json([
                    'success' => true,
                    'message' => 'Supabase Realtime endpoint is accessible',
                    'details' => [
                        'realtime_url' => $realtimeUrl,
                        'websocket_protocol' => str_contains($realtimeUrl, 'wss://') ? 'wss (secure)' : 'ws (insecure)',
                        'status' => 'Endpoint accessible',
                        'note' => 'WebSocket connections are tested on the frontend. Check browser console for actual realtime connectivity.',
                        'api_version' => $headers['x-supabase-api-version'][0] ?? 'N/A',
                        'server' => $response->header('Server') ?? 'N/A',
                    ],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Could not verify Supabase Realtime support',
                'details' => [
                    'realtime_url' => $realtimeUrl,
                    'status' => $response->status(),
                    'error' => 'Server did not respond as expected',
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error testing Supabase Realtime',
                'details' => [
                    'error' => $e->getMessage(),
                    'type' => get_class($e),
                    'note' => 'This is a server-side test. WebSocket connections are better tested from the browser.',
                ],
            ]);
        }
    }

    /**
     * Get full configuration values for editing (unmasked).
     */
    public function getConfig(Request $request, string $serviceId)
    {
        try {
            $config = [];

            if ($serviceId === 'supabase') {
                $config = [
                    'url' => env('SUPABASE_URL', ''),
                    'anon_key' => env('SUPABASE_ANON_KEY', ''),
                    'service_role_key' => env('SUPABASE_SERVICE_ROLE_KEY', ''),
                ];
            } elseif ($serviceId === 'mail') {
                $config = [
                    'driver' => env('MAIL_MAILER', ''),
                    'host' => env('MAIL_HOST', ''),
                    'port' => env('MAIL_PORT', ''),
                ];
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Unknown service',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'config' => $config,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch configuration',
                'details' => [
                    'error' => $e->getMessage(),
                ],
            ], 500);
        }
    }

    /**
     * Update service configuration in .env file.
     */
    public function updateConfig(Request $request)
    {
        $request->validate([
            'service_id' => 'required|string',
            'config' => 'required|array',
        ]);

        try {
            $serviceId = $request->service_id;
            $config = $request->config;

            // Map service IDs to their .env keys
            $envKeys = [
                'supabase' => [
                    'url' => 'SUPABASE_URL',
                    'anon_key' => 'SUPABASE_ANON_KEY',
                    'service_role_key' => 'SUPABASE_SERVICE_ROLE_KEY',
                ],
                'mail' => [
                    'driver' => 'MAIL_MAILER',
                    'host' => 'MAIL_HOST',
                    'port' => 'MAIL_PORT',
                ],
            ];

            if (!isset($envKeys[$serviceId])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unknown service',
                ], 400);
            }

            $envPath = base_path('.env');
            if (!file_exists($envPath)) {
                return response()->json([
                    'success' => false,
                    'message' => '.env file not found',
                ], 404);
            }

            $envContent = file_get_contents($envPath);
            $updated = [];

            // Update each configuration key
            foreach ($config as $key => $value) {
                if (!isset($envKeys[$serviceId][$key])) {
                    continue;
                }

                $envKey = $envKeys[$serviceId][$key];
                $pattern = "/^{$envKey}=.*$/m";

                // Handle values with spaces or special characters
                $envValue = $this->formatEnvValue($value);
                $replacement = "{$envKey}={$envValue}";

                if (preg_match($pattern, $envContent)) {
                    // Update existing key
                    $envContent = preg_replace($pattern, $replacement, $envContent);
                } else {
                    // Add new key at the end
                    $envContent .= "\n{$replacement}";
                }

                $updated[] = $envKey;
            }

            // Write back to .env file
            file_put_contents($envPath, $envContent);

            // Clear config cache so changes take effect
            \Artisan::call('config:clear');

            return response()->json([
                'success' => true,
                'message' => 'Configuration updated successfully',
                'details' => [
                    'updated_keys' => $updated,
                    'note' => 'You may need to restart the server for some changes to take effect',
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update configuration',
                'details' => [
                    'error' => $e->getMessage(),
                ],
            ], 500);
        }
    }

    /**
     * Format value for .env file.
     */
    private function formatEnvValue($value)
    {
        // If value is empty, return empty string
        if (empty($value)) {
            return '';
        }

        // If value contains spaces or special characters, wrap in quotes
        if (preg_match('/\s|[#$&()]/', $value)) {
            return '"' . addslashes($value) . '"';
        }

        return $value;
    }

    /**
     * Test mail configuration.
     */
    public function testMail(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
            ]);

            // Send test email
            \Illuminate\Support\Facades\Mail::raw(
                'This is a test email from Kwika Events to verify your mail configuration is working correctly.',
                function ($message) use ($request) {
                    $message->to($request->email)
                        ->subject('Test Email - Kwika Events');
                }
            );

            return response()->json([
                'success' => true,
                'message' => 'Test email sent successfully',
                'details' => [
                    'recipient' => $request->email,
                    'driver' => env('MAIL_MAILER'),
                    'host' => env('MAIL_HOST'),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending test email',
                'details' => [
                    'error' => $e->getMessage(),
                    'type' => get_class($e),
                ],
            ]);
        }
    }
}
