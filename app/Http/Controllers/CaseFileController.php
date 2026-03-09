<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCaseFileRequest;
use App\Http\Requests\UpdateCaseFileRequest;
use App\Models\CaseFile;
use App\Models\Client;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CaseFileController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('permission', 'cases.view');

        $search = request('search');

        $caseFiles = CaseFile::query()
            ->with(['client', 'leadLawyer'])
            ->when($search, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('suit_number', 'like', "%{$search}%")
                        ->orWhere('court', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhereHas('client', function ($query) use ($search): void {
                            $query->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('leadLawyer', function ($query) use ($search): void {
                            $query->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderByDesc('filing_date')
            ->paginate(15)
            ->withQueryString()
            ->through(function (CaseFile $caseFile): array {
                return [
                    'id' => $caseFile->id,
                    'title' => $caseFile->title,
                    'suit_number' => $caseFile->suit_number,
                    'court' => $caseFile->court,
                    'status' => $caseFile->status,
                    'client' => $caseFile->client?->name,
                    'lead_lawyer' => $caseFile->leadLawyer?->name,
                ];
            });

        return Inertia::render('cases/index', [
            'caseFiles' => $caseFiles,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('permission', 'cases.create');

        return Inertia::render('cases/create', [
            'clients' => Client::query()->orderBy('name')->get(['id', 'name']),
            'lawyers' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreCaseFileRequest $request): RedirectResponse
    {
        $caseFile = CaseFile::query()->create($request->validated());

        return redirect()
            ->route('cases.edit', $caseFile)
            ->with('success', 'Case created.');
    }

    public function edit(CaseFile $case): Response
    {
        Gate::authorize('permission', 'cases.edit');

        return Inertia::render('cases/edit', [
            'caseFile' => $case->load(['client', 'leadLawyer']),
            'clients' => Client::query()->orderBy('name')->get(['id', 'name']),
            'lawyers' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function show(CaseFile $case): Response
    {
        Gate::authorize('permission', 'cases.view');

        $case->load(['client', 'leadLawyer', 'assignments.user', 'documentLinks.document']);

        return Inertia::render('cases/show', [
            'caseFile' => [
                'id' => $case->id,
                'title' => $case->title,
                'suit_number' => $case->suit_number,
                'court' => $case->court,
                'filing_date' => $case->filing_date?->toDateString(),
                'opposing_party' => $case->opposing_party,
                'opposing_counsel' => $case->opposing_counsel,
                'status' => $case->status,
                'summary' => $case->summary,
                'client' => $case->client?->name,
                'lead_lawyer' => $case->leadLawyer?->name,
                'assignees' => $case->assignments->map(fn ($assignment): array => [
                    'id' => $assignment->user_id,
                    'name' => $assignment->user?->name,
                    'role' => $assignment->role,
                ]),
                'documents' => $case->documentLinks->map(fn ($link): array => [
                    'id' => $link->document?->id,
                    'title' => $link->document?->title,
                ])->filter(),
            ],
        ]);
    }

    public function update(UpdateCaseFileRequest $request, CaseFile $case): RedirectResponse
    {
        $case->update($request->validated());

        return redirect()
            ->route('cases.edit', $case)
            ->with('success', 'Case updated.');
    }

    public function destroy(CaseFile $case): RedirectResponse
    {
        Gate::authorize('permission', 'cases.delete');

        $case->delete();

        return redirect()
            ->route('cases.index')
            ->with('success', 'Case removed.');
    }
}
