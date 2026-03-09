<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\CaseFile;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class InvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('permission', 'invoices.view');

        $search = $request->input('search');

        $invoices = Invoice::query()
            ->with(['client', 'caseFile'])
            ->when($search, function ($query, $search) {
                $query->where('invoice_number', 'like', "%{$search}%")
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
            ->through(function (Invoice $invoice): array {
                return [
                    'id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'title' => $invoice->title,
                    'client' => $invoice->client?->name,
                    'case' => $invoice->caseFile?->title,
                    'status' => $invoice->status,
                    'total' => $invoice->total,
                    'due_date' => $invoice->due_date?->toDateString(),
                ];
            });

        return Inertia::render('invoices/index', [
            'invoices' => $invoices,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('permission', 'invoices.create');

        return Inertia::render('invoices/create', [
            'clients' => Client::query()->orderBy('name')->get(['id', 'name']),
            'cases' => CaseFile::query()->orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function store(StoreInvoiceRequest $request): RedirectResponse
    {
        Gate::authorize('permission', 'invoices.create');

        $data = $request->validated();
        $items = $data['items'];
        $taxRate = (float) ($data['tax'] ?? 0);

        [$subtotal, $lineItems] = $this->buildLineItems($items);
        $taxAmount = $subtotal * ($taxRate / 100);
        $total = $subtotal + $taxAmount;

        $invoice = DB::transaction(function () use ($data, $lineItems, $subtotal, $taxRate, $total) {
            $invoice = Invoice::query()->create([
                'invoice_number' => $this->generateInvoiceNumber(),
                'title' => $data['title'],
                'client_id' => $data['client_id'],
                'case_file_id' => $data['case_file_id'] ?? null,
                'created_by_id' => auth()->id(),
                'status' => 'Unpaid',
                'subtotal' => $subtotal,
                'tax' => $taxRate,
                'total' => $total,
                'issued_at' => $data['issued_at'] ?? null,
                'due_date' => $data['due_date'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $invoice->items()->createMany($lineItems);

            return $invoice;
        });

        return redirect()->route('invoices.show', $invoice);
    }

    public function show(Invoice $invoice): Response
    {
        Gate::authorize('permission', 'invoices.view');

        $invoice->load(['client', 'caseFile', 'items', 'createdBy', 'payments.receivedBy']);
        $totalPaid = (float) $invoice->payments->sum('amount');
        $balance = (float) $invoice->total - $totalPaid;

        return Inertia::render('invoices/show', [
            'invoice' => [
                'id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'title' => $invoice->title,
                'client' => $invoice->client?->name,
                'case' => $invoice->caseFile?->title,
                'status' => $invoice->status,
                'subtotal' => $invoice->subtotal,
                'tax' => $invoice->tax,
                'total' => $invoice->total,
                'issued_at' => $invoice->issued_at?->toDateString(),
                'due_date' => $invoice->due_date?->toDateString(),
                'notes' => $invoice->notes,
                'created_by' => $invoice->createdBy?->name,
                'items' => $invoice->items->map(fn (InvoiceItem $item): array => [
                    'id' => $item->id,
                    'description' => $item->description,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'line_total' => $item->line_total,
                ]),
                'payments' => $invoice->payments->map(fn ($payment): array => [
                    'id' => $payment->id,
                    'receipt_number' => $payment->receipt_number,
                    'amount' => $payment->amount,
                    'method' => $payment->method,
                    'paid_at' => $payment->paid_at?->toDateString(),
                    'received_by' => $payment->receivedBy?->name,
                ]),
                'total_paid' => $totalPaid,
                'balance' => $balance,
            ],
        ]);
    }

    public function download(Invoice $invoice): HttpResponse
    {
        Gate::authorize('permission', 'invoices.view');

        $invoice->load(['client', 'caseFile', 'items', 'createdBy']);

        $pdf = Pdf::loadView('finance.invoice', [
            'invoice' => $invoice,
        ]);

        return $pdf->download('invoice-'.$invoice->invoice_number.'.pdf');
    }

    public function receipt(Invoice $invoice): HttpResponse
    {
        Gate::authorize('permission', 'invoices.view');

        if ($invoice->status !== 'Paid') {
            abort(404);
        }

        $invoice->load(['client', 'caseFile', 'items', 'createdBy']);

        $pdf = Pdf::loadView('finance.receipt', [
            'invoice' => $invoice,
        ]);

        return $pdf->download('receipt-'.$invoice->invoice_number.'.pdf');
    }

    public function edit(Invoice $invoice): Response
    {
        Gate::authorize('permission', 'invoices.edit');

        $invoice->load('items');

        return Inertia::render('invoices/edit', [
            'invoice' => [
                'id' => $invoice->id,
                'client_id' => $invoice->client_id,
                'case_file_id' => $invoice->case_file_id,
                'title' => $invoice->title,
                'status' => $invoice->status,
                'tax' => $invoice->tax,
                'issued_at' => $invoice->issued_at?->toDateString(),
                'due_date' => $invoice->due_date?->toDateString(),
                'notes' => $invoice->notes,
                'items' => $invoice->items->map(fn (InvoiceItem $item): array => [
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

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): RedirectResponse
    {
        Gate::authorize('permission', 'invoices.edit');

        $data = $request->validated();
        $items = $data['items'];
        $taxRate = (float) ($data['tax'] ?? 0);

        [$subtotal, $lineItems] = $this->buildLineItems($items);
        $taxAmount = $subtotal * ($taxRate / 100);
        $total = $subtotal + $taxAmount;

        DB::transaction(function () use ($invoice, $data, $lineItems, $subtotal, $taxRate, $total) {
            $invoice->update([
                'client_id' => $data['client_id'],
                'case_file_id' => $data['case_file_id'] ?? null,
                'title' => $data['title'],
                'status' => $data['status'],
                'subtotal' => $subtotal,
                'tax' => $taxRate,
                'total' => $total,
                'issued_at' => $data['issued_at'] ?? null,
                'due_date' => $data['due_date'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $invoice->items()->delete();
            $invoice->items()->createMany($lineItems);
        });

        return redirect()->route('invoices.show', $invoice);
    }

    public function destroy(Invoice $invoice): RedirectResponse
    {
        Gate::authorize('permission', 'invoices.delete');

        $invoice->delete();

        return redirect()->route('invoices.index');
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

    private function generateInvoiceNumber(): string
    {
        do {
            $number = 'INV-'.now()->format('Ymd').'-'.Str::upper(Str::random(4));
        } while (Invoice::query()->where('invoice_number', $number)->exists());

        return $number;
    }
}
