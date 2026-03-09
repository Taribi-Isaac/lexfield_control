import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import ReportController from '@/actions/App/Http/Controllers/ReportController';
import type { BreadcrumbItem } from '@/types';

type ReportItem = {
    id: number;
    title: string;
    status: string;
    case?: string | null;
    submitted_by?: string | null;
    shared_with: string[];
    submitted_at?: string | null;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: ReportController.index(),
    },
];

export default function ReportsIndex({
    reports,
    filters,
}: {
    reports: Paginated<ReportItem>;
    filters: { search?: string | null };
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Reports</h1>
                        <p className="text-sm text-slate-500">
                            Search by title, status, case, or staff.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Form
                            action={ReportController.index().url}
                            method="get"
                            className="flex items-center gap-2"
                        >
                            <Input
                                name="search"
                                placeholder="Search reports"
                                defaultValue={filters.search ?? ''}
                            />
                            <Button type="submit">Search</Button>
                        </Form>
                        <Button asChild>
                            <Link href={ReportController.create()}>New Report</Link>
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Case</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Submitted By</th>
                                <th className="px-4 py-3">Shared With</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.data.map((report) => (
                                <tr key={report.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        {report.title}
                                    </td>
                                    <td className="px-4 py-3">
                                        {report.case ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {report.status}
                                    </td>
                                    <td className="px-4 py-3">
                                        {report.submitted_by ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {report.shared_with.length > 0
                                            ? report.shared_with.join(', ')
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {report.submitted_at ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link
                                            className="text-sm text-blue-700 hover:underline"
                                            href={ReportController.show({
                                                report: report.id,
                                            })}
                                        >
                                            View
                                        </Link>
                                        <span className="px-2 text-slate-300">|</span>
                                        <Link
                                            className="text-sm text-blue-700 hover:underline"
                                            href={ReportController.edit({
                                                report: report.id,
                                            })}
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {reports.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No reports yet.
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
