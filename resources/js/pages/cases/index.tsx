import { Form, Head, Link } from '@inertiajs/react';
import CaseFileController from '@/actions/App/Http/Controllers/CaseFileController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import DeleteAction from '@/components/delete-action';

type CaseItem = {
    id: number;
    title: string;
    suit_number?: string | null;
    court?: string | null;
    status: string;
    client?: string | null;
    lead_lawyer?: string | null;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cases',
        href: CaseFileController.index(),
    },
];

export default function CasesIndex({
    caseFiles,
    filters,
}: {
    caseFiles: Paginated<CaseItem>;
    filters: { search?: string | null };
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cases" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Cases</h1>
                        <p className="text-sm text-slate-500">
                            Search by title, suit number, court, or client.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Form
                            action={CaseFileController.index().url}
                            method="get"
                            className="flex items-center gap-2"
                        >
                            <Input
                                name="search"
                                placeholder="Search cases"
                                defaultValue={filters.search ?? ''}
                            />
                            <Button type="submit">Search</Button>
                        </Form>
                        <Button asChild>
                            <Link href={CaseFileController.create()}>
                                New Case
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Suit No.</th>
                                <th className="px-4 py-3">Court</th>
                                <th className="px-4 py-3">Client</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {caseFiles.data.map((caseFile) => (
                                <tr key={caseFile.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        {caseFile.title}
                                    </td>
                                    <td className="px-4 py-3">
                                        {caseFile.suit_number || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {caseFile.court || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {caseFile.client || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {caseFile.status}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                className="text-sm text-primary underline-offset-4 hover:underline"
                                                href={CaseFileController.show({
                                                    case: caseFile.id,
                                                })}
                                            >
                                                View
                                            </Link>
                                            <span className="text-slate-300">
                                                |
                                            </span>
                                            <Link
                                                className="text-sm text-primary underline-offset-4 hover:underline"
                                                href={CaseFileController.edit({
                                                    case: caseFile.id,
                                                })}
                                            >
                                                Edit
                                            </Link>
                                            <span className="text-slate-300">
                                                |
                                            </span>
                                            <DeleteAction
                                                action={CaseFileController.destroy(
                                                    {
                                                        case: caseFile.id,
                                                    },
                                                )}
                                                title="Delete Case"
                                                description={`Are you sure you want to delete ${caseFile.title}?`}
                                                variant="icon"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {caseFiles.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No cases yet.
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
