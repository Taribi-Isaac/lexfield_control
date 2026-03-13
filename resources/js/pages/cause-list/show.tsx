import { Head, Link } from '@inertiajs/react';
import CauseListController from '@/actions/App/Http/Controllers/CauseListController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

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
    notes?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cause List',
        href: CauseListController.index(),
    },
    {
        title: 'Entry details',
        href: '#',
    },
];

export default function CauseListShow({ entry }: { entry: CauseListEntry }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cause List Entry" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {entry.case_title}
                        </h1>
                        <p className="text-sm text-slate-500">{entry.status}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={CauseListController.index()}>Back</Link>
                        </Button>
                        <Button asChild>
                            <Link
                                href={CauseListController.edit({
                                    cause_list: entry.id,
                                })}
                            >
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Schedule</h2>
                        <p className="text-sm text-slate-600">
                            Date: {entry.date}
                        </p>
                        <p className="text-sm text-slate-600">
                            Time: {entry.time ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Court: {entry.court}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Case Details</h2>
                        <p className="text-sm text-slate-600">
                            Suit No: {entry.suit_number ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Assigned lawyer: {entry.assigned_lawyer ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Business of the day: {entry.business_of_day ?? '—'}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <h2 className="mb-2 font-semibold">Notes</h2>
                    <p className="text-sm text-slate-600">
                        {entry.notes ?? '—'}
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
