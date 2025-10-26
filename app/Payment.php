<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id', 'user_id', 'booking_id', 'provider_subscription_id',
        'payment_type', 'amount', 'currency', 'payment_method', 'status',
        'payment_gateway', 'gateway_transaction_id', 'gateway_response', 'notes', 'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function providerSubscription()
    {
        return $this->belongsTo(ProviderSubscription::class);
    }
}
