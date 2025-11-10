<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PromotionRequest extends FormRequest
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
        $promotionId = $this->route('promotion');

        return [
            'type' => ['required', 'in:percentage,fixed_amount,bundle,early_bird'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'code' => [
                'nullable',
                'string',
                'max:50',
                'regex:/^[A-Z0-9_-]+$/',
                'unique:promotions,code,' . $promotionId
            ],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'min_booking_amount' => ['nullable', 'numeric', 'min:0'],
            'max_discount_amount' => ['nullable', 'numeric', 'min:0'],
            'applicable_to' => ['required', 'in:all_services,specific_services,specific_categories'],
            'service_ids' => ['nullable', 'array'],
            'service_ids.*' => ['exists:services,id'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['exists:service_categories,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'per_customer_limit' => ['required', 'integer', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
            'priority' => ['nullable', 'integer', 'min:0'],
            'terms_conditions' => ['nullable', 'string'],
            'banner_image' => ['nullable', 'image', 'max:5120'], // 5MB
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'code.regex' => 'The promo code must only contain uppercase letters, numbers, hyphens, and underscores.',
            'end_date.after' => 'The end date must be after the start date.',
        ];
    }
}
