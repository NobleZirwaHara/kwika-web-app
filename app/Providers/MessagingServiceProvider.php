<?php

namespace App\Providers;

use App\Contracts\Broadcasting\RealtimeMessenger;
use App\Services\Broadcasting\NullMessenger;
use App\Services\Broadcasting\ReverbMessenger;
use App\Services\Broadcasting\SupabaseMessenger;
use Illuminate\Support\ServiceProvider;

class MessagingServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(RealtimeMessenger::class, function ($app) {
            $driver = config('messaging.driver', 'null');

            return match ($driver) {
                'supabase' => new SupabaseMessenger(),
                'reverb', 'pusher' => new ReverbMessenger(),
                default => new NullMessenger(),
            };
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
