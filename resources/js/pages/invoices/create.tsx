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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: InvoiceController.index(),
    },
    {
        title: 'New Invoice',
        href: InvoiceController.create(),
    },
];

export default function InvoiceCreate({
    clients,
    cases,
}: {
    clients: Client[];
    cases: CaseFile[];
}) {
    const store = InvoiceController.store();
    const [items, setItems] = useState(() => [{ key: Date.now() }]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Invoice" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">New Invoice</h1>
                    <Button asChild variant="outline">
                        <Link href={InvoiceController.index()}>Back</Link>
                    </Button>
                </div>

                <Form action={store.url} method={store.method} className="grid gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="client_id">Client</Label>
                                    <select
                                        id="client_id"
                                        name="client_id"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
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
                                    <Input id="title" name="title" required />
                                    <InputError message={errors.title} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="case_file_id">Case (optional)</Label>
                                    <select
                                        id="case_file_id"
                                        name="case_file_id"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
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

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="issued_at">Issued date</Label>
                                    <Input id="issued_at" name="issued_at" type="date" />
                                    <InputError message={errors.issued_at} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="due_date">Due date</Label>
                                    <Input id="due_date" name="due_date" type="date" />
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
                                                    placeholder="Service description"
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
                                                    defaultValue="1"
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
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Create invoice</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
