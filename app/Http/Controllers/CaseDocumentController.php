<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCaseDocumentRequest;
use App\Models\CaseFile;
use App\Models\Document;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CaseDocumentController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('permission', 'documents.view');

        $search = $request->string('search')->toString();
        $caseId = $request->integer('case_id');

        $documents = Document::query()
            ->with(['uploader', 'links.documentable'])
            ->whereHas('links', fn ($query) => $query->where('documentable_type', CaseFile::class))
            ->when($search, function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%")
                        ->orWhere('file_name', 'like', "%{$search}%")
                        ->orWhereHas('uploader', function ($query) use ($search): void {
                            $query->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($caseId, function ($query, int $caseId): void {
                $query->whereHas('links', function ($query) use ($caseId): void {
                    $query->where('documentable_type', CaseFile::class)
                        ->where('documentable_id', $caseId);
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function (Document $document): array {
                /** @var \App\Models\DocumentLink|null $caseLink */
                $caseLink = $document->links
                    ->first(fn ($link) => $link->documentable_type === CaseFile::class);
                $caseFile = $caseLink?->documentable instanceof CaseFile
                    ? $caseLink->documentable
                    : null;

                return [
                    'id' => $document->id,
                    'title' => $document->title,
                    'category' => $document->category,
                    'file_name' => $document->file_name,
                    'uploader' => $document->uploader?->name,
                    'case' => $caseFile ? [
                        'id' => $caseFile->id,
                        'title' => $caseFile->title,
                    ] : null,
                ];
            });

        return Inertia::render('case-docs/index', [
            'documents' => $documents,
            'filters' => [
                'search' => $search ?: null,
                'case_id' => $caseId ?: null,
            ],
            'cases' => CaseFile::query()->orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function create(Request $request): Response
    {
        Gate::authorize('permission', 'documents.create');

        return Inertia::render('case-docs/create', [
            'cases' => CaseFile::query()->orderBy('title')->get(['id', 'title']),
            'categories' => ['writ/change', 'case files', 'defence', 'application'],
            'selectedCaseId' => $request->integer('case_id') ?: null,
            'returnToCase' => $request->boolean('return_to_case'),
        ]);
    }

    public function store(StoreCaseDocumentRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $caseFile = CaseFile::query()->findOrFail($validated['case_id']);

        $file = $request->file('file');
        $path = $file->store('documents/case-docs', 'local');

        $document = Document::query()->create([
            'uploader_id' => $request->user()->id,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'disk' => 'local',
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'description' => null,
        ]);

        $document->links()->create([
            'documentable_type' => CaseFile::class,
            'documentable_id' => $caseFile->id,
        ]);

        if ($request->boolean('return_to_case')) {
            return redirect()
                ->route('cases.docs', $caseFile)
                ->with('success', 'Case document uploaded.');
        }

        return redirect()
            ->route('case-docs.index')
            ->with('success', 'Case document uploaded.');
    }

    public function showCaseDocs(CaseFile $case): Response
    {
        Gate::authorize('permission', 'cases.view');
        Gate::authorize('permission', 'documents.view');

        $case->load(['client', 'leadLawyer']);

        $documents = Document::query()
            ->with('uploader')
            ->whereHas('links', function ($query) use ($case): void {
                $query->where('documentable_type', CaseFile::class)
                    ->where('documentable_id', $case->id);
            })
            ->latest()
            ->get()
            ->map(fn (Document $document): array => [
                'id' => $document->id,
                'title' => $document->title,
                'category' => $document->category,
                'file_name' => $document->file_name,
                'uploader' => $document->uploader?->name,
            ]);

        return Inertia::render('cases/docs', [
            'caseFile' => [
                'id' => $case->id,
                'title' => $case->title,
                'status' => $case->status,
                'client' => $case->client?->name,
                'lead_lawyer' => $case->leadLawyer?->name,
            ],
            'documents' => $documents,
        ]);
    }

    public function destroy(Document $document): RedirectResponse
    {
        Gate::authorize('permission', 'documents.delete');

        $isCaseDocument = $document->links()
            ->where('documentable_type', CaseFile::class)
            ->exists();

        abort_unless($isCaseDocument, 404);

        Storage::disk($document->disk)->delete($document->file_path);
        $document->delete();

        return redirect()
            ->back()
            ->with('success', 'Case document removed.');
    }
}
