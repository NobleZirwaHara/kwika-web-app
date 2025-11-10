<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware/controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $productId = $this->route('product');

        return [
            // Basic Information
            'catalogue_id' => ['required', 'exists:catalogues,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'sku' => [
                'nullable',
                'string',
                'max:100',
                'unique:products,sku' . ($productId ? ',' . $productId : ''),
            ],

            // Pricing
            'price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'currency' => ['nullable', 'string', 'size:3'],

            // Inventory
            'stock_quantity' => ['nullable', 'integer', 'min:0'],
            'track_inventory' => ['nullable', 'boolean'],
            'unit' => ['nullable', 'string', 'max:50'],

            // Physical Properties
            'weight' => ['nullable', 'numeric', 'min:0'],
            'dimensions' => ['nullable', 'string', 'max:100'],

            // Additional Details
            'specifications' => ['nullable', 'array'],
            'features' => ['nullable', 'array'],

            // Media
            'primary_image' => ['nullable', 'image', 'max:5120'], // 5MB

            // Status & Visibility
            'is_active' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'catalogue_id.required' => 'Please select a product catalogue.',
            'catalogue_id.exists' => 'The selected catalogue does not exist.',
            'sale_price.lt' => 'The sale price must be less than the regular price.',
            'sku.unique' => 'This SKU is already in use.',
        ];
    }
}
