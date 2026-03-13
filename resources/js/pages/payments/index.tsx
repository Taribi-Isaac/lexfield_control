import { Form, Head, Link } from '@inertiajs/react';
import PaymentController from '@/actions/App/Http/Controllers/PaymentController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import DeleteAction from '@/components/delete-action';

type PaymentItem = {
    id: number;
    receipt_number: string;
    invoice_number?: string | null;
    client?: string | null;
    amount: string | number;
    method?: string | null;
    paid_at?: string | null;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: PaymentController.index(),
    },
];

export default function PaymentsIndex({
    payments,
    filters,
}: {
    payments: Paginated<PaymentItem>;
    filters: { search?: string | null };
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Payments</h1>
                        <p className="text-sm text-slate-500">
                            Search by receipt, invoice, client, or reference.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Form
                            action={PaymentController.index().url}
                            method="get"
                            className="flex items-center gap-2"
                        >
                            <Input
                                name="search"
                                placeholder="Search payments"
                                defaultValue={filters.search ?? ''}
                            />
                            <Button type="submit">Search</Button>
                        </Form>
                        <Button asChild>
                            <Link href={PaymentController.create()}>
                                Record Payment
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Receipt</th>
                                <th className="px-4 py-3">Invoice</th>
                                <th className="px-4 py-3">Client</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Method</th>
                                <th className="px-4 py-3">Paid at</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.data.map((payment) => (
                                <tr key={payment.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        {payment.receipt_number}
                                    </td>
                                    <td className="px-4 py-3">
                                        {payment.invoice_number ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {payment.client ?? '—'}
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
                                        <div className="flex items-center gap-2">
                                            <Link
                                                className="text-sm text-primary underline-offset-4 hover:underline"
                                                href={PaymentController.show({
                                                    payment: payment.id,
                                                })}
                                            >
                                                View
                                            </Link>
                                            <span className="text-slate-300">
                                                |
                                            </span>
                                            <Link
                                                className="text-sm text-primary underline-offset-4 hover:underline"
                                                href={PaymentController.edit({
                                                    payment: payment.id,
                                                })}
                                            >
                                                Edit
                                            </Link>
                                            <span className="text-slate-300">
                                                |
                                            </span>
                                            <DeleteAction
                                                action={PaymentController.destroy(
                                                    {
                                                        payment: payment.id,
                                                    },
                                                )}
                                                title="Delete Payment"
                                                description={`Are you sure you want to delete payment ${payment.receipt_number}?`}
                                                variant="icon"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {payments.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No payments yet.
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
