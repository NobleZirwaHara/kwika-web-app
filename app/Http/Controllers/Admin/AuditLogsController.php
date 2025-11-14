<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuditLogsController extends Controller
{
    /**
     * Display a listing of audit logs
     */
    public function index(Request $request)
    {
        $currentAdmin = Auth::user();

        if (!$currentAdmin->canAdmin('manage_reports')) {
            return back()->with('error', 'You do not have permission to view audit logs.');
        }

        // Get filter parameters
        $search = $request->input('search');
        $admin = $request->input('admin'); // admin_id
        $action = $request->input('action');
        $resourceType = $request->input('resource_type');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Build query
        $query = AdminLog::with(['admin'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('notes', 'like', "%{$search}%")
                        ->orWhere('resource_id', 'like', "%{$search}%")
                        ->orWhereHas('admin', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                              ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($admin, function ($q) use ($admin) {
                return $q->where('admin_id', $admin);
            })
            ->when($action, function ($q) use ($action) {
                return $q->where('action', $action);
            })
            ->when($resourceType, function ($q) use ($resourceType) {
                return $q->where('resource_type', 'like', "%{$resourceType}%");
            })
            ->when($dateFrom, function ($q) use ($dateFrom) {
                return $q->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($q) use ($dateTo) {
                return $q->whereDate('created_at', '<=', $dateTo);
            });

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $logs = $query->paginate(50)->withQueryString();

        // Transform data for frontend
        $logsData = $logs->through(function ($log) {
            return [
                'id' => $log->id,
                'admin' => [
                    'id' => $log->admin->id,
                    'name' => $log->admin->name,
                    'email' => $log->admin->email,
                    'admin_role' => $log->admin->admin_role,
                ],
                'action' => $log->action,
                'resource_type' => class_basename($log->resource_type),
                'resource_type_full' => $log->resource_type,
                'resource_id' => $log->resource_id,
                'old_values' => $log->old_values,
                'new_values' => $log->new_values,
                'ip_address' => $log->ip_address,
                'user_agent' => $log->user_agent,
                'notes' => $log->notes,
                'created_at' => $log->created_at->format('M d, Y H:i:s'),
                'created_at_human' => $log->created_at->diffForHumans(),
            ];
        });

        // Get statistics
        $stats = [
            'total' => AdminLog::count(),
            'today' => AdminLog::whereDate('created_at', today())->count(),
            'this_week' => AdminLog::where('created_at', '>=', now()->startOfWeek())->count(),
            'this_month' => AdminLog::where('created_at', '>=', now()->startOfMonth())->count(),
        ];

        // Get unique actions for filter
        $actions = AdminLog::select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action');

        // Get unique resource types for filter
        $resourceTypes = AdminLog::select('resource_type')
            ->distinct()
            ->get()
            ->map(function ($item) {
                return [
                    'full' => $item->resource_type,
                    'short' => class_basename($item->resource_type),
                ];
            })
            ->unique('short')
            ->sortBy('short')
            ->values();

        // Get admin users for filter
        $admins = User::where('is_admin', true)
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/AuditLogs/Index', [
            'admin' => [
                'id' => $currentAdmin->id,
                'name' => $currentAdmin->name,
                'email' => $currentAdmin->email,
                'admin_role' => $currentAdmin->admin_role,
            ],
            'logs' => $logsData,
            'stats' => $stats,
            'actions' => $actions,
            'resourceTypes' => $resourceTypes,
            'admins' => $admins,
            'filters' => [
                'search' => $search,
                'admin' => $admin,
                'action' => $action,
                'resource_type' => $resourceType,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show a specific audit log entry
     */
    public function show($id)
    {
        $currentAdmin = Auth::user();

        if (!$currentAdmin->canAdmin('manage_reports')) {
            return back()->with('error', 'You do not have permission to view audit logs.');
        }

        $log = AdminLog::with(['admin'])->findOrFail($id);

        return Inertia::render('Admin/AuditLogs/Show', [
            'admin' => [
                'id' => $currentAdmin->id,
                'name' => $currentAdmin->name,
                'email' => $currentAdmin->email,
                'admin_role' => $currentAdmin->admin_role,
            ],
            'log' => [
                'id' => $log->id,
                'admin' => [
                    'id' => $log->admin->id,
                    'name' => $log->admin->name,
                    'email' => $log->admin->email,
                    'admin_role' => $log->admin->admin_role,
                ],
                'action' => $log->action,
                'resource_type' => class_basename($log->resource_type),
                'resource_type_full' => $log->resource_type,
                'resource_id' => $log->resource_id,
                'old_values' => $log->old_values,
                'new_values' => $log->new_values,
                'ip_address' => $log->ip_address,
                'user_agent' => $log->user_agent,
                'notes' => $log->notes,
                'created_at' => $log->created_at->format('M d, Y H:i:s'),
                'created_at_human' => $log->created_at->diffForHumans(),
            ],
        ]);
    }
}
