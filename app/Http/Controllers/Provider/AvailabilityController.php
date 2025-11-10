<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\AvailabilityRequest;
use App\Models\Availability;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class AvailabilityController extends Controller
{
    /**
     * Display availability calendar
     */
    public function index(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        // Get date range (default to current month)
        $startDate = $request->filled('start_date')
            ? Carbon::parse($request->start_date)
            : Carbon::now()->startOfMonth();

        $endDate = $request->filled('end_date')
            ? Carbon::parse($request->end_date)
            : Carbon::now()->endOfMonth();

        $query = Availability::where('service_provider_id', $provider->id)
            ->with('service:id,name')
            ->whereBetween('date', [$startDate, $endDate]);

        // Filter by service
        if ($request->filled('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        // Filter by availability type
        if ($request->filled('type')) {
            $query->where('availability_type', $request->type);
        }

        $availabilities = $query->orderBy('date')
            ->orderBy('start_time')
            ->get()
            ->map(function ($availability) {
                return [
                    'id' => $availability->id,
                    'service_id' => $availability->service_id,
                    'service_name' => $availability->service ? $availability->service->name : 'All Services',
                    'date' => $availability->date->format('Y-m-d'),
                    'start_time' => $availability->start_time,
                    'end_time' => $availability->end_time,
                    'is_available' => $availability->is_available,
                    'availability_type' => $availability->availability_type,
                    'notes' => $availability->notes,
                ];
            });

        // Get services for filtering
        $services = Service::where('service_provider_id', $provider->id)
            ->active()
            ->get(['id', 'name']);

        return Inertia::render('Provider/Availability/Index', [
            'availabilities' => $availabilities,
            'services' => $services,
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'service_id' => $request->service_id,
                'type' => $request->type,
            ],
        ]);
    }

    /**
     * Store a new availability slot
     */
    public function store(AvailabilityRequest $request)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        $data = $request->validated();
        $data['service_provider_id'] = $provider->id;

        // If creating recurring availability
        if ($request->filled('recurring') && $request->recurring) {
            $this->createRecurringAvailability($data);
        } else {
            Availability::create($data);
        }

        return redirect()->back()->with('success', 'Availability slot created successfully');
    }

    /**
     * Update an existing availability slot
     */
    public function update(AvailabilityRequest $request, $id)
    {
        $provider = Auth::user()->serviceProvider;

        $availability = Availability::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $data = $request->validated();
        $availability->update($data);

        return redirect()->back()->with('success', 'Availability slot updated successfully');
    }

    /**
     * Delete an availability slot
     */
    public function destroy($id)
    {
        $provider = Auth::user()->serviceProvider;

        $availability = Availability::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        // Prevent deletion of booked slots
        if ($availability->availability_type === 'booked') {
            return redirect()->back()->withErrors([
                'error' => 'Cannot delete booked time slots. Please cancel the booking first.'
            ]);
        }

        $availability->delete();

        return redirect()->back()->with('success', 'Availability slot deleted successfully');
    }

    /**
     * Bulk delete availability slots
     */
    public function bulkDelete(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer'],
        ]);

        $count = Availability::where('service_provider_id', $provider->id)
            ->whereIn('id', $request->ids)
            ->where('availability_type', '!=', 'booked')
            ->delete();

        return redirect()->back()->with('success', "{$count} availability slot(s) deleted successfully");
    }

    /**
     * Create recurring availability slots
     */
    protected function createRecurringAvailability(array $data)
    {
        $startDate = Carbon::parse($data['date']);
        $endRecurrence = Carbon::parse($data['end_recurrence'] ?? $startDate->copy()->addMonths(3));
        $frequency = $data['recurrence_frequency'] ?? 'weekly'; // daily, weekly, monthly
        $daysOfWeek = $data['days_of_week'] ?? []; // For weekly recurrence

        $currentDate = $startDate->copy();
        $slots = [];

        while ($currentDate <= $endRecurrence) {
            // For weekly recurrence, check if current day is in selected days
            if ($frequency === 'weekly') {
                if (in_array($currentDate->dayOfWeek, $daysOfWeek)) {
                    $slots[] = [
                        'service_provider_id' => $data['service_provider_id'],
                        'service_id' => $data['service_id'] ?? null,
                        'date' => $currentDate->format('Y-m-d'),
                        'start_time' => $data['start_time'],
                        'end_time' => $data['end_time'],
                        'is_available' => $data['is_available'] ?? true,
                        'availability_type' => $data['availability_type'] ?? 'available',
                        'notes' => $data['notes'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
                $currentDate->addDay();
            } elseif ($frequency === 'daily') {
                $slots[] = [
                    'service_provider_id' => $data['service_provider_id'],
                    'service_id' => $data['service_id'] ?? null,
                    'date' => $currentDate->format('Y-m-d'),
                    'start_time' => $data['start_time'],
                    'end_time' => $data['end_time'],
                    'is_available' => $data['is_available'] ?? true,
                    'availability_type' => $data['availability_type'] ?? 'available',
                    'notes' => $data['notes'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $currentDate->addDay();
            } elseif ($frequency === 'monthly') {
                $slots[] = [
                    'service_provider_id' => $data['service_provider_id'],
                    'service_id' => $data['service_id'] ?? null,
                    'date' => $currentDate->format('Y-m-d'),
                    'start_time' => $data['start_time'],
                    'end_time' => $data['end_time'],
                    'is_available' => $data['is_available'] ?? true,
                    'availability_type' => $data['availability_type'] ?? 'available',
                    'notes' => $data['notes'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $currentDate->addMonth();
            }
        }

        // Batch insert (ignore duplicates)
        foreach (array_chunk($slots, 100) as $chunk) {
            try {
                Availability::insert($chunk);
            } catch (\Exception $e) {
                // Skip duplicates
                continue;
            }
        }
    }
}
