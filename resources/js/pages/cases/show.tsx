import { Head, Link } from '@inertiajs/react';
import CaseFileController from '@/actions/App/Http/Controllers/CaseFileController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type CaseFile = {
    id: number;
    title: string;
    suit_number?: string | null;
    court?: string | null;
    filing_date?: string | null;
    opposing_party?: string | null;
    opposing_counsel?: string | null;
    status: string;
    summary?: string | null;
    client?: string | null;
    lead_lawyer?: string | null;
    assignees: { id: number; name?: string | null; role: string }[];
    documents: { id: number; title: string }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cases',
        href: CaseFileController.index(),
    },
    {
        title: 'Case details',
        href: '#',
    },
];

export default function CaseShow({ caseFile }: { caseFile: CaseFile }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Case Details" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {caseFile.title}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {caseFile.status}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={CaseFileController.index()}>Back</Link>
                        </Button>
                        <Button asChild>
                            <Link
                                href={CaseFileController.edit({
                                    case: caseFile.id,
                                })}
                            >
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Case Info</h2>
                        <p className="text-sm text-slate-600">
                            Suit No: {caseFile.suit_number ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Court: {caseFile.court ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Filing date: {caseFile.filing_date ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Client: {caseFile.client ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Lead lawyer: {caseFile.lead_lawyer ?? '—'}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Opposing Party</h2>
                        <p className="text-sm text-slate-600">
                            Opposing party: {caseFile.opposing_party ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Opposing counsel: {caseFile.opposing_counsel ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Summary: {caseFile.summary ?? '—'}
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Assigned Staff</h2>
                        {caseFile.assignees.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No assignees.
                            </p>
                        ) : (
                            <ul className="space-y-2 text-sm text-slate-700">
                                {caseFile.assignees.map((assignee) => (
                                    <li key={`${assignee.id}-${assignee.role}`}>
                                        {assignee.name ?? 'Unknown'} ·{' '}
                                        {assignee.role}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Documents</h2>
                        {caseFile.documents.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No documents linked.
                            </p>
                        ) : (
                            <ul className="space-y-2 text-sm text-slate-700">
                                {caseFile.documents.map((document) => (
                                    <li key={document.id}>{document.title}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
