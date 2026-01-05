<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\ChecklistTemplate;
use App\Models\ChecklistTemplateItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChecklistTemplateController extends Controller
{
    /**
     * Display a listing of templates.
     */
    public function index()
    {
        $provider = Auth::user()->serviceProvider;

        if (! $provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        $templates = ChecklistTemplate::where('service_provider_id', $provider->id)
            ->withCount('items')
            ->withCount('bookingChecklists')
            ->ordered()
            ->get()
            ->map(fn ($template) => [
                'id' => $template->id,
                'name' => $template->name,
                'description' => $template->description,
                'is_active' => $template->is_active,
                'item_count' => $template->items_count,
                'usage_count' => $template->booking_checklists_count,
                'created_at' => $template->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Provider/Checklists/Index', [
            'templates' => $templates,
        ]);
    }

    /**
     * Store a newly created template.
     */
    public function store(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'items' => ['nullable', 'array'],
            'items.*.title' => ['required_with:items', 'string', 'max:255'],
            'items.*.notes' => ['nullable', 'string', 'max:1000'],
            'items.*.default_days_before_event' => ['nullable', 'integer', 'min:0', 'max:365'],
        ]);

        $maxOrder = ChecklistTemplate::where('service_provider_id', $provider->id)
            ->max('display_order') ?? -1;

        $template = ChecklistTemplate::create([
            'service_provider_id' => $provider->id,
            'name' => $request->name,
            'description' => $request->description,
            'display_order' => $maxOrder + 1,
        ]);

        // Create initial items if provided
        if ($request->items) {
            foreach ($request->items as $index => $item) {
                ChecklistTemplateItem::create([
                    'checklist_template_id' => $template->id,
                    'title' => $item['title'],
                    'notes' => $item['notes'] ?? null,
                    'default_days_before_event' => $item['default_days_before_event'] ?? null,
                    'display_order' => $index,
                ]);
            }
        }

        return redirect()->route('provider.checklists.show', $template->id)
            ->with('success', 'Template created successfully');
    }

    /**
     * Display the specified template.
     */
    public function show($id)
    {
        $provider = Auth::user()->serviceProvider;

        $template = ChecklistTemplate::where('service_provider_id', $provider->id)
            ->with('items')
            ->findOrFail($id);

        return Inertia::render('Provider/Checklists/Show', [
            'template' => [
                'id' => $template->id,
                'name' => $template->name,
                'description' => $template->description,
                'is_active' => $template->is_active,
                'items' => $template->items->map(fn ($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'notes' => $item->notes,
                    'default_days_before_event' => $item->default_days_before_event,
                    'display_order' => $item->display_order,
                ]),
                'created_at' => $template->created_at->format('M d, Y'),
                'updated_at' => $template->updated_at->format('M d, Y'),
            ],
        ]);
    }

    /**
     * Update the specified template.
     */
    public function update(Request $request, $id)
    {
        $provider = Auth::user()->serviceProvider;

        $template = ChecklistTemplate::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $template->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->back()->with('success', 'Template updated successfully');
    }

    /**
     * Remove the specified template.
     */
    public function destroy($id)
    {
        $provider = Auth::user()->serviceProvider;

        $template = ChecklistTemplate::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $template->delete();

        return redirect()->route('provider.checklists.index')
            ->with('success', 'Template deleted successfully');
    }

    /**
     * Toggle template active status.
     */
    public function toggle($id)
    {
        $provider = Auth::user()->serviceProvider;

        $template = ChecklistTemplate::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $template->update([
            'is_active' => ! $template->is_active,
        ]);

        return redirect()->back()->with('success', 'Template status updated');
    }

    /**
     * Duplicate a template.
     */
    public function duplicate($id)
    {
        $provider = Auth::user()->serviceProvider;

        $template = ChecklistTemplate::where('service_provider_id', $provider->id)
            ->with('items')
            ->findOrFail($id);

        $maxOrder = ChecklistTemplate::where('service_provider_id', $provider->id)
            ->max('display_order') ?? -1;

        $newTemplate = ChecklistTemplate::create([
            'service_provider_id' => $provider->id,
            'name' => $template->name . ' (Copy)',
            'description' => $template->description,
            'display_order' => $maxOrder + 1,
        ]);

        foreach ($template->items as $item) {
            ChecklistTemplateItem::create([
                'checklist_template_id' => $newTemplate->id,
                'title' => $item->title,
                'notes' => $item->notes,
                'default_days_before_event' => $item->default_days_before_event,
                'display_order' => $item->display_order,
            ]);
        }

        return redirect()->route('provider.checklists.show', $newTemplate->id)
            ->with('success', 'Template duplicated successfully');
    }

    /**
     * Add an item to the template.
     */
    public function storeItem(Request $request, $id)
    {
        $provider = Auth::user()->serviceProvider;

        $template = ChecklistTemplate::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'default_days_before_event' => ['nullable', 'integer', 'min:0', 'max:365'],
        ]);

        $maxOrder = $template->items()->max('display_order') ?? -1;

        ChecklistTemplateItem::create([
            'checklist_template_id' => $template->id,
            'title' => $request->title,
            'notes' => $request->notes,
            'default_days_before_event' => $request->default_days_before_event,
            'display_order' => $maxOrder + 1,
        ]);

        return redirect()->back()->with('success', 'Item added successfully');
    }

    /**
     * Update a template item.
     */
    public function updateItem(Request $request, $id, $itemId)
    {
        $provider = Auth::user()->serviceProvider;

        $template = ChecklistTemplate::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $item = ChecklistTemplateItem::where('checklist_template_id', $template->id)
            ->findOrFail($itemId);

        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'default_days_before_event' => ['nullable', 'integer', 'min:0', 'max:365'],
        ]);

        $item->update([
            'title' => $request->title,
            'notes' => $request->notes,
            'default_days_before_event' => $request->default_days_before_event,
        ]);

        return redirect()->back()->with('success', 'Item updated successfully');
    }

    /**
     * Delete a template item.
     */
    public function deleteItem($id, $itemId)
    {
        $provider = Auth::user()->serviceProvider;

        $template = ChecklistTemplate::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $item = ChecklistTemplateItem::where('checklist_template_id', $template->id)
            ->findOrFail($itemId);

        $item->delete();

        return redirect()->back()->with('success', 'Item deleted');
    }

    /**
     * Reorder template items.
     */
    public function reorderItems(Request $request, $id)
    {
        $provider = Auth::user()->serviceProvider;

        $template = ChecklistTemplate::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $request->validate([
            'items' => ['required', 'array'],
            'items.*' => ['integer', 'exists:checklist_template_items,id'],
        ]);

        foreach ($request->items as $index => $itemId) {
            ChecklistTemplateItem::where('id', $itemId)
                ->where('checklist_template_id', $template->id)
                ->update(['display_order' => $index]);
        }

        return redirect()->back()->with('success', 'Items reordered');
    }
}
