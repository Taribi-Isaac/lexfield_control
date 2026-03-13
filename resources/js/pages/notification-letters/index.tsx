import { Form, Head, Link } from '@inertiajs/react';
import { Copy } from 'lucide-react';
import NotificationLetterController from '@/actions/App/Http/Controllers/NotificationLetterController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import DeleteAction from '@/components/delete-action';

type Letter = {
    id: number;
    title: string;
    client?: string | null;
    case?: string | null;
    created_at?: string | null;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notification Letters',
        href: NotificationLetterController.index(),
    },
];

export default function NotificationLettersIndex({
    letters,
    filters,
}: {
    letters: Paginated<Letter>;
    filters: { search?: string | null };
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notification Letters" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">
                            Notification Letters
                        </h1>
                        <p className="text-sm text-slate-500">
                            Create and manage notification letters.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Form
                            action={NotificationLetterController.index().url}
                            method="get"
                            className="flex items-center gap-2"
                        >
                            <Input
                                name="search"
                                placeholder="Search letters"
                                defaultValue={filters.search ?? ''}
                            />
                            <Button type="submit">Search</Button>
                        </Form>
                        <Button asChild>
                            <Link href={NotificationLetterController.create()}>
                                New Letter
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Client</th>
                                <th className="px-4 py-3">Case</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {letters.data.map((letter) => (
                                <tr key={letter.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        {letter.title}
                                    </td>
                                    <td className="px-4 py-3">
                                        {letter.client ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {letter.case ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {letter.created_at ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                className="text-sm text-primary underline-offset-4 hover:underline"
                                                href={NotificationLetterController.show(
                                                    {
                                                        notification_letter:
                                                            letter.id,
                                                    },
                                                )}
                                            >
                                                View
                                            </Link>
                                            <span className="text-slate-300">
                                                |
                                            </span>
                                            <Form
                                                {...NotificationLetterController.duplicate.form(
                                                    {
                                                        notification_letter:
                                                            letter.id,
                                                    },
                                                )}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-primary hover:bg-primary/10"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Duplicate
                                                    </span>
                                                </Button>
                                            </Form>
                                            <span className="text-slate-300">
                                                |
                                            </span>
                                            <DeleteAction
                                                action={NotificationLetterController.destroy(
                                                    {
                                                        notification_letter:
                                                            letter.id,
                                                    },
                                                )}
                                                title="Delete Letter"
                                                description={`Are you sure you want to delete ${letter.title}?`}
                                                variant="icon"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {letters.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No notification letters yet.
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
