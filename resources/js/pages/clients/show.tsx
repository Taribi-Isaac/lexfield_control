import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ClientController from '@/actions/App/Http/Controllers/ClientController';
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
    cases: { id: number; title: string; status: string }[];
    documents: { id: number; title: string }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: ClientController.index(),
    },
    {
        title: 'Client details',
        href: '#',
    },
];

export default function ClientShow({ client }: { client: Client }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client Details" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">{client.name}</h1>
                        <p className="text-sm text-slate-500">
                            {client.client_type} client
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={ClientController.index()}>Back</Link>
                        </Button>
                        <Button asChild>
                            <Link href={ClientController.edit({ client: client.id })}>
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Contact</h2>
                        <p className="text-sm text-slate-600">
                            Email: {client.email ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Phone: {client.phone ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Address: {client.address ?? '—'}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Corporate Details</h2>
                        <p className="text-sm text-slate-600">
                            Company: {client.company_name ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Registration: {client.company_registration_number ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Contact person: {client.contact_person_name ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Contact email: {client.contact_person_email ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Contact phone: {client.contact_person_phone ?? '—'}
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Cases</h2>
                        {client.cases.length === 0 ? (
                            <p className="text-sm text-slate-500">No cases linked.</p>
                        ) : (
                            <ul className="space-y-2 text-sm text-slate-700">
                                {client.cases.map((caseFile) => (
                                    <li key={caseFile.id}>
                                        {caseFile.title} · {caseFile.status}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Documents</h2>
                        {client.documents.length === 0 ? (
                            <p className="text-sm text-slate-500">No documents linked.</p>
                        ) : (
                            <ul className="space-y-2 text-sm text-slate-700">
                                {client.documents.map((document) => (
                                    <li key={document.id}>{document.title}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
