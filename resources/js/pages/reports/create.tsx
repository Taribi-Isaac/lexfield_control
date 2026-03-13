import { Form, Head, Link } from '@inertiajs/react';
import ReportController from '@/actions/App/Http/Controllers/ReportController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Option = {
    id: number;
    title?: string;
    name?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: ReportController.index(),
    },
    {
        title: 'New Report',
        href: ReportController.create(),
    },
];

export default function ReportCreate({
    cases,
    staff,
    documents,
}: {
    cases: Option[];
    staff: Option[];
    documents: Option[];
}) {
    const store = ReportController.store();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Report" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">New Report</h1>
                    <Button asChild variant="outline">
                        <Link href={ReportController.index()}>Back</Link>
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
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" required />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="case_file_id">Case</Label>
                                <select
                                    id="case_file_id"
                                    name="case_file_id"
                                    className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                >
                                    <option value="">Select case</option>
                                    {cases.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.title}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.case_file_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Shared with</Label>
                                <div className="grid gap-2 rounded-md border p-3">
                                    {staff.map((item) => (
                                        <label
                                            key={item.id}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                name="shared_with[]"
                                                value={item.id}
                                                className="h-4 w-4"
                                            />
                                            <span>{item.name}</span>
                                        </label>
                                    ))}
                                    {staff.length === 0 && (
                                        <p className="text-xs text-slate-500">
                                            No staff available.
                                        </p>
                                    )}
                                </div>
                                <InputError message={errors.shared_with} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="content">Report content</Label>
                                <textarea
                                    id="content"
                                    name="content"
                                    className="min-h-[180px] rounded-md border bg-transparent px-3 py-2 text-sm"
                                />
                                <InputError message={errors.content} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    name="status"
                                    className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                    defaultValue="Draft"
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Submitted">Submitted</option>
                                    <option value="Reviewed">Reviewed</option>
                                </select>
                                <InputError message={errors.status} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Attachments</Label>
                                <div className="grid gap-2 rounded-md border p-3">
                                    {documents.map((item) => (
                                        <label
                                            key={item.id}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                name="attachments[]"
                                                value={item.id}
                                                className="h-4 w-4"
                                            />
                                            <span>{item.title}</span>
                                        </label>
                                    ))}
                                    {documents.length === 0 && (
                                        <p className="text-xs text-slate-500">
                                            No documents available.
                                        </p>
                                    )}
                                </div>
                                <InputError message={errors.attachments} />
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
