import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import cases from '@/routes/cases';
import causeList from '@/routes/cause-list';
import clients from '@/routes/clients';
import documents from '@/routes/documents';
import invoices from '@/routes/invoices';
import reports from '@/routes/reports';
import quotes from '@/routes/quotes';
import staff from '@/routes/staff';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

type Metrics = {
    totalClients: number;
    activeCases: number;
    staffCount: number;
    documentsCount: number;
    pendingReports: number;
    outstandingInvoices: number;
};

type RecentCase = {
    id: number;
    title: string;
    status: string;
    client?: string | null;
    leadLawyer?: string | null;
};

type RecentDocument = {
    id: number;
    title: string;
    category?: string | null;
    uploader?: string | null;
    createdAt?: string | null;
};

type CauseListItem = {
    id: number;
    date: string;
    time?: string | null;
    court: string;
    case_title: string;
    assigned_lawyer?: string | null;
    status: string;
};

export default function Dashboard({
    metrics,
    recentCases,
    recentDocuments,
    todayCauseList,
}: {
    metrics: Metrics;
    recentCases: RecentCase[];
    recentDocuments: RecentDocument[];
    todayCauseList: CauseListItem[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Lexfield Attorneys
                    </h1>
                    <p className="text-sm text-slate-600">
                        Firm-wide overview of operations and activity.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Clients</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold text-blue-700">
                            {metrics.totalClients}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Cases</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold text-blue-700">
                            {metrics.activeCases}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Staff Members</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold text-blue-700">
                            {metrics.staffCount}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold text-blue-700">
                            {metrics.documentsCount}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Reports</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold text-blue-700">
                            {metrics.pendingReports}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Outstanding Invoices</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold text-blue-700">
                            {metrics.outstandingInvoices}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Cases</CardTitle>
                            <Link
                                href={cases.index()}
                                className="text-sm text-blue-700 hover:underline"
                            >
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentCases.length === 0 && (
                                    <p className="text-sm text-slate-500">
                                        No cases recorded yet.
                                    </p>
                                )}
                                {recentCases.map((caseFile) => (
                                    <div
                                        key={caseFile.id}
                                        className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                                    >
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {caseFile.title}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {caseFile.client ?? 'No client'}
                                                {' · '}
                                                {caseFile.leadLawyer ??
                                                    'Unassigned'}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {caseFile.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Documents</CardTitle>
                            <Link
                                href={documents.index()}
                                className="text-sm text-blue-700 hover:underline"
                            >
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentDocuments.length === 0 && (
                                    <p className="text-sm text-slate-500">
                                        No documents uploaded yet.
                                    </p>
                                )}
                                {recentDocuments.map((document) => (
                                    <div
                                        key={document.id}
                                        className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                                    >
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {document.title}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {document.category ?? 'General'}
                                                {' · '}
                                                {document.uploader ??
                                                    'Unknown'}
                                            </p>
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {document.createdAt ?? ''}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Upcoming Cause List</CardTitle>
                            <Link
                                href={causeList.index()}
                                className="text-sm text-blue-700 hover:underline"
                            >
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {todayCauseList.length === 0 && (
                                    <p className="text-sm text-slate-500">
                                        No upcoming cause list entries.
                                    </p>
                                )}
                                {todayCauseList.map((entry) => {
                                    const entryDate = new Date(entry.date);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const isToday = entryDate.toDateString() === today.toDateString();
                                    const isTomorrow = entryDate.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
                                    
                                    const dateLabel = isToday 
                                        ? 'Today' 
                                        : isTomorrow 
                                        ? 'Tomorrow' 
                                        : entryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: entryDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
                                    
                                    return (
                                        <div
                                            key={entry.id}
                                            className="flex items-start justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900">
                                                    {entry.case_title}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    <span className="font-semibold text-slate-700">{dateLabel}</span>
                                                    {entry.time && ` · ${entry.time}`}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {entry.court}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {entry.assigned_lawyer ?? 'Unassigned'}
                                                </p>
                                            </div>
                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ml-2">
                                                {entry.status}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <Link
                                href={clients.create()}
                                className="block text-blue-700 hover:underline"
                            >
                                Add new client
                            </Link>
                            <Link
                                href={cases.create()}
                                className="block text-blue-700 hover:underline"
                            >
                                Open a case file
                            </Link>
                            <Link
                                href={documents.create()}
                                className="block text-blue-700 hover:underline"
                            >
                                Upload document
                            </Link>
                            <Link
                                href={causeList.create()}
                                className="block text-blue-700 hover:underline"
                            >
                                Add cause list entry
                            </Link>
                            <Link
                                href={reports.create()}
                                className="block text-blue-700 hover:underline"
                            >
                                Create report
                            </Link>
                            <Link
                                href={quotes.create()}
                                className="block text-blue-700 hover:underline"
                            >
                                Create quote
                            </Link>
                            <Link
                                href={invoices.create()}
                                className="block text-blue-700 hover:underline"
                            >
                                Create invoice
                            </Link>
                            <Link
                                href={staff.create()}
                                className="block text-blue-700 hover:underline"
                            >
                                Add staff profile
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
