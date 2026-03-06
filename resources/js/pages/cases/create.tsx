import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CaseFileController from '@/actions/App/Http/Controllers/CaseFileController';
import type { BreadcrumbItem } from '@/types';

type Option = {
    id: number;
    name?: string;
    title?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cases',
        href: CaseFileController.index(),
    },
    {
        title: 'New Case',
        href: CaseFileController.create(),
    },
];

export default function CaseCreate({
    clients,
    lawyers,
}: {
    clients: Option[];
    lawyers: Option[];
}) {
    const store = CaseFileController.store();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Case" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">New Case</h1>
                    <Button asChild variant="outline">
                        <Link href={CaseFileController.index()}>Back</Link>
                    </Button>
                </div>

                <Form action={store.url} method={store.method} className="grid gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="client_id">Client</Label>
                                <select
                                    id="client_id"
                                    name="client_id"
                                    className="h-9 rounded-md border bg-transparent px-3 text-sm"
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
                                <Label htmlFor="title">Case title</Label>
                                <Input id="title" name="title" required />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="suit_number">
                                        Suit number
                                    </Label>
                                    <Input id="suit_number" name="suit_number" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="court">Court</Label>
                                    <Input id="court" name="court" />
                                </div>
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="lead_lawyer_id">
                                        Lead lawyer
                                    </Label>
                                    <select
                                        id="lead_lawyer_id"
                                        name="lead_lawyer_id"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                    >
                                        <option value="">Select lawyer</option>
                                        {lawyers.map((lawyer) => (
                                            <option key={lawyer.id} value={lawyer.id}>
                                                {lawyer.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="filing_date">
                                        Filing date
                                    </Label>
                                    <Input
                                        id="filing_date"
                                        name="filing_date"
                                        type="date"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="opposing_party">
                                        Opposing party
                                    </Label>
                                    <Input
                                        id="opposing_party"
                                        name="opposing_party"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="opposing_counsel">
                                        Opposing counsel
                                    </Label>
                                    <Input
                                        id="opposing_counsel"
                                        name="opposing_counsel"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    name="status"
                                    className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                    defaultValue="Open"
                                >
                                    <option value="Open">Open</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Adjourned">Adjourned</option>
                                    <option value="Closed">Closed</option>
                                    <option value="Appeal">Appeal</option>
                                </select>
                                <InputError message={errors.status} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Create</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
