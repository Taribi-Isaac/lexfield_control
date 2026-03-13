import { Form, Head, Link } from '@inertiajs/react';
import NotificationLetterController from '@/actions/App/Http/Controllers/NotificationLetterController';
import DeleteAction from '@/components/delete-action';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Letter = {
    id: number;
    title: string;
    client?: string | null;
    case?: string | null;
    suit_number?: string | null;
    court?: string | null;
    body: string;
    created_at?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notification Letters',
        href: NotificationLetterController.index(),
    },
    {
        title: 'Letter details',
        href: '#',
    },
];

export default function NotificationLetterShow({ letter }: { letter: Letter }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notification Letter" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {letter.title}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {letter.client ?? 'No client'} ·{' '}
                            {letter.created_at ?? '—'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={NotificationLetterController.index()}>
                                Back
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link
                                href={NotificationLetterController.edit({
                                    notification_letter: letter.id,
                                })}
                            >
                                Edit
                            </Link>
                        </Button>
                        <Button asChild>
                            <a
                                href={
                                    NotificationLetterController.download({
                                        notification_letter: letter.id,
                                    }).url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Download
                            </a>
                        </Button>
                        <Form
                            {...NotificationLetterController.duplicate.form({
                                notification_letter: letter.id,
                            })}
                        >
                            <Button variant="secondary" type="submit">
                                Duplicate
                            </Button>
                        </Form>
                        <DeleteAction
                            action={NotificationLetterController.destroy({
                                notification_letter: letter.id,
                            })}
                            title="Delete Letter"
                            description={`Are you sure you want to delete ${letter.title}?`}
                        />
                    </div>
                </div>

                {(letter.case || letter.suit_number || letter.court) && (
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Case information</h2>
                        <div className="grid gap-1 text-sm text-slate-600">
                            <p>Case: {letter.case ?? '—'}</p>
                            <p>Suit number: {letter.suit_number ?? '—'}</p>
                            <p>Court: {letter.court ?? '—'}</p>
                        </div>
                    </div>
                )}

                <div className="rounded-lg border p-4">
                    <h2 className="mb-2 font-semibold">Letter body</h2>
                    <div
                        className="text-sm text-slate-700"
                        dangerouslySetInnerHTML={{ __html: letter.body }}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
