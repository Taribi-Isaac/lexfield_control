import { Form, Head, Link } from '@inertiajs/react';
import PaymentController from '@/actions/App/Http/Controllers/PaymentController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Invoice = {
    id: number;
    invoice_number: string;
    total: string | number;
};

type Payment = {
    id: number;
    invoice_id: number;
    amount: string | number;
    method?: string | null;
    reference?: string | null;
    paid_at?: string | null;
    notes?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: PaymentController.index(),
    },
    {
        title: 'Edit Payment',
        href: '#',
    },
];

export default function PaymentEdit({
    payment,
    invoices,
}: {
    payment: Payment;
    invoices: Invoice[];
}) {
    const update = PaymentController.update({ payment: payment.id });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Payment" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit Payment</h1>
                    <Button asChild variant="outline">
                        <Link href={PaymentController.index()}>Back</Link>
                    </Button>
                </div>

                <Form
                    action={update.url}
                    method={update.method}
                    className="grid gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="invoice_id">Invoice</Label>
                                    <select
                                        id="invoice_id"
                                        name="invoice_id"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                        defaultValue={payment.invoice_id}
                                        required
                                    >
                                        <option value="">Select invoice</option>
                                        {invoices.map((invoice) => (
                                            <option
                                                key={invoice.id}
                                                value={invoice.id}
                                            >
                                                {invoice.invoice_number} (₦
                                                {invoice.total})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.invoice_id} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        defaultValue={payment.amount}
                                        required
                                    />
                                    <InputError message={errors.amount} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="method">
                                        Payment method
                                    </Label>
                                    <Input
                                        id="method"
                                        name="method"
                                        defaultValue={payment.method ?? ''}
                                    />
                                    <InputError message={errors.method} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="reference">Reference</Label>
                                    <Input
                                        id="reference"
                                        name="reference"
                                        defaultValue={payment.reference ?? ''}
                                    />
                                    <InputError message={errors.reference} />
                                </div>
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="paid_at">Paid at</Label>
                                    <Input
                                        id="paid_at"
                                        name="paid_at"
                                        type="date"
                                        defaultValue={payment.paid_at ?? ''}
                                    />
                                    <InputError message={errors.paid_at} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Input
                                        id="notes"
                                        name="notes"
                                        defaultValue={payment.notes ?? ''}
                                    />
                                    <InputError message={errors.notes} />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>
                                    Save changes
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
