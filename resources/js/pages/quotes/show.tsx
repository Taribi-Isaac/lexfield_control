import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import QuoteController from '@/actions/App/Http/Controllers/QuoteController';
import type { BreadcrumbItem } from '@/types';

type Quote = {
    id: number;
    quote_number: string;
    title: string;
    client?: string | null;
    case?: string | null;
    status: string;
    subtotal: string | number;
    tax: string | number;
    total: string | number;
    issued_at?: string | null;
    valid_until?: string | null;
    notes?: string | null;
    created_by?: string | null;
    items: {
        id: number;
        description: string;
        quantity: string | number;
        unit_price: string | number;
        line_total: string | number;
    }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Quotes',
        href: QuoteController.index(),
    },
    {
        title: 'Quote details',
        href: '#',
    },
];

export default function QuoteShow({ quote }: { quote: Quote }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quote Details" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">{quote.quote_number}</h1>
                        <p className="text-sm text-slate-500">
                            {quote.title} · {quote.status}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={QuoteController.index()}>Back</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <a
                                href={QuoteController.download({ quote: quote.id }).url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Download
                            </a>
                        </Button>
                        <Button asChild>
                            <Link href={QuoteController.edit({ quote: quote.id })}>
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Client</h2>
                        <p className="text-sm text-slate-600">
                            Title: {quote.title}
                        </p>
                        <p className="text-sm text-slate-600">
                            Client: {quote.client ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Case: {quote.case ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Created by: {quote.created_by ?? '—'}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Dates</h2>
                        <p className="text-sm text-slate-600">
                            Issued: {quote.issued_at ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Valid until: {quote.valid_until ?? '—'}
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
                                {quote.items.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-4 py-3">
                                            {item.description}
                                        </td>
                                        <td className="px-4 py-3">{item.quantity}</td>
                                        <td className="px-4 py-3">{item.unit_price}</td>
                                        <td className="px-4 py-3">{item.line_total}</td>
                                    </tr>
                                ))}
                                {quote.items.length === 0 && (
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
                        <div>Subtotal: {quote.subtotal}</div>
                        <div>Tax (%): {quote.tax}</div>
                        <div className="font-semibold text-slate-900">
                            Total: {quote.total}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <h2 className="mb-2 font-semibold">Notes</h2>
                    <p className="text-sm text-slate-600">{quote.notes ?? '—'}</p>
                </div>
            </div>
        </AppLayout>
    );
}
