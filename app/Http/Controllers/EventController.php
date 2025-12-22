<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of events.
     */
    public function index(Request $request)
    {
        $query = Event::with(['serviceProvider', 'ticketPackages'])
            ->published()
            ->upcoming();

        // Filter by category
        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->byType($request->type);
        }

        // Filter by city
        if ($request->filled('city')) {
            $query->where('venue_city', $request->city);
        }

        // Search by keyword
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->where('start_datetime', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('start_datetime', '<=', $request->date_to);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'start_datetime');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $events = $query->paginate($request->get('per_page', 12));

        // Get filter options
        $categories = Event::published()
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        $cities = Event::published()
            ->distinct()
            ->pluck('venue_city')
            ->filter()
            ->values();

        return Inertia::render('Ticketing/EventsList', [
            'events' => $events,
            'categories' => $categories,
            'cities' => $cities,
            'filters' => $request->only(['category', 'type', 'city', 'search', 'date_from', 'date_to', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Display the specified event.
     */
    public function show($slug)
    {
        $event = Event::with([
            'serviceProvider',
            'ticketPackages' => fn($q) => $q->orderBy('display_order'),
            'sections.seats' => fn($q) => $q->orderBy('seat_number'),
        ])
            ->where('slug', $slug)
            ->firstOrFail();

        // Get available ticket count per package
        $ticketPackages = $event->ticketPackages->map(function ($package) use ($event) {
            $soldCount = $package->eventTickets()
                ->whereIn('status', ['valid', 'used'])
                ->count();

            return [
                'id' => $package->id,
                'name' => $package->name,
                'description' => $package->description,
                'price' => $package->price,
                'currency' => $package->currency,
                'quantity_available' => $package->quantity_available,
                'sold_count' => $soldCount,
                'remaining' => max(0, $package->quantity_available - $soldCount),
                'min_purchase' => $package->min_purchase ?? 1,
                'max_purchase' => $package->max_purchase ?? 10,
                'is_available' => $package->is_available && ($soldCount < $package->quantity_available),
                'features' => $package->features,
            ];
        });

        // Get seating data if event requires seating
        $seatingData = null;
        if ($event->requires_seating) {
            $seatingData = $event->sections->map(function ($section) {
                return [
                    'id' => $section->id,
                    'name' => $section->name,
                    'capacity' => $section->capacity,
                    'available_count' => $section->available_seats_count,
                    'seats' => $section->seats->map(function ($seat) {
                        return [
                            'id' => $seat->id,
                            'seat_number' => $seat->seat_number,
                            'row' => $seat->row,
                            'column' => $seat->column,
                            'status' => $seat->status,
                            'price_modifier' => $seat->price_modifier,
                        ];
                    }),
                ];
            });
        }

        // Get similar events
        $similarEvents = Event::with(['serviceProvider', 'ticketPackages'])
            ->published()
            ->upcoming()
            ->where('id', '!=', $event->id)
            ->where(function ($q) use ($event) {
                $q->where('category', $event->category)
                    ->orWhere('venue_city', $event->venue_city);
            })
            ->limit(4)
            ->get();

        return Inertia::render('Ticketing/EventDetail', [
            'event' => $event,
            'ticketPackages' => $ticketPackages,
            'seatingData' => $seatingData,
            'similarEvents' => $similarEvents,
        ]);
    }

    /**
     * Check seat availability in real-time.
     */
    public function checkAvailability(Request $request, Event $event)
    {
        $seatIds = $request->input('seat_ids', []);

        $seats = $event->sections()
            ->with('seats')
            ->get()
            ->pluck('seats')
            ->flatten()
            ->whereIn('id', $seatIds);

        $availability = $seats->map(function ($seat) {
            return [
                'id' => $seat->id,
                'status' => $seat->status,
                'is_available' => $seat->isAvailable(),
                'reserved_until' => $seat->reserved_until,
            ];
        });

        return response()->json([
            'availability' => $availability,
        ]);
    }

    /**
     * Get seating chart data.
     */
    public function seating(Event $event)
    {
        if (!$event->requires_seating) {
            return response()->json(['message' => 'Event does not require seating'], 400);
        }

        $sections = $event->sections()
            ->with('seats')
            ->get()
            ->map(function ($section) {
                return [
                    'id' => $section->id,
                    'name' => $section->name,
                    'capacity' => $section->capacity,
                    'row_count' => $section->row_count,
                    'seat_numbering_type' => $section->seat_numbering_type,
                    'available_count' => $section->available_seats_count,
                    'seats' => $section->seats->map(function ($seat) {
                        return [
                            'id' => $seat->id,
                            'seat_number' => $seat->seat_number,
                            'row' => $seat->row,
                            'column' => $seat->column,
                            'status' => $seat->status,
                            'price_modifier' => $seat->price_modifier,
                            'reserved_until' => $seat->reserved_until,
                        ];
                    }),
                ];
            });

        return response()->json([
            'sections' => $sections,
        ]);
    }
}
