import { Form, Head, Link, usePage } from '@inertiajs/react';
import CaseDocumentController from '@/actions/App/Http/Controllers/CaseDocumentController';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import DeleteAction from '@/components/delete-action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type CaseOption = {
    id: number;
    title: string;
};

type CaseDocumentItem = {
    id: number;
    title: string;
    category?: string | null;
    file_name: string;
    uploader?: string | null;
    case?: {
        id: number;
        title: string;
    } | null;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Case Docs',
        href: CaseDocumentController.index(),
    },
];

export default function CaseDocsIndex({
    documents,
    filters,
    cases,
}: {
    documents: Paginated<CaseDocumentItem>;
    filters: { search?: string | null; case_id?: number | null };
    cases: CaseOption[];
}) {
    const { auth } = usePage<{ auth: { user: { permissions: string[] } } }>()
        .props;
    const canDownload = auth.user.permissions.includes('documents.download');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Case Docs" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Case Docs</h1>
                        <p className="text-sm text-slate-500">
                            Manage case-specific legal documents by category.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={CaseDocumentController.create()}>
                            Upload Case Doc
                        </Link>
                    </Button>
                </div>

                <Form
                    action={CaseDocumentController.index().url}
                    method="get"
                    className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_260px_auto]"
                >
                    <Input
                        name="search"
                        placeholder="Search title, category, file, uploader"
                        defaultValue={filters.search ?? ''}
                    />
                    <select
                        name="case_id"
                        defaultValue={filters.case_id ? String(filters.case_id) : ''}
                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                    >
                        <option value="">All cases</option>
                        {cases.map((caseFile) => (
                            <option key={caseFile.id} value={caseFile.id}>
                                {caseFile.title}
                            </option>
                        ))}
                    </select>
                    <Button type="submit">Filter</Button>
                </Form>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Case</th>
                                <th className="px-4 py-3">Uploaded By</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.data.map((document) => (
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
                                        {document.case?.title || '—'}
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
                            {documents.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No case documents found.
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
