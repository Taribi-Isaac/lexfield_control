<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Invoice;
use App\Models\Payment;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('permission', 'payments.view');

        $search = $request->input('search');

        $payments = Payment::query()
            ->with(['invoice.client'])
            ->when($search, function ($query, $search) {
                $query->where('receipt_number', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%")
                    ->orWhereHas('invoice', function ($query) use ($search) {
                        $query->where('invoice_number', 'like', "%{$search}%")
                            ->orWhereHas('client', function ($query) use ($search) {
                                $query->where('name', 'like', "%{$search}%");
                            });
                    });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function (Payment $payment): array {
                return [
                    'id' => $payment->id,
                    'receipt_number' => $payment->receipt_number,
                    'invoice_number' => $payment->invoice?->invoice_number,
                    'client' => $payment->invoice?->client?->name,
                    'amount' => $payment->amount,
                    'method' => $payment->method,
                    'paid_at' => $payment->paid_at?->toDateString(),
                ];
            });

        return Inertia::render('payments/index', [
            'payments' => $payments,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(Request $request): Response
    {
        Gate::authorize('permission', 'payments.create');

        return Inertia::render('payments/create', [
            'invoices' => Invoice::query()->orderByDesc('issued_at')->get([
                'id',
                'invoice_number',
                'total',
            ]),
            'selectedInvoiceId' => $request->input('invoice_id'),
        ]);
    }

    public function store(StorePaymentRequest $request): RedirectResponse
    {
        Gate::authorize('permission', 'payments.create');

        $data = $request->validated();
        $invoice = Invoice::query()->findOrFail($data['invoice_id']);

        $this->ensurePaymentWithinBalance($invoice, (float) $data['amount']);

        $payment = Payment::query()->create([
            'invoice_id' => $invoice->id,
            'received_by_id' => auth()->id(),
            'receipt_number' => $this->generateReceiptNumber(),
            'amount' => $data['amount'],
            'method' => $data['method'] ?? null,
            'reference' => $data['reference'] ?? null,
            'paid_at' => $data['paid_at'] ?? now(),
            'notes' => $data['notes'] ?? null,
        ]);

        $this->updateInvoiceStatus($invoice);

        return redirect()->route('payments.show', $payment);
    }

    public function show(Payment $payment): Response
    {
        Gate::authorize('permission', 'payments.view');

        $payment->load(['invoice.client', 'receivedBy']);

        return Inertia::render('payments/show', [
            'payment' => [
                'id' => $payment->id,
                'receipt_number' => $payment->receipt_number,
                'amount' => $payment->amount,
                'method' => $payment->method,
                'reference' => $payment->reference,
                'paid_at' => $payment->paid_at?->toDateTimeString(),
                'notes' => $payment->notes,
                'received_by' => $payment->receivedBy?->name,
                'invoice' => [
                    'id' => $payment->invoice?->id,
                    'invoice_number' => $payment->invoice?->invoice_number,
                    'client' => $payment->invoice?->client?->name,
                    'total' => $payment->invoice?->total,
                ],
            ],
        ]);
    }

    public function edit(Payment $payment): Response
    {
        Gate::authorize('permission', 'payments.edit');

        return Inertia::render('payments/edit', [
            'payment' => [
                'id' => $payment->id,
                'invoice_id' => $payment->invoice_id,
                'amount' => $payment->amount,
                'method' => $payment->method,
                'reference' => $payment->reference,
                'paid_at' => $payment->paid_at?->toDateString(),
                'notes' => $payment->notes,
            ],
            'invoices' => Invoice::query()->orderByDesc('issued_at')->get([
                'id',
                'invoice_number',
                'total',
            ]),
        ]);
    }

    public function update(UpdatePaymentRequest $request, Payment $payment): RedirectResponse
    {
        Gate::authorize('permission', 'payments.edit');

        $data = $request->validated();
        $invoice = Invoice::query()->findOrFail($data['invoice_id']);

        $this->ensurePaymentWithinBalance(
            $invoice,
            (float) $data['amount'],
            $payment->id
        );

        $payment->update([
            'invoice_id' => $invoice->id,
            'amount' => $data['amount'],
            'method' => $data['method'] ?? null,
            'reference' => $data['reference'] ?? null,
            'paid_at' => $data['paid_at'] ?? $payment->paid_at,
            'notes' => $data['notes'] ?? null,
        ]);

        $this->updateInvoiceStatus($invoice);

        return redirect()->route('payments.show', $payment);
    }

    public function destroy(Payment $payment): RedirectResponse
    {
        Gate::authorize('permission', 'payments.delete');

        $invoice = $payment->invoice;
        $payment->delete();

        if ($invoice) {
            $this->updateInvoiceStatus($invoice);
        }

        return redirect()->route('payments.index');
    }

    public function receipt(Payment $payment): HttpResponse
    {
        Gate::authorize('permission', 'payments.view');

        $payment->load(['invoice.client', 'receivedBy', 'invoice.items', 'invoice.caseFile']);

        $pdf = Pdf::loadView('finance.payment-receipt', [
            'payment' => $payment,
        ]);

        return $pdf->download('receipt-'.$payment->receipt_number.'.pdf');
    }

    private function generateReceiptNumber(): string
    {
        do {
            $number = 'RCPT-'.now()->format('Ymd').'-'.Str::upper(Str::random(4));
        } while (Payment::query()->where('receipt_number', $number)->exists());

        return $number;
    }

    private function updateInvoiceStatus(Invoice $invoice): void
    {
        $totalPaid = (float) $invoice->payments()->sum('amount');
        $total = (float) $invoice->total;

        if ($totalPaid <= 0) {
            $status = 'Unpaid';
        } elseif ($totalPaid < $total) {
            $status = 'Partially Paid';
        } else {
            $status = 'Paid';
        }

        $invoice->update(['status' => $status]);
    }

    private function ensurePaymentWithinBalance(
        Invoice $invoice,
        float $amount,
        ?int $ignoringPaymentId = null
    ): void {
        $paidQuery = $invoice->payments();

        if ($ignoringPaymentId) {
            $paidQuery->where('id', '!=', $ignoringPaymentId);
        }

        $totalPaid = (float) $paidQuery->sum('amount');
        $balance = (float) $invoice->total - $totalPaid;

        if ($amount > $balance) {
            throw ValidationException::withMessages([
                'amount' => 'Payment exceeds outstanding balance.',
            ]);
        }
    }
}
