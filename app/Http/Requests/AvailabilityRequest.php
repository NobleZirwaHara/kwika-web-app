<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AvailabilityRequest extends FormRequest
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
        return [
            // Basic fields
            'service_id' => ['nullable', 'exists:services,id'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after:start_time'],
            'is_available' => ['nullable', 'boolean'],
            'availability_type' => ['required', 'in:available,blocked,booked'],
            'notes' => ['nullable', 'string', 'max:1000'],

            // Recurring availability fields
            'recurring' => ['nullable', 'boolean'],
            'recurrence_frequency' => ['nullable', 'in:daily,weekly,monthly'],
            'end_recurrence' => ['nullable', 'date', 'after:date'],
            'days_of_week' => ['nullable', 'array'],
            'days_of_week.*' => ['integer', 'min:0', 'max:6'], // 0 = Sunday, 6 = Saturday
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'date.after_or_equal' => 'The date must be today or a future date.',
            'end_time.after' => 'The end time must be after the start time.',
            'end_recurrence.after' => 'The end recurrence date must be after the start date.',
        ];
    }
}
