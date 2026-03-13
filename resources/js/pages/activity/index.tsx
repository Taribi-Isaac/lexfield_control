import { Form, Head } from '@inertiajs/react';
import ActivityLogController from '@/actions/App/Http/Controllers/ActivityLogController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type ActivityLog = {
    id: number;
    user?: string | null;
    action: string;
    route?: string | null;
    method?: string | null;
    description?: string | null;
    created_at?: string | null;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

type User = { id: number; name: string };

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Activity Logs',
        href: ActivityLogController.index(),
    },
];

export default function ActivityIndex({
    logs,
    filters,
    users,
}: {
    logs: Paginated<ActivityLog>;
    filters: { search?: string | null; user_id?: string | null };
    users: User[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Logs" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Activity Logs</h1>
                        <p className="text-sm text-slate-500">
                            Track key actions performed by staff.
                        </p>
                    </div>
                </div>

                <Form
                    action={ActivityLogController.index().url}
                    method="get"
                    className="flex flex-wrap items-center gap-2"
                >
                    <Input
                        name="search"
                        placeholder="Search logs..."
                        defaultValue={filters.search ?? ''}
                    />
                    <select
                        name="user_id"
                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                        defaultValue={filters.user_id ?? ''}
                    >
                        <option value="">All staff</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <Button type="submit">Filter</Button>
                </Form>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">Route</th>
                                <th className="px-4 py-3">Method</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.map((log) => (
                                <tr key={log.id} className="border-t">
                                    <td className="px-4 py-3">
                                        {log.user ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">{log.action}</td>
                                    <td className="px-4 py-3">
                                        {log.route ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {log.method ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {log.description ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {log.created_at ?? '—'}
                                    </td>
                                </tr>
                            ))}
                            {logs.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No activity yet.
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
