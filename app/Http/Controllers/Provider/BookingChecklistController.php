<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingChecklist;
use App\Models\BookingChecklistItem;
use App\Models\ChecklistTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingChecklistController extends Controller
{
    /**
     * Create a new checklist for a booking (empty or from template).
     */
    public function store(Request $request, $bookingId)
    {
        $provider = Auth::user()->serviceProvider;

        $booking = Booking::where('service_provider_id', $provider->id)
            ->whereIn('status', ['confirmed', 'completed'])
            ->findOrFail($bookingId);

        if ($booking->checklist) {
            return redirect()->back()->withErrors([
                'error' => 'This booking already has a checklist.',
            ]);
        }

        $request->validate([
            'template_id' => ['nullable', 'exists:checklist_templates,id'],
            'name' => ['nullable', 'string', 'max:255'],
        ]);

        $checklist = BookingChecklist::create([
            'booking_id' => $booking->id,
            'checklist_template_id' => $request->template_id,
            'name' => $request->name ?? 'Booking Checklist',
        ]);

        // If template is selected, copy items from template
        if ($request->template_id) {
            $template = ChecklistTemplate::where('service_provider_id', $provider->id)
                ->with('items')
                ->find($request->template_id);

            if ($template) {
                foreach ($template->items as $index => $templateItem) {
                    $dueDate = null;
                    if ($templateItem->default_days_before_event && $booking->event_date) {
                        $dueDate = $booking->event_date->copy()->subDays($templateItem->default_days_before_event);
                    }

                    BookingChecklistItem::create([
                        'booking_checklist_id' => $checklist->id,
                        'title' => $templateItem->title,
                        'notes' => $templateItem->notes,
                        'due_date' => $dueDate,
                        'display_order' => $index,
                    ]);
                }
            }
        }

        return redirect()->back()->with('success', 'Checklist created successfully');
    }

    /**
     * Add a single item to the checklist.
     */
    public function storeItem(Request $request, $bookingId)
    {
        $provider = Auth::user()->serviceProvider;

        $booking = Booking::where('service_provider_id', $provider->id)
            ->whereIn('status', ['confirmed', 'completed'])
            ->with('checklist')
            ->findOrFail($bookingId);

        if (! $booking->checklist) {
            return redirect()->back()->withErrors([
                'error' => 'Please create a checklist first.',
            ]);
        }

        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'due_date' => ['nullable', 'date'],
        ]);

        $maxOrder = $booking->checklist->items()->max('display_order') ?? -1;

        BookingChecklistItem::create([
            'booking_checklist_id' => $booking->checklist->id,
            'title' => $request->title,
            'notes' => $request->notes,
            'due_date' => $request->due_date,
            'display_order' => $maxOrder + 1,
        ]);

        return redirect()->back()->with('success', 'Item added successfully');
    }

    /**
     * Update a checklist item.
     */
    public function updateItem(Request $request, $bookingId, $itemId)
    {
        $provider = Auth::user()->serviceProvider;

        $booking = Booking::where('service_provider_id', $provider->id)
            ->with('checklist.items')
            ->findOrFail($bookingId);

        $item = $booking->checklist->items->find($itemId);

        if (! $item) {
            return redirect()->back()->withErrors([
                'error' => 'Item not found.',
            ]);
        }

        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'due_date' => ['nullable', 'date'],
        ]);

        $item->update([
            'title' => $request->title,
            'notes' => $request->notes,
            'due_date' => $request->due_date,
        ]);

        return redirect()->back()->with('success', 'Item updated successfully');
    }

    /**
     * Toggle item completion status.
     */
    public function toggleItem($bookingId, $itemId)
    {
        $provider = Auth::user()->serviceProvider;

        $booking = Booking::where('service_provider_id', $provider->id)
            ->with('checklist.items')
            ->findOrFail($bookingId);

        $item = $booking->checklist->items->find($itemId);

        if (! $item) {
            return redirect()->back()->withErrors([
                'error' => 'Item not found.',
            ]);
        }

        if ($item->is_completed) {
            $item->markIncomplete();
        } else {
            $item->markComplete();
        }

        return redirect()->back()->with('success', 'Item updated');
    }

    /**
     * Delete a checklist item.
     */
    public function deleteItem($bookingId, $itemId)
    {
        $provider = Auth::user()->serviceProvider;

        $booking = Booking::where('service_provider_id', $provider->id)
            ->with('checklist.items')
            ->findOrFail($bookingId);

        $item = $booking->checklist->items->find($itemId);

        if (! $item) {
            return redirect()->back()->withErrors([
                'error' => 'Item not found.',
            ]);
        }

        $item->delete();

        return redirect()->back()->with('success', 'Item deleted');
    }

    /**
     * Reorder checklist items.
     */
    public function reorder(Request $request, $bookingId)
    {
        $provider = Auth::user()->serviceProvider;

        $booking = Booking::where('service_provider_id', $provider->id)
            ->with('checklist')
            ->findOrFail($bookingId);

        if (! $booking->checklist) {
            return redirect()->back()->withErrors([
                'error' => 'Checklist not found.',
            ]);
        }

        $request->validate([
            'items' => ['required', 'array'],
            'items.*' => ['integer', 'exists:booking_checklist_items,id'],
        ]);

        foreach ($request->items as $index => $itemId) {
            BookingChecklistItem::where('id', $itemId)
                ->where('booking_checklist_id', $booking->checklist->id)
                ->update(['display_order' => $index]);
        }

        return redirect()->back()->with('success', 'Items reordered');
    }

    /**
     * Delete the entire checklist.
     */
    public function destroy($bookingId)
    {
        $provider = Auth::user()->serviceProvider;

        $booking = Booking::where('service_provider_id', $provider->id)
            ->with('checklist')
            ->findOrFail($bookingId);

        if (! $booking->checklist) {
            return redirect()->back()->withErrors([
                'error' => 'Checklist not found.',
            ]);
        }

        $booking->checklist->delete();

        return redirect()->back()->with('success', 'Checklist deleted');
    }
}
