import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import CaseFileController from '@/actions/App/Http/Controllers/CaseFileController';
import type { BreadcrumbItem } from '@/types';

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
}: {
    caseFiles: Paginated<CaseItem>;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cases" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Cases</h1>
                    <Button asChild>
                        <Link href={CaseFileController.create()}>New Case</Link>
                    </Button>
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
                                        <Link
                                            className="text-sm text-primary underline-offset-4 hover:underline"
                                            href={CaseFileController.edit({
                                                case: caseFile.id,
                                            })}
                                        >
                                            Edit
                                        </Link>
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
