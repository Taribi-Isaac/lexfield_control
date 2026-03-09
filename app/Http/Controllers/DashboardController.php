<?php

namespace App\Http\Controllers;

use App\Models\CaseFile;
use App\Models\CauseListEntry;
use App\Models\Client;
use App\Models\Document;
use App\Models\Invoice;
use App\Models\Report;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $activeStatuses = ['Open', 'Ongoing', 'Adjourned', 'Appeal'];

        $metrics = [
            'totalClients' => Client::query()->count(),
            'activeCases' => CaseFile::query()->whereIn('status', $activeStatuses)->count(),
            'staffCount' => User::query()->count(),
            'documentsCount' => Document::query()->count(),
            'pendingReports' => Report::query()->where('status', 'Submitted')->count(),
            'outstandingInvoices' => Invoice::query()
                ->whereIn('status', ['Unpaid', 'Partially Paid'])
                ->count(),
        ];

        $recentCases = CaseFile::query()
            ->with(['client', 'leadLawyer'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (CaseFile $caseFile): array => [
                'id' => $caseFile->id,
                'title' => $caseFile->title,
                'status' => $caseFile->status,
                'client' => $caseFile->client?->name,
                'leadLawyer' => $caseFile->leadLawyer?->name,
            ]);

        $recentDocuments = Document::query()
            ->with('uploader')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Document $document): array => [
                'id' => $document->id,
                'title' => $document->title,
                'category' => $document->category,
                'uploader' => $document->uploader?->name,
                'createdAt' => $document->created_at?->toDateString(),
            ]);

        // Fetch upcoming cause list entries (from today onwards), sorted by date and time
        // This helps lawyers prepare in advance for upcoming cases
        $todayCauseList = CauseListEntry::query()
            ->with('assignedLawyer')
            ->whereDate('date', '>=', now()->toDateString())
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->limit(8)
            ->get()
            ->map(fn (CauseListEntry $entry): array => [
                'id' => $entry->id,
                'date' => $entry->date->toDateString(),
                'time' => $entry->time?->format('H:i'),
                'court' => $entry->court,
                'case_title' => $entry->case_title,
                'assigned_lawyer' => $entry->assignedLawyer?->name,
                'status' => $entry->status,
            ]);

        return Inertia::render('dashboard', [
            'metrics' => $metrics,
            'recentCases' => $recentCases,
            'recentDocuments' => $recentDocuments,
            'todayCauseList' => $todayCauseList,
        ]);
    }
}
