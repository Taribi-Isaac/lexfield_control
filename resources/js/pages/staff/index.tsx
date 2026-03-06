import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import StaffController from '@/actions/App/Http/Controllers/StaffController';
import type { BreadcrumbItem } from '@/types';

type StaffItem = {
    id: number;
    name: string;
    email: string;
    roles: string[];
    position?: string | null;
    department?: string | null;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Staff',
        href: StaffController.index(),
    },
];

export default function StaffIndex({ staff }: { staff: Paginated<StaffItem> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Staff</h1>
                    <Button asChild>
                        <Link href={StaffController.create()}>New Staff</Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Department</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.data.map((member) => (
                                <tr key={member.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        {member.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {member.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        {member.roles.join(', ') || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {member.department || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link
                                            className="text-sm text-primary underline-offset-4 hover:underline"
                                            href={StaffController.edit({
                                                staff: member.id,
                                            })}
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {staff.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No staff records yet.
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
