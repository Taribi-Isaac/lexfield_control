import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import StaffController from '@/actions/App/Http/Controllers/StaffController';
import type { BreadcrumbItem } from '@/types';

type Role = {
    id: number;
    name: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Staff',
        href: StaffController.index(),
    },
    {
        title: 'New Staff',
        href: StaffController.create(),
    },
];

export default function StaffCreate({ roles }: { roles: Role[] }) {
    const store = StaffController.store();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Staff" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">New Staff</h1>
                    <Button asChild variant="outline">
                        <Link href={StaffController.index()}>Back</Link>
                    </Button>
                </div>

                <Form action={store.url} method={store.method} className="grid gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full name</Label>
                                <Input id="name" name="name" required />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
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
                                            />
                                            {role.name}
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.roles} />
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="position">Position</Label>
                                    <Input id="position" name="position" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input id="department" name="department" />
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
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="employment_status">
                                        Employment status
                                    </Label>
                                    <Input
                                        id="employment_status"
                                        name="employment_status"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" name="address" />
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
