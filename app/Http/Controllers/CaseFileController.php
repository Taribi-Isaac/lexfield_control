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

        $caseFiles = CaseFile::query()
            ->with(['client', 'leadLawyer'])
            ->orderByDesc('filing_date')
            ->paginate(15)
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
