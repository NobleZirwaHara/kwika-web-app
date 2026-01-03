<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'currency',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    // Accessors
    public function getTotalItemsAttribute(): int
    {
        return $this->items->sum('quantity');
    }

    public function getSubtotalAttribute(): float
    {
        return $this->items->sum('total_price');
    }

    public function getFormattedSubtotalAttribute(): string
    {
        return $this->currency . ' ' . number_format($this->subtotal, 0, '.', ',');
    }

    // Methods
    public function addItem(Product $product, int $quantity = 1): CartItem
    {
        $existingItem = $this->items()->where('product_id', $product->id)->first();

        if ($existingItem) {
            $existingItem->quantity += $quantity;
            $existingItem->total_price = $existingItem->quantity * $existingItem->unit_price;
            $existingItem->save();
            return $existingItem;
        }

        $price = $product->sale_price && $product->sale_price < $product->price
            ? $product->sale_price
            : $product->price;

        return $this->items()->create([
            'product_id' => $product->id,
            'quantity' => $quantity,
            'unit_price' => $price,
            'total_price' => $price * $quantity,
        ]);
    }

    public function updateItemQuantity(int $itemId, int $quantity): ?CartItem
    {
        $item = $this->items()->find($itemId);

        if (!$item) {
            return null;
        }

        if ($quantity <= 0) {
            $item->delete();
            return null;
        }

        $item->quantity = $quantity;
        $item->total_price = $item->unit_price * $quantity;
        $item->save();

        return $item;
    }

    public function removeItem(int $itemId): bool
    {
        return $this->items()->where('id', $itemId)->delete() > 0;
    }

    public function clear(): void
    {
        $this->items()->delete();
    }

    public function isEmpty(): bool
    {
        return $this->items->isEmpty();
    }

    // Static methods
    public static function getOrCreateForUser(?int $userId, ?string $sessionId): self
    {
        if ($userId) {
            $cart = self::where('user_id', $userId)->first();

            if ($cart) {
                // Merge session cart if exists
                if ($sessionId) {
                    $sessionCart = self::where('session_id', $sessionId)->whereNull('user_id')->first();
                    if ($sessionCart) {
                        foreach ($sessionCart->items as $item) {
                            $cart->addItem($item->product, $item->quantity);
                        }
                        $sessionCart->delete();
                    }
                }
                return $cart;
            }

            // Check for session cart to convert
            if ($sessionId) {
                $sessionCart = self::where('session_id', $sessionId)->whereNull('user_id')->first();
                if ($sessionCart) {
                    $sessionCart->user_id = $userId;
                    $sessionCart->session_id = null;
                    $sessionCart->save();
                    return $sessionCart;
                }
            }

            return self::create(['user_id' => $userId]);
        }

        if ($sessionId) {
            return self::firstOrCreate(
                ['session_id' => $sessionId, 'user_id' => null],
                ['currency' => 'MWK']
            );
        }

        return new self(['currency' => 'MWK']);
    }
}
