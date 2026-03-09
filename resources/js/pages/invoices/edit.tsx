import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import InvoiceController from '@/actions/App/Http/Controllers/InvoiceController';
import type { BreadcrumbItem } from '@/types';

type Client = { id: number; name: string };
type CaseFile = { id: number; title: string };
type InvoiceItem = {
    id: number;
    description: string;
    quantity: string | number;
    unit_price: string | number;
};
type Invoice = {
    id: number;
    client_id: number;
    case_file_id?: number | null;
    title: string;
    status: string;
    tax?: string | number | null;
    issued_at?: string | null;
    due_date?: string | null;
    notes?: string | null;
    items: InvoiceItem[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: InvoiceController.index(),
    },
    {
        title: 'Edit Invoice',
        href: '#',
    },
];

export default function InvoiceEdit({
    invoice,
    clients,
    cases,
}: {
    invoice: Invoice;
    clients: Client[];
    cases: CaseFile[];
}) {
    const update = InvoiceController.update({ invoice: invoice.id });
    const [items, setItems] = useState(
        invoice.items.length > 0
            ? invoice.items.map((item) => ({ ...item, key: item.id }))
            : [{ key: Date.now() }],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Invoice" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit Invoice</h1>
                    <Button asChild variant="outline">
                        <Link href={InvoiceController.index()}>Back</Link>
                    </Button>
                </div>

                <Form action={update.url} method={update.method} className="grid gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="client_id">Client</Label>
                                    <select
                                        id="client_id"
                                        name="client_id"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                        defaultValue={invoice.client_id}
                                        required
                                    >
                                        <option value="">Select client</option>
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.id}>
                                                {client.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.client_id} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Invoice title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        defaultValue={invoice.title}
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="case_file_id">Case (optional)</Label>
                                    <select
                                        id="case_file_id"
                                        name="case_file_id"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                        defaultValue={invoice.case_file_id ?? ''}
                                    >
                                        <option value="">No case linked</option>
                                        {cases.map((caseFile) => (
                                            <option key={caseFile.id} value={caseFile.id}>
                                                {caseFile.title}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.case_file_id} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                        defaultValue={invoice.status}
                                    >
                                        <option value="Unpaid">Unpaid</option>
                                        <option value="Partially Paid">Partially Paid</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                    <InputError message={errors.status} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="issued_at">Issued date</Label>
                                    <Input
                                        id="issued_at"
                                        name="issued_at"
                                        type="date"
                                        defaultValue={invoice.issued_at ?? ''}
                                    />
                                    <InputError message={errors.issued_at} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="due_date">Due date</Label>
                                    <Input
                                        id="due_date"
                                        name="due_date"
                                        type="date"
                                        defaultValue={invoice.due_date ?? ''}
                                    />
                                    <InputError message={errors.due_date} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tax">Tax (%)</Label>
                                    <Input
                                        id="tax"
                                        name="tax"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        defaultValue={invoice.tax ?? ''}
                                    />
                                    <InputError message={errors.tax} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Line items</Label>
                                <div className="space-y-4">
                                    {items.map((item, index) => (
                                        <div
                                            key={item.key}
                                            className="grid gap-3 rounded-md border p-3 md:grid-cols-6"
                                        >
                                            <div className="md:col-span-3">
                                                <Label
                                                    htmlFor={`items[${index}][description]`}
                                                >
                                                    Description
                                                </Label>
                                                <Input
                                                    id={`items[${index}][description]`}
                                                    name={`items[${index}][description]`}
                                                    defaultValue={item.description ?? ''}
                                                />
                                                <InputError
                                                    message={
                                                        errors[`items.${index}.description`]
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label
                                                    htmlFor={`items[${index}][quantity]`}
                                                >
                                                    Qty
                                                </Label>
                                                <Input
                                                    id={`items[${index}][quantity]`}
                                                    name={`items[${index}][quantity]`}
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    defaultValue={item.quantity ?? '1'}
                                                />
                                                <InputError
                                                    message={
                                                        errors[`items.${index}.quantity`]
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label
                                                    htmlFor={`items[${index}][unit_price]`}
                                                >
                                                    Unit price
                                                </Label>
                                                <Input
                                                    id={`items[${index}][unit_price]`}
                                                    name={`items[${index}][unit_price]`}
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    defaultValue={item.unit_price ?? ''}
                                                />
                                                <InputError
                                                    message={
                                                        errors[`items.${index}.unit_price`]
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setItems((current) =>
                                                            current.length > 1
                                                                ? current.filter(
                                                                      (entry) =>
                                                                          entry.key !==
                                                                          item.key,
                                                                  )
                                                                : current,
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <InputError message={errors.items} />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                        setItems((current) => [
                                            ...current,
                                            { key: Date.now() + current.length },
                                        ])
                                    }
                                >
                                    Add item
                                </Button>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notes</Label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    className="min-h-[120px] rounded-md border bg-transparent px-3 py-2 text-sm"
                                    defaultValue={invoice.notes ?? ''}
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save changes</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
