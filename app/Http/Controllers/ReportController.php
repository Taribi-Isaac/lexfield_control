<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewReportRequest;
use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportRequest;
use App\Models\CaseFile;
use App\Models\Document;
use App\Models\Report;
use App\Models\ReportAttachment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('permission', 'reports.view');

        $search = request('search');
        $user = request()->user();
        $userId = $user?->id;

        $reports = Report::query()
            ->with(['caseFile', 'submittedBy', 'sharedWith'])
            ->when($userId && ! $user?->isSuperAdmin(), function ($query) use ($userId): void {
                $query->where(function ($query) use ($userId): void {
                    $query->where('submitted_by_id', $userId)
                        ->orWhereHas('sharedWith', function ($query) use ($userId): void {
                            $query->where('users.id', $userId);
                        });
                });
            })
            ->when($search, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhereHas('caseFile', function ($query) use ($search): void {
                            $query->where('title', 'like', "%{$search}%");
                        })
                        ->orWhereHas('submittedBy', function ($query) use ($search): void {
                            $query->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('sharedWith', function ($query) use ($search): void {
                            $query->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function (Report $report): array {
                return [
                    'id' => $report->id,
                    'title' => $report->title,
                    'status' => $report->status,
                    'case' => $report->caseFile?->title,
                    'submitted_by' => $report->submittedBy?->name,
                    'shared_with' => $report->sharedWith->pluck('name')->filter()->values()->all(),
                    'submitted_at' => $report->submitted_at?->toDateString(),
                ];
            });

        return Inertia::render('reports/index', [
            'reports' => $reports,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('permission', 'reports.create');

        return Inertia::render('reports/create', [
            'cases' => CaseFile::query()->orderBy('title')->get(['id', 'title']),
            'staff' => User::query()->orderBy('name')->get(['id', 'name']),
            'documents' => Document::query()->latest()->limit(50)->get(['id', 'title']),
        ]);
    }

    public function store(StoreReportRequest $request): RedirectResponse
    {
        $report = DB::transaction(function () use ($request): Report {
            $report = Report::query()->create([
                'case_file_id' => $request->validated('case_file_id'),
                'submitted_by_id' => $request->user()->id,
                'title' => $request->validated('title'),
                'content' => $request->validated('content'),
                'status' => $request->validated('status', 'Draft'),
                'submitted_at' => $request->validated('status') === 'Submitted'
                    ? now()
                    : null,
            ]);

            $sharedWith = $request->validated('shared_with', []);
            if (count($sharedWith) > 0) {
                $report->sharedWith()->sync($sharedWith);
            }

            $attachments = $request->validated('attachments', []);

            foreach ($attachments as $documentId) {
                ReportAttachment::query()->create([
                    'report_id' => $report->id,
                    'document_id' => $documentId,
                ]);
            }

            return $report;
        });

        return redirect()
            ->route('reports.edit', $report)
            ->with('success', 'Report created.');
    }

    public function edit(Report $report): Response
    {
        Gate::authorize('permission', 'reports.edit');
        $this->ensureReportAccess($report, request()->user());

        $report->load(['attachments', 'caseFile', 'sharedWith']);

        return Inertia::render('reports/edit', [
            'report' => [
                'id' => $report->id,
                'case_file_id' => $report->case_file_id,
                'shared_with' => $report->sharedWith->pluck('id'),
                'title' => $report->title,
                'content' => $report->content,
                'status' => $report->status,
                'attachments' => $report->attachments->pluck('document_id'),
            ],
            'cases' => CaseFile::query()->orderBy('title')->get(['id', 'title']),
            'staff' => User::query()->orderBy('name')->get(['id', 'name']),
            'documents' => Document::query()->latest()->limit(50)->get(['id', 'title']),
        ]);
    }

    public function show(Report $report): Response
    {
        Gate::authorize('permission', 'reports.view');
        $this->ensureReportAccess($report, request()->user());

        $report->load(['attachments.document', 'caseFile', 'submittedBy', 'sharedWith', 'reviewedBy']);

        return Inertia::render('reports/show', [
            'report' => [
                'id' => $report->id,
                'title' => $report->title,
                'content' => $report->content,
                'status' => $report->status,
                'case' => $report->caseFile?->title,
                'submitted_by' => $report->submittedBy?->name,
                'shared_with' => $report->sharedWith->pluck('name')->filter()->values()->all(),
                'reviewed_by' => $report->reviewedBy?->name,
                'submitted_at' => $report->submitted_at?->toDateTimeString(),
                'reviewed_at' => $report->reviewed_at?->toDateTimeString(),
                'attachments' => $report->attachments->map(fn ($attachment): array => [
                    'id' => $attachment->document?->id,
                    'title' => $attachment->document?->title,
                ])->filter(),
            ],
        ]);
    }

    public function update(UpdateReportRequest $request, Report $report): RedirectResponse
    {
        DB::transaction(function () use ($request, $report): void {
            $this->ensureReportAccess($report, $request->user());

            $report->update([
                'case_file_id' => $request->validated('case_file_id'),
                'title' => $request->validated('title'),
                'content' => $request->validated('content'),
                'status' => $request->validated('status', $report->status),
                'submitted_at' => $request->validated('status') === 'Submitted'
                    ? ($report->submitted_at ?? now())
                    : $report->submitted_at,
            ]);

            $sharedWith = $request->validated('shared_with', []);
            $report->sharedWith()->sync($sharedWith);

            $attachments = $request->validated('attachments', []);
            $report->attachments()->delete();

            foreach ($attachments as $documentId) {
                ReportAttachment::query()->create([
                    'report_id' => $report->id,
                    'document_id' => $documentId,
                ]);
            }
        });

        return redirect()
            ->route('reports.edit', $report)
            ->with('success', 'Report updated.');
    }

    public function review(ReviewReportRequest $request, Report $report): RedirectResponse
    {
        $this->ensureReportAccess($report, $request->user());

        $report->update([
            'status' => $request->validated('status'),
            'reviewed_by_id' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return redirect()
            ->route('reports.edit', $report)
            ->with('success', 'Report reviewed.');
    }

    public function destroy(Report $report): RedirectResponse
    {
        Gate::authorize('permission', 'reports.delete');
        $this->ensureReportAccess($report, request()->user());

        $report->delete();

        return redirect()
            ->route('reports.index')
            ->with('success', 'Report removed.');
    }

    private function ensureReportAccess(Report $report, ?User $user): void
    {
        if (! $user) {
            abort(403);
        }

        if ($user->isSuperAdmin()) {
            return;
        }

        if ($report->submitted_by_id === $user->id) {
            return;
        }

        $isShared = $report->sharedWith()
            ->where('users.id', $user->id)
            ->exists();

        if (! $isShared) {
            abort(403);
        }
    }
}
