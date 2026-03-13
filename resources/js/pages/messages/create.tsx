import { Form, Head, Link } from '@inertiajs/react';
import ConversationController from '@/actions/App/Http/Controllers/ConversationController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Staff = {
    id: number;
    name: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Messages',
        href: ConversationController.index(),
    },
    {
        title: 'New Conversation',
        href: ConversationController.create(),
    },
];

export default function MessagesCreate({ staff }: { staff: Staff[] }) {
    const store = ConversationController.store();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Conversation" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">New Conversation</h1>
                    <Button asChild variant="outline">
                        <Link href={ConversationController.index()}>Back</Link>
                    </Button>
                </div>

                <Form
                    action={store.url}
                    method={store.method}
                    className="grid gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Conversation type</Label>
                                <select
                                    id="type"
                                    name="type"
                                    className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                    defaultValue="direct"
                                >
                                    <option value="direct">Direct</option>
                                    <option value="group">Group</option>
                                </select>
                                <InputError message={errors.type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="title">
                                    Group title (optional)
                                </Label>
                                <Input id="title" name="title" />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Select participants</Label>
                                <div className="grid gap-2 rounded-md border p-3">
                                    {staff.map((member) => (
                                        <label
                                            key={member.id}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                name="participants[]"
                                                value={member.id}
                                                className="h-4 w-4"
                                            />
                                            <span>{member.name}</span>
                                        </label>
                                    ))}
                                    {staff.length === 0 && (
                                        <p className="text-xs text-slate-500">
                                            No staff available.
                                        </p>
                                    )}
                                </div>
                                <InputError message={errors.participants} />
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
