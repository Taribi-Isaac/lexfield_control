<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCauseListEntryRequest;
use App\Http\Requests\UpdateCauseListEntryRequest;
use App\Models\CauseListEntry;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CauseListController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('permission', 'cause-list.view');

        $search = request('search');
        $date = request('date');

        $entries = CauseListEntry::query()
            ->with('assignedLawyer')
            ->when($search, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('case_title', 'like', "%{$search}%")
                        ->orWhere('suit_number', 'like', "%{$search}%")
                        ->orWhere('court', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhereHas('assignedLawyer', function ($query) use ($search): void {
                            $query->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($date, function ($query, string $date): void {
                $query->whereDate('date', $date);
            })
            ->orderByDesc('date')
            ->orderBy('time')
            ->paginate(15)
            ->withQueryString()
            ->through(function (CauseListEntry $entry): array {
                return [
                    'id' => $entry->id,
                    'date' => $entry->date?->toDateString(),
                    'court' => $entry->court,
                    'suit_number' => $entry->suit_number,
                    'case_title' => $entry->case_title,
                    'assigned_lawyer' => $entry->assignedLawyer?->name,
                    'business_of_day' => $entry->business_of_day,
                    'time' => $entry->time?->format('H:i'),
                    'status' => $entry->status,
                ];
            });

        return Inertia::render('cause-list/index', [
            'entries' => $entries,
            'filters' => [
                'search' => $search,
                'date' => $date,
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('permission', 'cause-list.create');

        return Inertia::render('cause-list/create', [
            'lawyers' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreCauseListEntryRequest $request): RedirectResponse
    {
        $entry = CauseListEntry::query()->create(array_merge(
            $request->validated(),
            ['created_by_id' => $request->user()->id]
        ));

        return redirect()
            ->route('cause-list.edit', $entry)
            ->with('success', 'Cause list entry created.');
    }

    public function edit(CauseListEntry $causeList): Response
    {
        Gate::authorize('permission', 'cause-list.edit');

        return Inertia::render('cause-list/edit', [
            'entry' => $causeList,
            'lawyers' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function show(CauseListEntry $causeList): Response
    {
        Gate::authorize('permission', 'cause-list.view');

        $causeList->load('assignedLawyer');

        return Inertia::render('cause-list/show', [
            'entry' => [
                'id' => $causeList->id,
                'date' => $causeList->date?->toDateString(),
                'court' => $causeList->court,
                'suit_number' => $causeList->suit_number,
                'case_title' => $causeList->case_title,
                'assigned_lawyer' => $causeList->assignedLawyer?->name,
                'business_of_day' => $causeList->business_of_day,
                'time' => $causeList->time?->format('H:i'),
                'status' => $causeList->status,
                'notes' => $causeList->notes,
            ],
        ]);
    }

    public function update(UpdateCauseListEntryRequest $request, CauseListEntry $causeList): RedirectResponse
    {
        $causeList->update($request->validated());

        return redirect()
            ->route('cause-list.edit', $causeList)
            ->with('success', 'Cause list entry updated.');
    }

    public function destroy(CauseListEntry $causeList): RedirectResponse
    {
        Gate::authorize('permission', 'cause-list.delete');

        $causeList->delete();

        return redirect()
            ->route('cause-list.index')
            ->with('success', 'Cause list entry removed.');
    }
}
