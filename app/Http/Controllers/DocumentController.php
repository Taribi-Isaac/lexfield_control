<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Models\CaseFile;
use App\Models\Client;
use App\Models\Document;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('permission', 'documents.view');

        $documents = Document::query()
            ->with(['uploader', 'links'])
            ->latest()
            ->paginate(15)
            ->through(function (Document $document): array {
                return [
                    'id' => $document->id,
                    'title' => $document->title,
                    'category' => $document->category,
                    'file_name' => $document->file_name,
                    'uploader' => $document->uploader?->name,
                    'links' => $document->links->map(function ($link): array {
                        return [
                            'type' => $link->documentable_type,
                            'id' => $link->documentable_id,
                        ];
                    }),
                ];
            });

        return Inertia::render('documents/index', [
            'documents' => $documents,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('permission', 'documents.create');

        return Inertia::render('documents/create', [
            'documentableTypes' => [
                ['label' => 'Client', 'value' => Client::class],
                ['label' => 'Case', 'value' => CaseFile::class],
                ['label' => 'Staff', 'value' => User::class],
            ],
            'clients' => Client::query()->orderBy('name')->get(['id', 'name']),
            'cases' => CaseFile::query()->orderBy('title')->get(['id', 'title']),
            'staff' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreDocumentRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $documentable = match ($validated['documentable_type']) {
            Client::class => Client::query()->findOrFail($validated['documentable_id']),
            CaseFile::class => CaseFile::query()->findOrFail($validated['documentable_id']),
            User::class => User::query()->findOrFail($validated['documentable_id']),
            default => null,
        };

        if ($documentable === null) {
            return redirect()
                ->back()
                ->withErrors(['documentable_type' => 'Invalid document link type.']);
        }

        $file = $request->file('file');
        $path = $file->store('documents', 'local');

        $document = Document::query()->create([
            'uploader_id' => $request->user()->id,
            'title' => $validated['title'],
            'category' => $validated['category'] ?? null,
            'disk' => 'local',
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'description' => null,
        ]);

        $document->links()->create([
            'documentable_type' => $documentable::class,
            'documentable_id' => $documentable->id,
        ]);

        return redirect()
            ->route('documents.index')
            ->with('success', 'Document uploaded.');
    }

    public function download(Document $document): StreamedResponse
    {
        Gate::authorize('permission', 'documents.view');

        return Storage::disk($document->disk)->download($document->file_path, $document->file_name);
    }

    public function destroy(Document $document): RedirectResponse
    {
        Gate::authorize('permission', 'documents.delete');

        Storage::disk($document->disk)->delete($document->file_path);
        $document->delete();

        return redirect()
            ->route('documents.index')
            ->with('success', 'Document removed.');
    }
}
