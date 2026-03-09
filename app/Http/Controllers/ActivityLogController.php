<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('permission', 'activity-logs.view');

        $search = $request->input('search');
        $userId = $request->input('user_id');

        $logs = ActivityLog::query()
            ->with('user')
            ->when($search, function ($query, $search) {
                $query->where('action', 'like', "%{$search}%")
                    ->orWhere('route', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($userId, function ($query, $userId) {
                $query->where('user_id', $userId);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function (ActivityLog $log): array {
                return [
                    'id' => $log->id,
                    'user' => $log->user?->name,
                    'action' => $log->action,
                    'route' => $log->route,
                    'method' => $log->method,
                    'description' => $log->description,
                    'created_at' => $log->created_at?->toDateTimeString(),
                ];
            });

        return Inertia::render('activity/index', [
            'logs' => $logs,
            'filters' => $request->only('search', 'user_id'),
            'users' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }
}
