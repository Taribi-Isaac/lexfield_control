import { Form, Head, Link } from '@inertiajs/react';
import NotificationLetterController from '@/actions/App/Http/Controllers/NotificationLetterController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Client = { id: number; name: string };
type CaseFile = { id: number; title: string };

type Letter = {
    id: number;
    title: string;
    client_id?: number | null;
    case_file_id?: number | null;
    body: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notification Letters',
        href: NotificationLetterController.index(),
    },
    {
        title: 'Edit Letter',
        href: '#',
    },
];

export default function NotificationLettersEdit({
    letter,
    clients,
    cases,
}: {
    letter: Letter;
    clients: Client[];
    cases: CaseFile[];
}) {
    const update = NotificationLetterController.update({
        notification_letter: letter.id,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Notification Letter" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Edit Notification Letter
                    </h1>
                    <Button asChild variant="outline">
                        <Link
                            href={NotificationLetterController.show({
                                notification_letter: letter.id,
                            })}
                        >
                            Back
                        </Link>
                    </Button>
                </div>

                <Form
                    action={update.url}
                    method={update.method}
                    className="grid gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={letter.title}
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="client_id">
                                        Client (optional)
                                    </Label>
                                    <select
                                        id="client_id"
                                        name="client_id"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                        defaultValue={letter.client_id ?? ''}
                                    >
                                        <option value="">Select client</option>
                                        {clients.map((client) => (
                                            <option
                                                key={client.id}
                                                value={client.id}
                                            >
                                                {client.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.client_id} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="case_file_id">
                                        Case (optional)
                                    </Label>
                                    <select
                                        id="case_file_id"
                                        name="case_file_id"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                        defaultValue={letter.case_file_id ?? ''}
                                    >
                                        <option value="">Select case</option>
                                        {cases.map((caseFile) => (
                                            <option
                                                key={caseFile.id}
                                                value={caseFile.id}
                                            >
                                                {caseFile.title}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.case_file_id} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="body">Body</Label>
                                <textarea
                                    id="body"
                                    name="body"
                                    defaultValue={letter.body}
                                    className="min-h-[220px] rounded-md border bg-transparent px-3 py-2 text-sm"
                                />
                                <p className="text-xs text-slate-500">
                                    You may use basic HTML tags like
                                    &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;,
                                    &lt;li&gt; for formatting.
                                </p>
                                <InputError message={errors.body} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Update</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
