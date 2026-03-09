import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import QuoteController from '@/actions/App/Http/Controllers/QuoteController';
import type { BreadcrumbItem } from '@/types';

type QuoteItem = {
    id: number;
    quote_number: string;
    title?: string | null;
    client?: string | null;
    case?: string | null;
    status: string;
    total: string | number;
    issued_at?: string | null;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Quotes',
        href: QuoteController.index(),
    },
];

export default function QuotesIndex({
    quotes,
    filters,
}: {
    quotes: Paginated<QuoteItem>;
    filters: { search?: string | null };
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quotes" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Quotes</h1>
                        <p className="text-sm text-slate-500">
                            Search by quote number, client, or case.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Form
                            action={QuoteController.index().url}
                            method="get"
                            className="flex items-center gap-2"
                        >
                            <Input
                                name="search"
                                placeholder="Search quotes"
                                defaultValue={filters.search ?? ''}
                            />
                            <Button type="submit">Search</Button>
                        </Form>
                        <Button asChild>
                            <Link href={QuoteController.create()}>New Quote</Link>
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Quote</th>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Client</th>
                                <th className="px-4 py-3">Case</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Issued</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotes.data.map((quote) => (
                                <tr key={quote.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        {quote.quote_number}
                                    </td>
                                    <td className="px-4 py-3">
                                        {quote.title ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {quote.client ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {quote.case ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">{quote.status}</td>
                                    <td className="px-4 py-3">{quote.total}</td>
                                    <td className="px-4 py-3">
                                        {quote.issued_at ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link
                                            className="text-sm text-primary underline-offset-4 hover:underline"
                                            href={QuoteController.show({
                                                quote: quote.id,
                                            })}
                                        >
                                            View
                                        </Link>
                                        <span className="px-2 text-slate-300">|</span>
                                        <Link
                                            className="text-sm text-primary underline-offset-4 hover:underline"
                                            href={QuoteController.edit({
                                                quote: quote.id,
                                            })}
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {quotes.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No quotes yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
