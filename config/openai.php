<?php

return [
    /*
    |--------------------------------------------------------------------------
    | OpenAI API Key
    |--------------------------------------------------------------------------
    |
    | Your OpenAI API key for accessing GPT models
    |
    */
    'api_key' => env('OPENAI_API_KEY'),

    /*
    |--------------------------------------------------------------------------
    | OpenAI Organization ID (Optional)
    |--------------------------------------------------------------------------
    |
    | Your OpenAI organization ID if applicable
    |
    */
    'organization' => env('OPENAI_ORGANIZATION'),

    /*
    |--------------------------------------------------------------------------
    | Default Model
    |--------------------------------------------------------------------------
    |
    | The default GPT model to use for requests
    |
    */
    'model' => env('OPENAI_MODEL', 'gpt-4-turbo-preview'),

    /*
    |--------------------------------------------------------------------------
    | Request Timeout
    |--------------------------------------------------------------------------
    |
    | Maximum time in seconds to wait for API response
    |
    */
    'timeout' => env('OPENAI_TIMEOUT', 120),

    /*
    |--------------------------------------------------------------------------
    | Max Tokens
    |--------------------------------------------------------------------------
    |
    | Maximum number of tokens to generate in the response
    |
    */
    'max_tokens' => env('OPENAI_MAX_TOKENS', 4000),
];
