<?php

namespace App\Http\Middleware;

use App\Models\CaseAssignment;
use App\Models\CauseListEntry;
use App\Models\Message;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $notifications = [
            'total' => 0,
            'messages' => 0,
            'shared_reports' => 0,
            'case_assignments' => 0,
            'cause_list' => 0,
        ];

        if ($user) {
            $userId = $user->id;
            $latestMessageIds = Message::query()
                ->selectRaw('MAX(id) as id')
                ->groupBy('conversation_id');

            $notifications['messages'] = Message::query()
                ->whereIn('id', $latestMessageIds)
                ->where('sender_id', '!=', $userId)
                ->whereHas('conversation.participants', function ($query) use ($userId): void {
                    $query->where('user_id', $userId);
                })
                ->count();

            $notifications['shared_reports'] = Report::query()
                ->whereHas('sharedWith', function ($query) use ($userId): void {
                    $query->where('users.id', $userId);
                })
                ->count();

            $notifications['case_assignments'] = CaseAssignment::query()
                ->where('user_id', $userId)
                ->count();

            $notifications['cause_list'] = CauseListEntry::query()
                ->where('assigned_lawyer_id', $userId)
                ->whereDate('date', '>=', now()->toDateString())
                ->count();

            $notifications['total'] = array_sum([
                $notifications['messages'],
                $notifications['shared_reports'],
                $notifications['case_assignments'],
                $notifications['cause_list'],
            ]);
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'notifications' => $notifications,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
