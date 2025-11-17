<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Messaging Driver
    |--------------------------------------------------------------------------
    |
    | This option controls the default messaging driver that will be used for
    | broadcasting realtime messages. You may set this to any of the drivers
    | defined in the "drivers" configuration array below.
    |
    | Supported: "supabase", "reverb", "pusher", "null"
    |
    */

    'driver' => env('MESSAGING_DRIVER', 'supabase'),

    /*
    |--------------------------------------------------------------------------
    | Messaging Drivers Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the messaging drivers for your application
    | as well as their settings. Several examples have been configured for
    | you and you are free to add your own as your application requires.
    |
    */

    'drivers' => [

        'supabase' => [
            'url' => env('SUPABASE_URL'),
            'anon_key' => env('SUPABASE_ANON_KEY'),
            'service_role_key' => env('SUPABASE_SERVICE_ROLE_KEY'),
        ],

        'reverb' => [
            'app_id' => env('REVERB_APP_ID'),
            'key' => env('REVERB_APP_KEY'),
            'secret' => env('REVERB_APP_SECRET'),
            'host' => env('REVERB_HOST', 'localhost'),
            'port' => env('REVERB_PORT', 8080),
            'scheme' => env('REVERB_SCHEME', 'http'),
        ],

        'pusher' => [
            'app_id' => env('PUSHER_APP_ID'),
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'cluster' => env('PUSHER_APP_CLUSTER', 'mt1'),
            'host' => env('PUSHER_HOST'),
            'port' => env('PUSHER_PORT', 443),
            'scheme' => env('PUSHER_SCHEME', 'https'),
        ],

        'null' => [
            // Null driver - does not broadcast messages
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | File Upload Settings
    |--------------------------------------------------------------------------
    |
    | Configure file upload settings for message attachments.
    |
    */

    'file_upload' => [
        'max_size' => env('MESSAGE_MAX_FILE_SIZE', 5120), // 5MB in kilobytes
        'allowed_types' => ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        'disk' => env('MESSAGE_FILE_DISK', 'public'),
        'path' => 'message-attachments',
    ],

    /*
    |--------------------------------------------------------------------------
    | Typing Indicator Settings
    |--------------------------------------------------------------------------
    |
    | Configure typing indicator behavior.
    |
    */

    'typing' => [
        'timeout' => 5, // seconds before typing indicator is cleared
        'throttle' => 1, // seconds to throttle typing broadcasts
    ],

];
