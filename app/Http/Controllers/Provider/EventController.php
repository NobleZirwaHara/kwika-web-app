<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\EventRequest;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of events with filtering
     */
    public function index(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        $query = Event::where('service_provider_id', $provider->id);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }

        // Filter by time period
        if ($request->filled('period')) {
            switch ($request->period) {
                case 'upcoming':
                    $query->upcoming();
                    break;
                case 'ongoing':
                    $query->ongoing();
                    break;
                case 'past':
                    $query->past();
                    break;
            }
        }

        // Search by title
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $events = $query->latest('start_datetime')
            ->with('ticketPackages')
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'slug' => $event->slug,
                    'description' => $event->description ? Str::limit($event->description, 150) : null,
                    'type' => $event->type,
                    'category' => $event->category,
                    'venue_name' => $event->venue_name,
                    'venue_city' => $event->venue_city,
                    'is_online' => $event->is_online,
                    'start_datetime' => $event->start_datetime->format('M d, Y g:i A'),
                    'end_datetime' => $event->end_datetime->format('M d, Y g:i A'),
                    'status' => $event->status,
                    'is_featured' => $event->is_featured,
                    'is_upcoming' => $event->is_upcoming,
                    'is_ongoing' => $event->is_ongoing,
                    'is_past' => $event->is_past,
                    'registered_count' => $event->registered_count,
                    'max_attendees' => $event->max_attendees,
                    'capacity_percentage' => $event->capacity_percentage,
                    'spots_remaining' => $event->spots_remaining,
                    'ticket_packages_count' => $event->ticketPackages->count(),
                    'cover_image' => $event->cover_image ? Storage::url($event->cover_image) : null,
                    'created_at' => $event->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Provider/Events/Index', [
            'events' => $events,
            'filters' => [
                'status' => $request->status,
                'category' => $request->category,
                'period' => $request->period,
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new event
     */
    public function create()
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        return Inertia::render('Provider/Events/Create');
    }

    /**
     * Store a newly created event
     */
    public function store(EventRequest $request)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        $data = $request->validated();
        $data['service_provider_id'] = $provider->id;
        $data['registered_count'] = 0;
        $data['checked_in_count'] = 0;

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = 'events/covers/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
            $data['cover_image'] = $file->storeAs('', $filename, 'public');
        }

        $event = Event::create($data);

        // Create ticket packages if provided
        if ($request->has('ticket_packages') && is_array($request->ticket_packages)) {
            foreach ($request->ticket_packages as $index => $package) {
                $event->ticketPackages()->create([
                    'name' => $package['name'],
                    'description' => $package['description'] ?? null,
                    'price' => $package['price'],
                    'currency' => $package['currency'] ?? 'MWK',
                    'quantity_available' => $package['quantity_available'] ?? null,
                    'quantity_sold' => 0,
                    'min_per_order' => $package['min_per_order'] ?? 1,
                    'max_per_order' => $package['max_per_order'] ?? null,
                    'sale_start' => $package['sale_start'] ?? null,
                    'sale_end' => $package['sale_end'] ?? null,
                    'features' => $package['features'] ?? null,
                    'is_active' => $package['is_active'] ?? true,
                    'display_order' => $index,
                ]);
            }
        }

        return redirect()->route('provider.events.index')
            ->with('success', 'Event created successfully');
    }

    /**
     * Show the form for editing the specified event
     */
    public function edit($id)
    {
        $provider = Auth::user()->serviceProvider;

        $event = Event::where('service_provider_id', $provider->id)
            ->with('ticketPackages')
            ->findOrFail($id);

        return Inertia::render('Provider/Events/Edit', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'type' => $event->type,
                'category' => $event->category,
                'venue_name' => $event->venue_name,
                'venue_address' => $event->venue_address,
                'venue_city' => $event->venue_city,
                'venue_country' => $event->venue_country,
                'venue_latitude' => $event->venue_latitude,
                'venue_longitude' => $event->venue_longitude,
                'venue_map_url' => $event->venue_map_url,
                'is_online' => $event->is_online,
                'online_meeting_url' => $event->online_meeting_url,
                'start_datetime' => $event->start_datetime->format('Y-m-d\TH:i'),
                'end_datetime' => $event->end_datetime->format('Y-m-d\TH:i'),
                'timezone' => $event->timezone,
                'registration_start' => $event->registration_start?->format('Y-m-d\TH:i'),
                'registration_end' => $event->registration_end?->format('Y-m-d\TH:i'),
                'max_attendees' => $event->max_attendees,
                'status' => $event->status,
                'is_featured' => $event->is_featured,
                'requires_approval' => $event->requires_approval,
                'cover_image' => $event->cover_image ? Storage::url($event->cover_image) : null,
                'gallery_images' => $event->gallery_images,
                'terms_conditions' => $event->terms_conditions,
                'agenda' => $event->agenda,
                'speakers' => $event->speakers,
                'sponsors' => $event->sponsors,
                'tags' => $event->tags,
                'ticket_packages' => $event->ticketPackages->map(function ($package) {
                    return [
                        'id' => $package->id,
                        'name' => $package->name,
                        'description' => $package->description,
                        'price' => $package->price,
                        'currency' => $package->currency,
                        'quantity_available' => $package->quantity_available,
                        'quantity_sold' => $package->quantity_sold,
                        'min_per_order' => $package->min_per_order,
                        'max_per_order' => $package->max_per_order,
                        'sale_start' => $package->sale_start?->format('Y-m-d\TH:i'),
                        'sale_end' => $package->sale_end?->format('Y-m-d\TH:i'),
                        'features' => $package->features,
                        'is_active' => $package->is_active,
                        'display_order' => $package->display_order,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Update the specified event
     */
    public function update(EventRequest $request, $id)
    {
        $provider = Auth::user()->serviceProvider;

        $event = Event::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $data = $request->validated();

        // Handle cover image upload and remove old one
        if ($request->hasFile('cover_image')) {
            if ($event->cover_image) {
                Storage::disk('public')->delete($event->cover_image);
            }
            $file = $request->file('cover_image');
            $filename = 'events/covers/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
            $data['cover_image'] = $file->storeAs('', $filename, 'public');
        }

        // Don't update slug, counts on updates
        unset($data['slug'], $data['registered_count'], $data['checked_in_count']);

        $event->update($data);

        // Update ticket packages if provided
        if ($request->has('ticket_packages')) {
            // Delete removed packages
            $providedIds = collect($request->ticket_packages)
                ->pluck('id')
                ->filter()
                ->toArray();

            $event->ticketPackages()->whereNotIn('id', $providedIds)->delete();

            // Update or create packages
            foreach ($request->ticket_packages as $index => $packageData) {
                if (isset($packageData['id'])) {
                    // Update existing
                    $package = $event->ticketPackages()->find($packageData['id']);
                    if ($package) {
                        $package->update([
                            'name' => $packageData['name'],
                            'description' => $packageData['description'] ?? null,
                            'price' => $packageData['price'],
                            'currency' => $packageData['currency'] ?? 'MWK',
                            'quantity_available' => $packageData['quantity_available'] ?? null,
                            'min_per_order' => $packageData['min_per_order'] ?? 1,
                            'max_per_order' => $packageData['max_per_order'] ?? null,
                            'sale_start' => $packageData['sale_start'] ?? null,
                            'sale_end' => $packageData['sale_end'] ?? null,
                            'features' => $packageData['features'] ?? null,
                            'is_active' => $packageData['is_active'] ?? true,
                            'display_order' => $index,
                        ]);
                    }
                } else {
                    // Create new
                    $event->ticketPackages()->create([
                        'name' => $packageData['name'],
                        'description' => $packageData['description'] ?? null,
                        'price' => $packageData['price'],
                        'currency' => $packageData['currency'] ?? 'MWK',
                        'quantity_available' => $packageData['quantity_available'] ?? null,
                        'quantity_sold' => 0,
                        'min_per_order' => $packageData['min_per_order'] ?? 1,
                        'max_per_order' => $packageData['max_per_order'] ?? null,
                        'sale_start' => $packageData['sale_start'] ?? null,
                        'sale_end' => $packageData['sale_end'] ?? null,
                        'features' => $packageData['features'] ?? null,
                        'is_active' => $packageData['is_active'] ?? true,
                        'display_order' => $index,
                    ]);
                }
            }
        }

        return redirect()->route('provider.events.index')
            ->with('success', 'Event updated successfully');
    }

    /**
     * Remove the specified event
     */
    public function destroy($id)
    {
        $provider = Auth::user()->serviceProvider;

        $event = Event::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        // Delete associated cover image
        if ($event->cover_image) {
            Storage::disk('public')->delete($event->cover_image);
        }

        $event->delete();

        return redirect()->route('provider.events.index')
            ->with('success', 'Event deleted successfully');
    }
}
