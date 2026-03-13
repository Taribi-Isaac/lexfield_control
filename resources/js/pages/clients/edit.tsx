import { Form, Head, Link } from '@inertiajs/react';
import ClientController from '@/actions/App/Http/Controllers/ClientController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Client = {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    client_type: string;
    company_name?: string | null;
    company_registration_number?: string | null;
    contact_person_name?: string | null;
    contact_person_email?: string | null;
    contact_person_phone?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: ClientController.index(),
    },
    {
        title: 'Edit Client',
        href: '#',
    },
];

export default function ClientEdit({ client }: { client: Client }) {
    const update = ClientController.update({ client: client.id });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Client" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit Client</h1>
                    <Button asChild variant="outline">
                        <Link href={ClientController.index()}>Back</Link>
                    </Button>
                </div>

                <Form
                    action={update.url}
                    method={update.method}
                    className="grid gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Client name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={client.name}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="client_type">Client type</Label>
                                <select
                                    id="client_type"
                                    name="client_type"
                                    className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                    defaultValue={client.client_type}
                                >
                                    <option value="Individual">
                                        Individual
                                    </option>
                                    <option value="Corporate">Corporate</option>
                                </select>
                                <InputError message={errors.client_type} />
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={client.email ?? ''}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        defaultValue={client.phone ?? ''}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    defaultValue={client.address ?? ''}
                                />
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="company_name">
                                        Company name
                                    </Label>
                                    <Input
                                        id="company_name"
                                        name="company_name"
                                        defaultValue={client.company_name ?? ''}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="company_registration_number">
                                        Company reg. no.
                                    </Label>
                                    <Input
                                        id="company_registration_number"
                                        name="company_registration_number"
                                        defaultValue={
                                            client.company_registration_number ??
                                            ''
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="contact_person_name">
                                        Contact person
                                    </Label>
                                    <Input
                                        id="contact_person_name"
                                        name="contact_person_name"
                                        defaultValue={
                                            client.contact_person_name ?? ''
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contact_person_phone">
                                        Contact phone
                                    </Label>
                                    <Input
                                        id="contact_person_phone"
                                        name="contact_person_phone"
                                        defaultValue={
                                            client.contact_person_phone ?? ''
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="contact_person_email">
                                    Contact email
                                </Label>
                                <Input
                                    id="contact_person_email"
                                    name="contact_person_email"
                                    type="email"
                                    defaultValue={
                                        client.contact_person_email ?? ''
                                    }
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
