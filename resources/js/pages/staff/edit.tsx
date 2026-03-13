import { Form, Head, Link } from '@inertiajs/react';
import StaffController from '@/actions/App/Http/Controllers/StaffController';
import DeleteAction from '@/components/delete-action';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Role = {
    id: number;
    name: string;
};

type StaffProfile = {
    phone?: string | null;
    address?: string | null;
    position?: string | null;
    department?: string | null;
    employment_type?: string | null;
    employment_status?: string | null;
    date_hired?: string | null;
};

type Staff = {
    id: number;
    name: string;
    email: string;
    roles: number[];
    profile?: StaffProfile | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Staff',
        href: StaffController.index(),
    },
    {
        title: 'Edit Staff',
        href: '#',
    },
];

export default function StaffEdit({
    staff,
    roles,
}: {
    staff: Staff;
    roles: Role[];
}) {
    const update = StaffController.update({ staff: staff.id });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Staff" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit Staff</h1>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={StaffController.index()}>Back</Link>
                        </Button>
                        <DeleteAction
                            action={StaffController.destroy({
                                staff: staff.id,
                            })}
                            title="Delete Staff"
                            description={`Are you sure you want to delete ${staff.name}? This will remove their profile and access.`}
                        />
                    </div>
                </div>

                <Form
                    action={update.url}
                    method={update.method}
                    className="grid gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={staff.name}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={staff.email}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    Password (optional)
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Roles</Label>
                                <div className="grid gap-2">
                                    {roles.map((role) => (
                                        <label
                                            key={role.id}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                name="roles[]"
                                                value={role.id}
                                                defaultChecked={staff.roles.includes(
                                                    role.id,
                                                )}
                                            />
                                            {role.name}
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.roles} />
                                <p className="text-xs text-slate-500">
                                    Manage role permissions under Roles &amp;
                                    Permissions.
                                </p>
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="position">Position</Label>
                                    <Input
                                        id="position"
                                        name="position"
                                        defaultValue={
                                            staff.profile?.position ?? ''
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="department">
                                        Department
                                    </Label>
                                    <Input
                                        id="department"
                                        name="department"
                                        defaultValue={
                                            staff.profile?.department ?? ''
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="employment_type">
                                        Employment type
                                    </Label>
                                    <Input
                                        id="employment_type"
                                        name="employment_type"
                                        defaultValue={
                                            staff.profile?.employment_type ?? ''
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="employment_status">
                                        Employment status
                                    </Label>
                                    <Input
                                        id="employment_status"
                                        name="employment_status"
                                        defaultValue={
                                            staff.profile?.employment_status ??
                                            ''
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    defaultValue={staff.profile?.phone ?? ''}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    defaultValue={staff.profile?.address ?? ''}
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
