import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CauseListController from '@/actions/App/Http/Controllers/CauseListController';
import type { BreadcrumbItem } from '@/types';

type Lawyer = {
    id: number;
    name: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cause List',
        href: CauseListController.index(),
    },
    {
        title: 'New Entry',
        href: CauseListController.create(),
    },
];

export default function CauseListCreate({ lawyers }: { lawyers: Lawyer[] }) {
    const store = CauseListController.store();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Cause List Entry" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">New Cause List Entry</h1>
                    <Button asChild variant="outline">
                        <Link href={CauseListController.index()}>Back</Link>
                    </Button>
                </div>

                <Form action={store.url} method={store.method} className="grid gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" name="date" type="date" required />
                                    <InputError message={errors.date} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Input id="time" name="time" type="time" />
                                    <InputError message={errors.time} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="court">Court</Label>
                                <Input id="court" name="court" required />
                                <InputError message={errors.court} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="case_title">Case title</Label>
                                <Input id="case_title" name="case_title" required />
                                <InputError message={errors.case_title} />
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="suit_number">Suit number</Label>
                                    <Input id="suit_number" name="suit_number" />
                                    <InputError message={errors.suit_number} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="assigned_lawyer_id">Assigned lawyer</Label>
                                    <select
                                        id="assigned_lawyer_id"
                                        name="assigned_lawyer_id"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                    >
                                        <option value="">Select lawyer</option>
                                        {lawyers.map((lawyer) => (
                                            <option key={lawyer.id} value={lawyer.id}>
                                                {lawyer.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.assigned_lawyer_id} />
                                </div>
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="business_of_day">Business of the day</Label>
                                    <Input id="business_of_day" name="business_of_day" />
                                    <InputError message={errors.business_of_day} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                        defaultValue="Scheduled"
                                    >
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="In Court">In Court</option>
                                        <option value="Adjourned">Adjourned</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <InputError message={errors.status} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Input id="notes" name="notes" />
                                <InputError message={errors.notes} />
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
