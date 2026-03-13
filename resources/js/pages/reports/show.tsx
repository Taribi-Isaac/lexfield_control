import { Head, Link } from '@inertiajs/react';
import ReportController from '@/actions/App/Http/Controllers/ReportController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Report = {
    id: number;
    title: string;
    content?: string | null;
    status: string;
    case?: string | null;
    submitted_by?: string | null;
    shared_with: string[];
    reviewed_by?: string | null;
    submitted_at?: string | null;
    reviewed_at?: string | null;
    attachments: { id: number; title: string }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: ReportController.index(),
    },
    {
        title: 'Report details',
        href: '#',
    },
];

export default function ReportShow({ report }: { report: Report }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report Details" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {report.title}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {report.status}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={ReportController.index()}>Back</Link>
                        </Button>
                        <Button asChild>
                            <Link
                                href={ReportController.edit({
                                    report: report.id,
                                })}
                            >
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Report Info</h2>
                        <p className="text-sm text-slate-600">
                            Case: {report.case ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Submitted by: {report.submitted_by ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Shared with:{' '}
                            {report.shared_with.length > 0
                                ? report.shared_with.join(', ')
                                : '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Submitted at: {report.submitted_at ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Reviewed by: {report.reviewed_by ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Reviewed at: {report.reviewed_at ?? '—'}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Attachments</h2>
                        {report.attachments.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No attachments.
                            </p>
                        ) : (
                            <ul className="space-y-2 text-sm text-slate-700">
                                {report.attachments.map((attachment) => (
                                    <li key={attachment.id}>
                                        {attachment.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <h2 className="mb-2 font-semibold">Content</h2>
                    <div className="text-sm whitespace-pre-wrap text-slate-600">
                        {report.content ?? '—'}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
