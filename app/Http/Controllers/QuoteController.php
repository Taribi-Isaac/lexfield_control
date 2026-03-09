<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuoteRequest;
use App\Http\Requests\UpdateQuoteRequest;
use App\Models\CaseFile;
use App\Models\Client;
use App\Models\Quote;
use App\Models\QuoteItem;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class QuoteController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('permission', 'quotes.view');

        $search = $request->input('search');

        $quotes = Quote::query()
            ->with(['client', 'caseFile'])
            ->when($search, function ($query, $search) {
                $query->where('quote_number', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
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
            ->through(function (Quote $quote): array {
                return [
                    'id' => $quote->id,
                    'quote_number' => $quote->quote_number,
                    'title' => $quote->title,
                    'client' => $quote->client?->name,
                    'case' => $quote->caseFile?->title,
                    'status' => $quote->status,
                    'total' => $quote->total,
                    'issued_at' => $quote->issued_at?->toDateString(),
                ];
            });

        return Inertia::render('quotes/index', [
            'quotes' => $quotes,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('permission', 'quotes.create');

        return Inertia::render('quotes/create', [
            'clients' => Client::query()->orderBy('name')->get(['id', 'name']),
            'cases' => CaseFile::query()->orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function store(StoreQuoteRequest $request): RedirectResponse
    {
        Gate::authorize('permission', 'quotes.create');

        $data = $request->validated();
        $items = $data['items'];
        $taxRate = (float) ($data['tax'] ?? 0);

        [$subtotal, $lineItems] = $this->buildLineItems($items);
        $taxAmount = $subtotal * ($taxRate / 100);
        $total = $subtotal + $taxAmount;

        $quote = DB::transaction(function () use ($data, $lineItems, $subtotal, $taxRate, $total) {
            $quote = Quote::query()->create([
                'quote_number' => $this->generateQuoteNumber(),
                'title' => $data['title'],
                'client_id' => $data['client_id'],
                'case_file_id' => $data['case_file_id'] ?? null,
                'created_by_id' => auth()->id(),
                'status' => 'Draft',
                'subtotal' => $subtotal,
                'tax' => $taxRate,
                'total' => $total,
                'issued_at' => $data['issued_at'] ?? null,
                'valid_until' => $data['valid_until'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $quote->items()->createMany($lineItems);

            return $quote;
        });

        return redirect()->route('quotes.show', $quote);
    }

    public function show(Quote $quote): Response
    {
        Gate::authorize('permission', 'quotes.view');

        $quote->load(['client', 'caseFile', 'items', 'createdBy']);

        return Inertia::render('quotes/show', [
            'quote' => [
                'id' => $quote->id,
                'quote_number' => $quote->quote_number,
                'title' => $quote->title,
                'client' => $quote->client?->name,
                'case' => $quote->caseFile?->title,
                'status' => $quote->status,
                'subtotal' => $quote->subtotal,
                'tax' => $quote->tax,
                'total' => $quote->total,
                'issued_at' => $quote->issued_at?->toDateString(),
                'valid_until' => $quote->valid_until?->toDateString(),
                'notes' => $quote->notes,
                'created_by' => $quote->createdBy?->name,
                'items' => $quote->items->map(fn (QuoteItem $item): array => [
                    'id' => $item->id,
                    'description' => $item->description,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'line_total' => $item->line_total,
                ]),
            ],
        ]);
    }

    public function download(Quote $quote): HttpResponse
    {
        Gate::authorize('permission', 'quotes.view');

        $quote->load(['client', 'caseFile', 'items', 'createdBy']);

        $pdf = Pdf::loadView('finance.quote', [
            'quote' => $quote,
        ]);

        return $pdf->download('quote-'.$quote->quote_number.'.pdf');
    }

    public function edit(Quote $quote): Response
    {
        Gate::authorize('permission', 'quotes.edit');

        $quote->load('items');

        return Inertia::render('quotes/edit', [
            'quote' => [
                'id' => $quote->id,
                'client_id' => $quote->client_id,
                'case_file_id' => $quote->case_file_id,
                'title' => $quote->title,
                'status' => $quote->status,
                'tax' => $quote->tax,
                'issued_at' => $quote->issued_at?->toDateString(),
                'valid_until' => $quote->valid_until?->toDateString(),
                'notes' => $quote->notes,
                'items' => $quote->items->map(fn (QuoteItem $item): array => [
                    'id' => $item->id,
                    'description' => $item->description,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                ]),
            ],
            'clients' => Client::query()->orderBy('name')->get(['id', 'name']),
            'cases' => CaseFile::query()->orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function update(UpdateQuoteRequest $request, Quote $quote): RedirectResponse
    {
        Gate::authorize('permission', 'quotes.edit');

        $data = $request->validated();
        $items = $data['items'];
        $taxRate = (float) ($data['tax'] ?? 0);

        [$subtotal, $lineItems] = $this->buildLineItems($items);
        $taxAmount = $subtotal * ($taxRate / 100);
        $total = $subtotal + $taxAmount;

        DB::transaction(function () use ($quote, $data, $lineItems, $subtotal, $taxRate, $total) {
            $quote->update([
                'client_id' => $data['client_id'],
                'case_file_id' => $data['case_file_id'] ?? null,
                'title' => $data['title'],
                'status' => $data['status'],
                'subtotal' => $subtotal,
                'tax' => $taxRate,
                'total' => $total,
                'issued_at' => $data['issued_at'] ?? null,
                'valid_until' => $data['valid_until'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $quote->items()->delete();
            $quote->items()->createMany($lineItems);
        });

        return redirect()->route('quotes.show', $quote);
    }

    public function destroy(Quote $quote): RedirectResponse
    {
        Gate::authorize('permission', 'quotes.delete');

        $quote->delete();

        return redirect()->route('quotes.index');
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     * @return array{0: float, 1: array<int, array<string, float|string>>}
     */
    private function buildLineItems(array $items): array
    {
        $lineItems = [];
        $subtotal = 0.0;

        foreach ($items as $item) {
            $quantity = (float) $item['quantity'];
            $unitPrice = (float) $item['unit_price'];
            $lineTotal = $quantity * $unitPrice;

            $lineItems[] = [
                'description' => $item['description'],
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'line_total' => $lineTotal,
            ];

            $subtotal += $lineTotal;
        }

        return [$subtotal, $lineItems];
    }

    private function generateQuoteNumber(): string
    {
        do {
            $number = 'Q-'.now()->format('Ymd').'-'.Str::upper(Str::random(4));
        } while (Quote::query()->where('quote_number', $number)->exists());

        return $number;
    }
}
