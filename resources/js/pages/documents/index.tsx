import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import type { BreadcrumbItem } from '@/types';

type DocumentItem = {
    id: number;
    title: string;
    category?: string | null;
    file_name: string;
    uploader?: string | null;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Documents',
        href: DocumentController.index(),
    },
];

export default function DocumentsIndex({
    documents,
    filters,
}: {
    documents: Paginated<DocumentItem>;
    filters: { search?: string | null };
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documents" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Documents</h1>
                        <p className="text-sm text-slate-500">
                            Search by title, category, or uploader.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Form
                            action={DocumentController.index().url}
                            method="get"
                            className="flex items-center gap-2"
                        >
                            <Input
                                name="search"
                                placeholder="Search documents"
                                defaultValue={filters.search ?? ''}
                            />
                            <Button type="submit">Search</Button>
                        </Form>
                        <Button asChild>
                            <Link href={DocumentController.create()}>
                                Upload Document
                            </Link>
                        </Button>
                    </div>
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
                            {documents.data.map((document) => (
                                <tr key={document.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        {document.title}
                                    </td>
                                    <td className="px-4 py-3">
                                        {document.category || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {document.uploader || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link
                                            className="text-sm text-primary underline-offset-4 hover:underline"
                                            href={DocumentController.show({
                                                document: document.id,
                                            })}
                                        >
                                            View
                                        </Link>
                                        <span className="px-2 text-slate-300">|</span>
                                        <Link
                                            className="text-sm text-primary underline-offset-4 hover:underline"
                                            href={DocumentController.download({
                                                document: document.id,
                                            })}
                                        >
                                            Download
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {documents.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No documents yet.
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
