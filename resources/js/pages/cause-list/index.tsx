import { Form, Head, Link } from '@inertiajs/react';
import CauseListController from '@/actions/App/Http/Controllers/CauseListController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import DeleteAction from '@/components/delete-action';

type CauseListEntry = {
    id: number;
    date: string;
    court: string;
    suit_number?: string | null;
    case_title: string;
    assigned_lawyer?: string | null;
    business_of_day?: string | null;
    time?: string | null;
    status: string;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cause List',
        href: CauseListController.index(),
    },
];

export default function CauseListIndex({
    entries,
    filters,
}: {
    entries: Paginated<CauseListEntry>;
    filters: { search?: string | null; date?: string | null };
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cause List" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Cause List</h1>
                        <p className="text-sm text-slate-500">
                            Filter by date, court, case title, or lawyer.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Form
                            action={CauseListController.index().url}
                            method="get"
                            className="flex flex-wrap items-center gap-2"
                        >
                            <Input
                                name="search"
                                placeholder="Search cause list"
                                defaultValue={filters.search ?? ''}
                            />
                            <Input
                                type="date"
                                name="date"
                                defaultValue={filters.date ?? ''}
                            />
                            <Button type="submit">Search</Button>
                        </Form>
                        <Button asChild>
                            <Link href={CauseListController.create()}>
                                New Entry
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Court</th>
                                <th className="px-4 py-3">Case</th>
                                <th className="px-4 py-3">Lawyer</th>
                                <th className="px-4 py-3">Time</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.data.map((entry) => (
                                <tr key={entry.id} className="border-t">
                                    <td className="px-4 py-3">{entry.date}</td>
                                    <td className="px-4 py-3">{entry.court}</td>
                                    <td className="px-4 py-3 font-medium">
                                        {entry.case_title}
                                    </td>
                                    <td className="px-4 py-3">
                                        {entry.assigned_lawyer ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {entry.time ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {entry.status}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                className="text-sm text-blue-700 hover:underline"
                                                href={CauseListController.show({
                                                    cause_list: entry.id,
                                                })}
                                            >
                                                View
                                            </Link>
                                            <span className="text-slate-300">
                                                |
                                            </span>
                                            <Link
                                                className="text-sm text-blue-700 hover:underline"
                                                href={CauseListController.edit({
                                                    cause_list: entry.id,
                                                })}
                                            >
                                                Edit
                                            </Link>
                                            <span className="text-slate-300">
                                                |
                                            </span>
                                            <DeleteAction
                                                action={CauseListController.destroy(
                                                    {
                                                        cause_list: entry.id,
                                                    },
                                                )}
                                                title="Delete Cause List Entry"
                                                description={`Are you sure you want to delete the entry for ${entry.case_title}?`}
                                                variant="icon"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {entries.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No cause list entries yet.
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
