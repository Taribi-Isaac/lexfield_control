import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import type { BreadcrumbItem } from '@/types';

type Document = {
    id: number;
    title: string;
    category?: string | null;
    file_name: string;
    file_size?: number | null;
    mime_type?: string | null;
    uploader?: string | null;
    created_at?: string | null;
    links: { type: string; id: number }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Documents',
        href: DocumentController.index(),
    },
    {
        title: 'Document details',
        href: '#',
    },
];

export default function DocumentShow({ document }: { document: Document }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Document Details" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">{document.title}</h1>
                        <p className="text-sm text-slate-500">
                            {document.category ?? 'General'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={DocumentController.index()}>Back</Link>
                        </Button>
                        <Button asChild>
                            <Link
                                href={DocumentController.download({
                                    document: document.id,
                                })}
                            >
                                Download
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">File Info</h2>
                        <p className="text-sm text-slate-600">
                            File name: {document.file_name}
                        </p>
                        <p className="text-sm text-slate-600">
                            Mime type: {document.mime_type ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            File size: {document.file_size ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Uploaded by: {document.uploader ?? '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                            Uploaded at: {document.created_at ?? '—'}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold">Linked Records</h2>
                        {document.links.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No linked records.
                            </p>
                        ) : (
                            <ul className="space-y-2 text-sm text-slate-700">
                                {document.links.map((link) => (
                                    <li key={`${link.type}-${link.id}`}>
                                        {link.type} #{link.id}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
