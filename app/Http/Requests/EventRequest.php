<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
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
            // Basic Information
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'in:public,private,hybrid'],
            'category' => ['required', 'in:conference,workshop,concert,festival,sports,exhibition,networking,other'],

            // Venue Details
            'venue_name' => ['nullable', 'string', 'max:255'],
            'venue_address' => ['nullable', 'string'],
            'venue_city' => ['nullable', 'string', 'max:100'],
            'venue_country' => ['nullable', 'string', 'max:100'],
            'venue_latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'venue_longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'venue_map_url' => ['nullable', 'url'],
            'is_online' => ['nullable', 'boolean'],
            'online_meeting_url' => ['nullable', 'url', 'required_if:is_online,true'],

            // Date & Time
            'start_datetime' => ['required', 'date'],
            'end_datetime' => ['required', 'date', 'after:start_datetime'],
            'timezone' => ['nullable', 'string', 'max:50'],
            'registration_start' => ['nullable', 'date', 'before:start_datetime'],
            'registration_end' => ['nullable', 'date', 'before:start_datetime'],

            // Capacity
            'max_attendees' => ['nullable', 'integer', 'min:1'],

            // Status & Visibility
            'status' => ['required', 'in:draft,published,cancelled,postponed,completed'],
            'is_featured' => ['nullable', 'boolean'],
            'requires_approval' => ['nullable', 'boolean'],

            // Media
            'cover_image' => ['nullable', 'image', 'max:5120'], // 5MB
            'gallery_images' => ['nullable', 'array'],

            // Additional Info
            'terms_conditions' => ['nullable', 'string'],
            'agenda' => ['nullable', 'string'],
            'speakers' => ['nullable', 'array'],
            'sponsors' => ['nullable', 'array'],
            'tags' => ['nullable', 'array'],

            // Ticket Packages
            'ticket_packages' => ['nullable', 'array'],
            'ticket_packages.*.id' => ['nullable', 'exists:ticket_packages,id'],
            'ticket_packages.*.name' => ['required', 'string', 'max:255'],
            'ticket_packages.*.description' => ['nullable', 'string'],
            'ticket_packages.*.price' => ['required', 'numeric', 'min:0'],
            'ticket_packages.*.currency' => ['nullable', 'string', 'size:3'],
            'ticket_packages.*.quantity_available' => ['nullable', 'integer', 'min:1'],
            'ticket_packages.*.min_per_order' => ['nullable', 'integer', 'min:1'],
            'ticket_packages.*.max_per_order' => ['nullable', 'integer', 'min:1'],
            'ticket_packages.*.sale_start' => ['nullable', 'date'],
            'ticket_packages.*.sale_end' => ['nullable', 'date'],
            'ticket_packages.*.features' => ['nullable', 'array'],
            'ticket_packages.*.is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'end_datetime.after' => 'The end date must be after the start date.',
            'registration_start.before' => 'Registration start must be before the event start.',
            'registration_end.before' => 'Registration end must be before the event start.',
            'online_meeting_url.required_if' => 'Meeting URL is required for online events.',
        ];
    }
}
