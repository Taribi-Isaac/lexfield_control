<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNotificationLetterRequest;
use App\Http\Requests\UpdateNotificationLetterRequest;
use App\Models\CaseFile;
use App\Models\Client;
use App\Models\NotificationLetter;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class NotificationLetterController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('permission', 'notification-letters.view');

        $search = $request->input('search');

        $letters = NotificationLetter::query()
            ->with(['client', 'caseFile'])
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('caseFile', function ($query) use ($search) {
                        $query->where('title', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function (NotificationLetter $letter): array {
                return [
                    'id' => $letter->id,
                    'title' => $letter->title,
                    'client' => $letter->client?->name,
                    'case' => $letter->caseFile?->title,
                    'created_at' => $letter->created_at?->toDateString(),
                ];
            });

        return Inertia::render('notification-letters/index', [
            'letters' => $letters,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('permission', 'notification-letters.create');

        return Inertia::render('notification-letters/create', [
            'clients' => Client::query()->orderBy('name')->get(['id', 'name']),
            'cases' => CaseFile::query()->orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function store(StoreNotificationLetterRequest $request): RedirectResponse
    {
        Gate::authorize('permission', 'notification-letters.create');

        $data = $request->validated();

        $letter = NotificationLetter::query()->create([
            'client_id' => $data['client_id'] ?? null,
            'case_file_id' => $data['case_file_id'] ?? null,
            'generated_by_id' => $request->user()->id,
            'title' => $data['title'],
            'body' => $data['body'],
        ]);

        return redirect()->route('notification-letters.show', $letter);
    }

    public function show(NotificationLetter $notificationLetter): Response
    {
        Gate::authorize('permission', 'notification-letters.view');

        $notificationLetter->load(['client', 'caseFile', 'createdBy']);

        return Inertia::render('notification-letters/show', [
            'letter' => [
                'id' => $notificationLetter->id,
                'title' => $notificationLetter->title,
                'client' => $notificationLetter->client?->name,
                'case' => $notificationLetter->caseFile?->title,
                'suit_number' => $notificationLetter->caseFile?->suit_number,
                'court' => $notificationLetter->caseFile?->court,
                'body' => $notificationLetter->body,
                'created_at' => $notificationLetter->created_at?->toDateString(),
            ],
        ]);
    }

    public function edit(NotificationLetter $notificationLetter): Response
    {
        Gate::authorize('permission', 'notification-letters.edit');

        return Inertia::render('notification-letters/edit', [
            'letter' => [
                'id' => $notificationLetter->id,
                'title' => $notificationLetter->title,
                'client_id' => $notificationLetter->client_id,
                'case_file_id' => $notificationLetter->case_file_id,
                'body' => $notificationLetter->body,
            ],
            'clients' => Client::query()->orderBy('name')->get(['id', 'name']),
            'cases' => CaseFile::query()->orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function update(
        UpdateNotificationLetterRequest $request,
        NotificationLetter $notificationLetter
    ): RedirectResponse {
        Gate::authorize('permission', 'notification-letters.edit');

        $data = $request->validated();

        $notificationLetter->update([
            'client_id' => $data['client_id'] ?? null,
            'case_file_id' => $data['case_file_id'] ?? null,
            'title' => $data['title'],
            'body' => $data['body'],
        ]);

        return redirect()->route('notification-letters.show', $notificationLetter);
    }

    public function download(NotificationLetter $notificationLetter): HttpResponse
    {
        Gate::authorize('permission', 'notification-letters.view');

        $notificationLetter->load(['client', 'caseFile', 'createdBy']);

        $pdf = Pdf::loadView('letters/notification', [
            'letter' => $notificationLetter,
        ]);

        return $pdf->download('notification-letter-'.$notificationLetter->id.'.pdf');
    }

    public function duplicate(NotificationLetter $notificationLetter): RedirectResponse
    {
        Gate::authorize('permission', 'notification-letters.create');

        $duplicate = $notificationLetter->replicate();
        $duplicate->title = $duplicate->title . ' (Copy)';
        $duplicate->generated_by_id = auth()->id();
        $duplicate->save();

        return redirect()->route('notification-letters.edit', $duplicate)
            ->with('success', 'Letter duplicated.');
    }

    public function destroy(NotificationLetter $notificationLetter): RedirectResponse
    {
        Gate::authorize('permission', 'notification-letters.delete');

        $notificationLetter->delete();

        return redirect()->route('notification-letters.index')
            ->with('success', 'Letter removed.');
    }
}
