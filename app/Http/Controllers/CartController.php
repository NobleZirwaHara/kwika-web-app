<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Get or create cart for current user/session
     */
    private function getCart(Request $request): Cart
    {
        $userId = auth()->id();
        $sessionId = $request->session()->get('cart_session_id');

        if (!$sessionId && !$userId) {
            $sessionId = Str::uuid()->toString();
            $request->session()->put('cart_session_id', $sessionId);
        }

        return Cart::getOrCreateForUser($userId, $sessionId);
    }

    /**
     * Display cart page
     */
    public function index(Request $request)
    {
        $cart = $this->getCart($request);
        $cart->load(['items.product.serviceProvider']);

        return Inertia::render('Cart', [
            'cart' => $this->formatCart($cart),
        ]);
    }

    /**
     * Get cart data (for API/AJAX)
     */
    public function show(Request $request)
    {
        $cart = $this->getCart($request);
        $cart->load(['items.product.serviceProvider']);

        return response()->json([
            'cart' => $this->formatCart($cart),
        ]);
    }

    /**
     * Add item to cart
     */
    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1|max:100',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check stock
        if ($product->track_inventory && $product->stock_quantity < ($request->quantity ?? 1)) {
            return response()->json([
                'success' => false,
                'message' => 'Not enough stock available',
            ], 422);
        }

        $cart = $this->getCart($request);
        $item = $cart->addItem($product, $request->quantity ?? 1);

        $cart->load(['items.product.serviceProvider']);

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart',
            'cart' => $this->formatCart($cart),
            'item' => $this->formatCartItem($item),
        ]);
    }

    /**
     * Update item quantity
     */
    public function updateItem(Request $request, int $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0|max:100',
        ]);

        $cart = $this->getCart($request);
        $item = $cart->items()->with('product')->find($itemId);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found in cart',
            ], 404);
        }

        // Check stock if increasing quantity
        if ($request->quantity > $item->quantity) {
            $product = $item->product;
            if ($product->track_inventory && $product->stock_quantity < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not enough stock available',
                ], 422);
            }
        }

        $cart->updateItemQuantity($itemId, $request->quantity);
        $cart->load(['items.product.serviceProvider']);

        return response()->json([
            'success' => true,
            'message' => $request->quantity > 0 ? 'Cart updated' : 'Item removed from cart',
            'cart' => $this->formatCart($cart),
        ]);
    }

    /**
     * Remove item from cart
     */
    public function removeItem(Request $request, int $itemId)
    {
        $cart = $this->getCart($request);
        $removed = $cart->removeItem($itemId);

        if (!$removed) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found in cart',
            ], 404);
        }

        $cart->load(['items.product.serviceProvider']);

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart',
            'cart' => $this->formatCart($cart),
        ]);
    }

    /**
     * Clear all items from cart
     */
    public function clear(Request $request)
    {
        $cart = $this->getCart($request);
        $cart->clear();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared',
            'cart' => $this->formatCart($cart),
        ]);
    }

    /**
     * Get cart count (for header badge)
     */
    public function count(Request $request)
    {
        $cart = $this->getCart($request);

        return response()->json([
            'count' => $cart->total_items,
            'subtotal' => $cart->formatted_subtotal,
        ]);
    }

    /**
     * Format cart for frontend
     */
    private function formatCart(Cart $cart): array
    {
        return [
            'id' => $cart->id,
            'items' => $cart->items->map(fn($item) => $this->formatCartItem($item))->toArray(),
            'total_items' => $cart->total_items,
            'subtotal' => $cart->subtotal,
            'formatted_subtotal' => $cart->formatted_subtotal,
            'currency' => $cart->currency,
            'is_empty' => $cart->isEmpty(),
        ];
    }

    /**
     * Format cart item for frontend
     */
    private function formatCartItem($item): array
    {
        $product = $item->product;

        return [
            'id' => $item->id,
            'product_id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'image' => $product->primary_image,
            'quantity' => $item->quantity,
            'unit_price' => (float) $item->unit_price,
            'total_price' => (float) $item->total_price,
            'formatted_unit_price' => $item->formatted_unit_price,
            'formatted_total_price' => $item->formatted_total_price,
            'in_stock' => $product->is_in_stock,
            'stock_quantity' => $product->stock_quantity,
            'provider' => $product->serviceProvider ? [
                'id' => $product->serviceProvider->id,
                'name' => $product->serviceProvider->business_name,
                'slug' => $product->serviceProvider->slug,
            ] : null,
        ];
    }
}
