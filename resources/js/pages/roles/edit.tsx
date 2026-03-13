import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import type { BreadcrumbItem } from '@/types';

type Permission = {
    id: number;
    name: string;
    slug: string;
    action?: string | null;
};

type PermissionGroup = {
    module: string;
    permissions: Permission[];
};

type Role = {
    id: number;
    name: string;
    slug: string;
    permissions: number[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles & Permissions',
        href: RoleController.index(),
    },
    {
        title: 'Edit Role',
        href: '#',
    },
];

export default function RoleEdit({
    role,
    permissions,
}: {
    role: Role;
    permissions: PermissionGroup[];
}) {
    const update = RoleController.update({ role: role.id });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${role.name}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">{role.name}</h1>
                        <p className="text-sm text-slate-500">{role.slug}</p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={RoleController.index()}>Back</Link>
                    </Button>
                </div>

                <Form action={update.url} method={update.method} className="grid gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {permissions.map((group) => (
                                    <div key={group.module} className="rounded-lg border p-4">
                                        <h2 className="mb-3 font-semibold">
                                            {group.module}
                                        </h2>
                                        <div className="grid gap-2 md:grid-cols-2">
                                            {group.permissions.map((permission) => (
                                                <label
                                                    key={permission.id}
                                                    className="flex items-center gap-2 text-sm"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="permissions[]"
                                                        value={permission.id}
                                                        defaultChecked={role.permissions.includes(
                                                            permission.id,
                                                        )}
                                                        className="h-4 w-4"
                                                    />
                                                    <span>{permission.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <InputError message={errors.permissions} />

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save permissions</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
