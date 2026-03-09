import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import InvoiceController from '@/actions/App/Http/Controllers/InvoiceController';
import PaymentController from '@/actions/App/Http/Controllers/PaymentController';
import type { BreadcrumbItem } from '@/types';

type Invoice = {
    id: number;
    invoice_number: string;
    title: string;
    client?: string | null;
    case?: string | null;
    status: string;
    subtotal: string | number;
    tax: string | number;
    total: string | number;
    issued_at?: string | null;
    due_date?: string | null;
    notes?: string | null;
    created_by?: string | null;
    total_paid: string | number;
    balance: string | number;
    items: {
        id: number;
        description: string;
        quantity: string | number;
        unit_price: string | number;
        line_total: string | number;
    }[];
    payments: {
        id: number;
        receipt_number: string;
        amount: string | number;
        method?: string | null;
        paid_at?: string | null;
        received_by?: string | null;
    }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: InvoiceController.index(),
    },
    {
        title: 'Invoice details',
        href: '#',
    },
];

export default function InvoiceShow({ invoice }: { invoice: Invoice }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoice Details" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {invoice.invoice_number}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {invoice.title} · {invoice.status}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={InvoiceController.index()}>Back</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link
                                href={PaymentController.create({
                                    query: { invoice_id: invoice.id },
                                }).url}
                            >
                                Record payment
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <a
                                href={InvoiceController.download({
                                    invoice: invoice.id,
                                }).url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Download
                            </a>
                        </Button>
                        {invoice.status === 'Paid' && (
                            <Button asChild variant="outline">
                                <a
                                    href={InvoiceController.receipt({
                                        invoice: invoice.id,
                                    }).url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Receipt
                                </a>
                            </Button>
                        )}
                        <Button asChild>
                            <Link href={InvoiceController.edit({ invoice: invoice.id })}>
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Client</h2>
                        <p className="text-sm text-slate-600">
                            Title: {invoice.title}
                        </p>
                        <p className="text-sm text-slate-600">
                            Client: {invoice.client ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Case: {invoice.case ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Created by: {invoice.created_by ?? '—'}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Dates</h2>
                        <p className="text-sm text-slate-600">
                            Issued: {invoice.issued_at ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Due: {invoice.due_date ?? '—'}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <h2 className="mb-4 font-semibold">Line items</h2>
                    <div className="overflow-hidden rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-left">
                                <tr>
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3">Qty</th>
                                    <th className="px-4 py-3">Unit price</th>
                                    <th className="px-4 py-3">Line total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-4 py-3">
                                            {item.description}
                                        </td>
                                        <td className="px-4 py-3">{item.quantity}</td>
                                        <td className="px-4 py-3">{item.unit_price}</td>
                                        <td className="px-4 py-3">{item.line_total}</td>
                                    </tr>
                                ))}
                                {invoice.items.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            No items.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-3">
                        <div>Subtotal: {invoice.subtotal}</div>
                        <div>Tax (%): {invoice.tax}</div>
                        <div className="font-semibold text-slate-900">
                            Total: {invoice.total}
                        </div>
                        <div>Paid: {invoice.total_paid}</div>
                        <div>Balance: {invoice.balance}</div>
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <h2 className="mb-2 font-semibold">Payments</h2>
                    {invoice.payments.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No payments recorded yet.
                        </p>
                    ) : (
                        <div className="overflow-hidden rounded-lg border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-left">
                                    <tr>
                                        <th className="px-4 py-3">Receipt</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3">Method</th>
                                        <th className="px-4 py-3">Paid at</th>
                                        <th className="px-4 py-3">Received by</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.payments.map((payment) => (
                                        <tr key={payment.id} className="border-t">
                                            <td className="px-4 py-3 font-medium">
                                                {payment.receipt_number}
                                            </td>
                                            <td className="px-4 py-3">
                                                {payment.amount}
                                            </td>
                                            <td className="px-4 py-3">
                                                {payment.method ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {payment.paid_at ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {payment.received_by ?? '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="rounded-lg border p-4">
                    <h2 className="mb-2 font-semibold">Notes</h2>
                    <p className="text-sm text-slate-600">{invoice.notes ?? '—'}</p>
                </div>
            </div>
        </AppLayout>
    );
}
