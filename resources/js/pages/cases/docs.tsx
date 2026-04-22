import { Head, Link, usePage } from '@inertiajs/react';
import CaseDocumentController from '@/actions/App/Http/Controllers/CaseDocumentController';
import CaseFileController from '@/actions/App/Http/Controllers/CaseFileController';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import DeleteAction from '@/components/delete-action';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type CaseFile = {
    id: number;
    title: string;
    status: string;
    client?: string | null;
    lead_lawyer?: string | null;
};

type CaseDocumentItem = {
    id: number;
    title: string;
    category?: string | null;
    file_name: string;
    uploader?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cases',
        href: CaseFileController.index(),
    },
    {
        title: 'Case Docs',
        href: '#',
    },
];

export default function CaseDocsShow({
    caseFile,
    documents,
}: {
    caseFile: CaseFile;
    documents: CaseDocumentItem[];
}) {
    const { auth } = usePage<{ auth: { user: { permissions: string[] } } }>()
        .props;
    const canDownload = auth.user.permissions.includes('documents.download');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Case Docs" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {caseFile.title}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {caseFile.status}
                            {' · '}
                            {caseFile.client ?? 'No client'}
                            {' · '}
                            {caseFile.lead_lawyer ?? 'Unassigned lawyer'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={CaseFileController.show({ case: caseFile.id })}>
                                Case Details
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link
                                href={CaseDocumentController.create({
                                    query: {
                                        case_id: caseFile.id,
                                        return_to_case: 1,
                                    },
                                })}
                            >
                                Upload Case Doc
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="inline-flex w-fit items-center rounded-lg border p-1">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={CaseFileController.show({ case: caseFile.id })}>
                            Case Details
                        </Link>
                    </Button>
                    <Button variant="secondary" size="sm">
                        Case Docs
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Uploaded By</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((document) => (
                                <tr key={document.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        <div>{document.title}</div>
                                        <div className="text-xs text-slate-500">
                                            {document.file_name}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {document.category || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {document.uploader || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <a
                                                className="text-sm text-primary underline-offset-4 hover:underline"
                                                href={DocumentController.view({
                                                    document: document.id,
                                                }).url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                View
                                            </a>
                                            {canDownload && (
                                                <>
                                                    <span className="text-slate-300">
                                                        |
                                                    </span>
                                                    <a
                                                        className="text-sm text-primary underline-offset-4 hover:underline"
                                                        href={DocumentController.download(
                                                            {
                                                                document:
                                                                    document.id,
                                                            },
                                                        ).url}
                                                    >
                                                        Download
                                                    </a>
                                                </>
                                            )}
                                            <span className="text-slate-300">
                                                |
                                            </span>
                                            <DeleteAction
                                                action={CaseDocumentController.destroy(
                                                    {
                                                        document: document.id,
                                                    },
                                                )}
                                                title="Delete Case Document"
                                                description={`Are you sure you want to delete ${document.title}?`}
                                                variant="icon"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {documents.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No case documents uploaded yet.
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
