import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ClientController from '@/actions/App/Http/Controllers/ClientController';
import type { BreadcrumbItem } from '@/types';

type ClientItem = {
    id: number;
    name: string;
    client_type: string;
    email?: string | null;
    phone?: string | null;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: ClientController.index(),
    },
];

export default function ClientsIndex({
    clients,
}: {
    clients: Paginated<ClientItem>;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Clients</h1>
                    <Button asChild>
                        <Link href={ClientController.create()}>New Client</Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.data.map((client) => (
                                <tr key={client.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        {client.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {client.client_type}
                                    </td>
                                    <td className="px-4 py-3">
                                        {client.email || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {client.phone || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link
                                            className="text-sm text-primary underline-offset-4 hover:underline"
                                            href={ClientController.edit({
                                                client: client.id,
                                            })}
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {clients.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No clients yet.
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
