<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\ServiceProvider;
use App\Models\TicketPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EventsController extends Controller
{
    /**
     * Display a listing of events
     */
    public function index(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        // Get filter parameters
        $search = $request->input('search');
        $provider = $request->input('provider'); // provider_id
        $category = $request->input('category');
        $type = $request->input('type');
        $status = $request->input('status', 'all'); // all, published, draft, cancelled
        $timeframe = $request->input('timeframe', 'all'); // all, upcoming, ongoing, past
        $sortBy = $request->input('sort_by', 'start_datetime');
        $sortOrder = $request->input('sort_order', 'desc');

        // Build query
        $query = Event::with(['serviceProvider', 'ticketPackages'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('venue_name', 'like', "%{$search}%")
                        ->orWhere('venue_city', 'like', "%{$search}%")
                        ->orWhereHas('serviceProvider', function ($q) use ($search) {
                            $q->where('business_name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($provider, function ($q) use ($provider) {
                return $q->where('service_provider_id', $provider);
            })
            ->when($category, function ($q) use ($category) {
                return $q->where('category', $category);
            })
            ->when($type, function ($q) use ($type) {
                return $q->where('type', $type);
            })
            ->when($status !== 'all', function ($q) use ($status) {
                return $q->where('status', $status);
            })
            ->when($timeframe !== 'all', function ($q) use ($timeframe) {
                switch ($timeframe) {
                    case 'upcoming':
                        return $q->upcoming();
                    case 'ongoing':
                        return $q->ongoing();
                    case 'past':
                        return $q->past();
                }
            });

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $events = $query->paginate(20)->withQueryString();

        // Transform data for frontend
        $eventsData = $events->through(function ($event) {
            $ticketPackages = $event->ticketPackages;
            $lowestPrice = $ticketPackages->min('price');
            $highestPrice = $ticketPackages->max('price');

            return [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'description' => $event->description ? Str::limit($event->description, 150) : null,
                'type' => $event->type,
                'category' => $event->category,
                'venue_name' => $event->venue_name,
                'venue_city' => $event->venue_city,
                'venue_country' => $event->venue_country,
                'is_online' => $event->is_online,
                'start_datetime' => $event->start_datetime->format('Y-m-d H:i:s'),
                'end_datetime' => $event->end_datetime->format('Y-m-d H:i:s'),
                'start_datetime_formatted' => $event->start_datetime->format('M d, Y - h:i A'),
                'end_datetime_formatted' => $event->end_datetime->format('M d, Y - h:i A'),
                'registration_start' => $event->registration_start?->format('Y-m-d H:i:s'),
                'registration_end' => $event->registration_end?->format('Y-m-d H:i:s'),
                'max_attendees' => $event->max_attendees,
                'registered_count' => $event->registered_count,
                'checked_in_count' => $event->checked_in_count,
                'status' => $event->status,
                'is_featured' => $event->is_featured,
                'cover_image' => $event->cover_image,
                'is_upcoming' => $event->is_upcoming,
                'is_ongoing' => $event->is_ongoing,
                'is_past' => $event->is_past,
                'is_full' => $event->is_full,
                'capacity_percentage' => $event->capacity_percentage,
                'spots_remaining' => $event->spots_remaining,
                'price_range' => $lowestPrice && $highestPrice
                    ? ($lowestPrice === $highestPrice
                        ? number_format($lowestPrice, 2)
                        : number_format($lowestPrice, 2) . ' - ' . number_format($highestPrice, 2))
                    : 'Free',
                'ticket_count' => $ticketPackages->count(),
                'created_at' => $event->created_at->format('M d, Y'),
                'service_provider' => [
                    'id' => $event->serviceProvider->id,
                    'business_name' => $event->serviceProvider->business_name,
                    'slug' => $event->serviceProvider->slug,
                ],
            ];
        });

        // Get statistics
        $stats = [
            'total' => Event::count(),
            'upcoming' => Event::upcoming()->count(),
            'ongoing' => Event::ongoing()->count(),
            'past' => Event::past()->count(),
            'published' => Event::published()->count(),
            'featured' => Event::featured()->count(),
            'total_attendees' => Event::sum('registered_count'),
        ];

        // Get unique categories and types for filters
        $categories = Event::distinct()->pluck('category')->filter()->sort()->values();
        $types = Event::distinct()->pluck('type')->filter()->sort()->values();

        // Get providers for filter
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        return Inertia::render('Admin/Events/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'events' => $eventsData,
            'stats' => $stats,
            'categories' => $categories,
            'types' => $types,
            'providers' => $providers,
            'filters' => [
                'search' => $search,
                'provider' => $provider,
                'category' => $category,
                'type' => $type,
                'status' => $status,
                'timeframe' => $timeframe,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for creating a new event
     */
    public function create()
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to create events.');
        }

        // Get providers for dropdown
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        // Get unique categories and types
        $categories = Event::distinct()->pluck('category')->filter()->sort()->values();
        $types = Event::distinct()->pluck('type')->filter()->sort()->values();

        return Inertia::render('Admin/Events/Create', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'providers' => $providers,
            'categories' => $categories,
            'types' => $types,
        ]);
    }

    /**
     * Store a newly created event
     */
    public function store(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to create events.');
        }

        $validated = $request->validate([
            'service_provider_id' => 'required|exists:service_providers,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'venue_name' => 'required_if:is_online,false|nullable|string|max:255',
            'venue_address' => 'nullable|string',
            'venue_city' => 'nullable|string|max:100',
            'venue_country' => 'nullable|string|max:100',
            'venue_latitude' => 'nullable|numeric',
            'venue_longitude' => 'nullable|numeric',
            'venue_map_url' => 'nullable|url|max:500',
            'is_online' => 'boolean',
            'online_meeting_url' => 'required_if:is_online,true|nullable|url|max:500',
            'start_datetime' => 'required|date',
            'end_datetime' => 'required|date|after:start_datetime',
            'timezone' => 'nullable|string|max:100',
            'registration_start' => 'nullable|date|before:start_datetime',
            'registration_end' => 'nullable|date|before:start_datetime|after:registration_start',
            'max_attendees' => 'nullable|integer|min:1',
            'status' => 'required|in:draft,published,cancelled',
            'is_featured' => 'boolean',
            'requires_approval' => 'boolean',
            'cover_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:3072',
            'gallery_images.*' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'terms_conditions' => 'nullable|string',
            'agenda' => 'nullable|string',
            'speakers' => 'nullable|array',
            'sponsors' => 'nullable|array',
            'tags' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            // Generate slug
            $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(6);

            // Handle cover image upload
            if ($request->hasFile('cover_image')) {
                $image = $request->file('cover_image');
                $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('events/covers', $filename, 'public');
                $validated['cover_image'] = '/storage/' . $path;
            }

            // Handle gallery images upload
            if ($request->hasFile('gallery_images')) {
                $galleryPaths = [];
                foreach ($request->file('gallery_images') as $image) {
                    $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('events/gallery', $filename, 'public');
                    $galleryPaths[] = '/storage/' . $path;
                }
                $validated['gallery_images'] = $galleryPaths;
            }

            // Initialize counts
            $validated['registered_count'] = $validated['registered_count'] ?? 0;
            $validated['checked_in_count'] = $validated['checked_in_count'] ?? 0;

            $event = Event::create($validated);

            // Log admin action
            $admin->logAdminAction(
                'created',
                Event::class,
                $event->id,
                null,
                $validated,
                'Event created by admin'
            );

            DB::commit();

            return redirect()->route('admin.events.index')
                ->with('success', 'Event created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create event: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing an event
     */
    public function edit($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to edit events.');
        }

        $event = Event::with(['serviceProvider', 'ticketPackages', 'media'])
            ->findOrFail($id);

        // Get providers for dropdown
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        // Get unique categories and types
        $categories = Event::distinct()->pluck('category')->filter()->sort()->values();
        $types = Event::distinct()->pluck('type')->filter()->sort()->values();

        return Inertia::render('Admin/Events/Edit', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'event' => [
                'id' => $event->id,
                'service_provider_id' => $event->service_provider_id,
                'title' => $event->title,
                'slug' => $event->slug,
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
                'registered_count' => $event->registered_count,
                'checked_in_count' => $event->checked_in_count,
                'status' => $event->status,
                'is_featured' => $event->is_featured,
                'requires_approval' => $event->requires_approval,
                'cover_image' => $event->cover_image,
                'gallery_images' => $event->gallery_images,
                'terms_conditions' => $event->terms_conditions,
                'agenda' => $event->agenda,
                'speakers' => $event->speakers,
                'sponsors' => $event->sponsors,
                'tags' => $event->tags,
                'created_at' => $event->created_at->format('M d, Y H:i'),
                'updated_at' => $event->updated_at->format('M d, Y H:i'),
                'service_provider' => [
                    'id' => $event->serviceProvider->id,
                    'business_name' => $event->serviceProvider->business_name,
                    'slug' => $event->serviceProvider->slug,
                ],
                'ticket_packages' => $event->ticketPackages->map(function ($ticket) {
                    return [
                        'id' => $ticket->id,
                        'name' => $ticket->name,
                        'price' => $ticket->price,
                        'quantity_available' => $ticket->quantity_available,
                        'quantity_sold' => $ticket->quantity_sold,
                        'is_active' => $ticket->is_active,
                    ];
                }),
                'media' => $event->media->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'url' => $media->url,
                        'type' => $media->type,
                    ];
                }),
            ],
            'providers' => $providers,
            'categories' => $categories,
            'types' => $types,
        ]);
    }

    /**
     * Update an event
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to edit events.');
        }

        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'service_provider_id' => 'required|exists:service_providers,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'venue_name' => 'required_if:is_online,false|nullable|string|max:255',
            'venue_address' => 'nullable|string',
            'venue_city' => 'nullable|string|max:100',
            'venue_country' => 'nullable|string|max:100',
            'venue_latitude' => 'nullable|numeric',
            'venue_longitude' => 'nullable|numeric',
            'venue_map_url' => 'nullable|url|max:500',
            'is_online' => 'boolean',
            'online_meeting_url' => 'required_if:is_online,true|nullable|url|max:500',
            'start_datetime' => 'required|date',
            'end_datetime' => 'required|date|after:start_datetime',
            'timezone' => 'nullable|string|max:100',
            'registration_start' => 'nullable|date|before:start_datetime',
            'registration_end' => 'nullable|date|before:start_datetime|after:registration_start',
            'max_attendees' => 'nullable|integer|min:1',
            'status' => 'required|in:draft,published,cancelled',
            'is_featured' => 'boolean',
            'requires_approval' => 'boolean',
            'cover_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:3072',
            'gallery_images.*' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'terms_conditions' => 'nullable|string',
            'agenda' => 'nullable|string',
            'speakers' => 'nullable|array',
            'sponsors' => 'nullable|array',
            'tags' => 'nullable|array',
        ]);

        $oldValues = $event->only([
            'service_provider_id', 'title', 'description', 'type', 'category',
            'venue_name', 'venue_address', 'venue_city', 'venue_country',
            'venue_latitude', 'venue_longitude', 'venue_map_url',
            'is_online', 'online_meeting_url', 'start_datetime', 'end_datetime',
            'timezone', 'registration_start', 'registration_end', 'max_attendees',
            'status', 'is_featured', 'requires_approval', 'cover_image',
            'gallery_images', 'terms_conditions', 'agenda', 'speakers', 'sponsors', 'tags'
        ]);

        DB::beginTransaction();
        try {
            // Update slug if title changed
            if ($validated['title'] !== $event->title) {
                $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(6);
            }

            // Handle cover image upload
            if ($request->hasFile('cover_image')) {
                // Delete old image if exists
                if ($event->cover_image) {
                    $oldPath = str_replace('/storage/', '', $event->cover_image);
                    Storage::disk('public')->delete($oldPath);
                }

                $image = $request->file('cover_image');
                $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('events/covers', $filename, 'public');
                $validated['cover_image'] = '/storage/' . $path;
            }

            // Handle gallery images upload
            if ($request->hasFile('gallery_images')) {
                // Delete old gallery images if exist
                if ($event->gallery_images && is_array($event->gallery_images)) {
                    foreach ($event->gallery_images as $oldImage) {
                        $oldPath = str_replace('/storage/', '', $oldImage);
                        Storage::disk('public')->delete($oldPath);
                    }
                }

                $galleryPaths = [];
                foreach ($request->file('gallery_images') as $image) {
                    $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('events/gallery', $filename, 'public');
                    $galleryPaths[] = '/storage/' . $path;
                }
                $validated['gallery_images'] = $galleryPaths;
            }

            $event->update($validated);

            // Log admin action
            $admin->logAdminAction(
                'updated',
                Event::class,
                $event->id,
                $oldValues,
                $event->only(array_keys($oldValues)),
                'Event details updated by admin'
            );

            DB::commit();

            return redirect()->route('admin.events.index')
                ->with('success', 'Event updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update event: ' . $e->getMessage());
        }
    }

    /**
     * Toggle event featured status
     */
    public function toggleFeatured($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to toggle event featured status.');
        }

        $event = Event::findOrFail($id);

        $oldValue = $event->is_featured;
        $event->update(['is_featured' => !$event->is_featured]);

        // Log admin action
        $admin->logAdminAction(
            $event->is_featured ? 'featured' : 'unfeatured',
            Event::class,
            $event->id,
            ['is_featured' => $oldValue],
            ['is_featured' => $event->is_featured],
            $event->is_featured ? 'Event marked as featured' : 'Event unmarked as featured'
        );

        return back()->with('success', 'Event featured status updated successfully.');
    }

    /**
     * Update event status
     */
    public function updateStatus(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to update event status.');
        }

        $validated = $request->validate([
            'status' => 'required|in:draft,published,cancelled',
        ]);

        $event = Event::findOrFail($id);

        $oldStatus = $event->status;
        $event->update(['status' => $validated['status']]);

        // Log admin action
        $admin->logAdminAction(
            'status_changed',
            Event::class,
            $event->id,
            ['status' => $oldStatus],
            ['status' => $event->status],
            "Event status changed from {$oldStatus} to {$event->status}"
        );

        return back()->with('success', 'Event status updated successfully.');
    }

    /**
     * Permanently delete an event
     */
    public function destroy($id)
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can delete events.');
        }

        $event = Event::with('serviceProvider')->findOrFail($id);

        DB::beginTransaction();
        try {
            // Log admin action before deletion
            $admin->logAdminAction(
                'deleted',
                Event::class,
                $event->id,
                [
                    'title' => $event->title,
                    'provider' => $event->serviceProvider->business_name,
                    'start_date' => $event->start_datetime->format('Y-m-d H:i'),
                    'registered_count' => $event->registered_count,
                ],
                null,
                'Event permanently deleted'
            );

            // Delete cover image if exists
            if ($event->cover_image) {
                $oldPath = str_replace('/storage/', '', $event->cover_image);
                Storage::disk('public')->delete($oldPath);
            }

            // Delete gallery images if exist
            if ($event->gallery_images && is_array($event->gallery_images)) {
                foreach ($event->gallery_images as $image) {
                    $oldPath = str_replace('/storage/', '', $image);
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Delete related ticket packages
            $event->ticketPackages()->delete();

            // Delete related media
            $event->media()->delete();

            // Delete the event
            $event->delete();

            DB::commit();

            return redirect()->route('admin.events.index')
                ->with('success', 'Event deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete event: ' . $e->getMessage());
        }
    }
}
