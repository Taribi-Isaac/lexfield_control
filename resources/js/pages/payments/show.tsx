import { Head, Link } from '@inertiajs/react';
import PaymentController from '@/actions/App/Http/Controllers/PaymentController';
import DeleteAction from '@/components/delete-action';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Payment = {
    id: number;
    receipt_number: string;
    amount: string | number;
    method?: string | null;
    reference?: string | null;
    paid_at?: string | null;
    notes?: string | null;
    received_by?: string | null;
    invoice?: {
        id?: number | null;
        invoice_number?: string | null;
        client?: string | null;
        total?: string | number | null;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: PaymentController.index(),
    },
    {
        title: 'Payment details',
        href: '#',
    },
];

export default function PaymentShow({ payment }: { payment: Payment }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Details" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {payment.receipt_number}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {payment.method ?? 'Payment'} ·{' '}
                            {payment.paid_at ?? '—'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={PaymentController.index()}>Back</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <a
                                href={
                                    PaymentController.receipt({
                                        payment: payment.id,
                                    }).url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Receipt
                            </a>
                        </Button>
                        <Button asChild>
                            <Link
                                href={PaymentController.edit({
                                    payment: payment.id,
                                })}
                            >
                                Edit
                            </Link>
                        </Button>
                        <DeleteAction
                            action={PaymentController.destroy({
                                payment: payment.id,
                            })}
                            title="Delete Payment"
                            description={`Are you sure you want to delete payment ${payment.receipt_number}?`}
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Payment</h2>
                        <p className="text-sm text-slate-600">
                            Amount: {payment.amount}
                        </p>
                        <p className="text-sm text-slate-600">
                            Method: {payment.method ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Reference: {payment.reference ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Received by: {payment.received_by ?? '—'}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Invoice</h2>
                        <p className="text-sm text-slate-600">
                            Invoice: {payment.invoice?.invoice_number ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Client: {payment.invoice?.client ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Total: {payment.invoice?.total ?? '—'}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <h2 className="mb-2 font-semibold">Notes</h2>
                    <p className="text-sm text-slate-600">
                        {payment.notes ?? '—'}
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
