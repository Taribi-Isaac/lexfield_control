import { Form, Head, Link } from '@inertiajs/react';
import InvoiceController from '@/actions/App/Http/Controllers/InvoiceController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import DeleteAction from '@/components/delete-action';

type InvoiceItem = {
    id: number;
    invoice_number: string;
    title?: string | null;
    client?: string | null;
    case?: string | null;
    status: string;
    total: string | number;
    due_date?: string | null;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: InvoiceController.index(),
    },
];

export default function InvoicesIndex({
    invoices,
    filters,
}: {
    invoices: Paginated<InvoiceItem>;
    filters: { search?: string | null };
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoices" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Invoices</h1>
                        <p className="text-sm text-slate-500">
                            Search by invoice number, client, or case.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Form
                            action={InvoiceController.index().url}
                            method="get"
                            className="flex items-center gap-2"
                        >
                            <Input
                                name="search"
                                placeholder="Search invoices"
                                defaultValue={filters.search ?? ''}
                            />
                            <Button type="submit">Search</Button>
                        </Form>
                        <Button asChild>
                            <Link href={InvoiceController.create()}>
                                New Invoice
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Invoice</th>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Client</th>
                                <th className="px-4 py-3">Case</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Due</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.data.map((invoice) => (
                                <tr key={invoice.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        {invoice.invoice_number}
                                    </td>
                                    <td className="px-4 py-3">
                                        {invoice.title ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {invoice.client ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {invoice.case ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {invoice.status}
                                    </td>
                                    <td className="px-4 py-3">
                                        {invoice.total}
                                    </td>
                                    <td className="px-4 py-3">
                                        {invoice.due_date ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                className="text-sm text-primary underline-offset-4 hover:underline"
                                                href={InvoiceController.show({
                                                    invoice: invoice.id,
                                                })}
                                            >
                                                View
                                            </Link>
                                            <span className="text-slate-300">
                                                |
                                            </span>
                                            <Link
                                                className="text-sm text-primary underline-offset-4 hover:underline"
                                                href={InvoiceController.edit({
                                                    invoice: invoice.id,
                                                })}
                                            >
                                                Edit
                                            </Link>
                                            <span className="text-slate-300">
                                                |
                                            </span>
                                            <DeleteAction
                                                action={InvoiceController.destroy(
                                                    {
                                                        invoice: invoice.id,
                                                    },
                                                )}
                                                title="Delete Invoice"
                                                description={`Are you sure you want to delete ${invoice.invoice_number}?`}
                                                variant="icon"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {invoices.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No invoices yet.
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
