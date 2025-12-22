<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Payment Gateway
    |--------------------------------------------------------------------------
    |
    | This option controls the default payment gateway that will be used
    | for processing payments. Supported: "flutterwave", "stripe"
    |
    */

    'default_gateway' => env('PAYMENT_DEFAULT_GATEWAY', 'flutterwave'),

    /*
    |--------------------------------------------------------------------------
    | Flutterwave Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Flutterwave payment gateway. Supports card payments,
    | mobile money (M-Pesa, Airtel Money, TNM Mpamba), bank transfers, and USSD.
    |
    */

    'flutterwave' => [
        'public_key' => env('FLUTTERWAVE_PUBLIC_KEY'),
        'secret_key' => env('FLUTTERWAVE_SECRET_KEY'),
        'encryption_key' => env('FLUTTERWAVE_ENCRYPTION_KEY'),
        'webhook_secret' => env('FLUTTERWAVE_WEBHOOK_SECRET'),
        'api_url' => env('FLUTTERWAVE_API_URL', 'https://api.flutterwave.com/v3'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Stripe Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Stripe payment gateway. Primarily for international
    | card payments.
    |
    */

    'stripe' => [
        'public_key' => env('STRIPE_PUBLIC_KEY'),
        'secret_key' => env('STRIPE_SECRET_KEY'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Supported Payment Methods
    |--------------------------------------------------------------------------
    |
    | List of payment methods supported by the platform.
    |
    */

    'methods' => [
        'card' => 'Credit/Debit Card',
        'mobile_money' => 'Mobile Money',
        'bank_transfer' => 'Bank Transfer',
        'ussd' => 'USSD',
        'cash' => 'Cash Payment',
    ],

    /*
    |--------------------------------------------------------------------------
    | Currency Settings
    |--------------------------------------------------------------------------
    */

    'default_currency' => env('PAYMENT_DEFAULT_CURRENCY', 'MWK'),

    'supported_currencies' => [
        'MWK' => 'Malawian Kwacha',
        'USD' => 'US Dollar',
        'ZAR' => 'South African Rand',
        'KES' => 'Kenyan Shilling',
    ],

];
