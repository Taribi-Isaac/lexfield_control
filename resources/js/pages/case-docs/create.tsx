import { Form, Head, Link } from '@inertiajs/react';
import CaseDocumentController from '@/actions/App/Http/Controllers/CaseDocumentController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type CaseOption = {
    id: number;
    title: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Case Docs',
        href: CaseDocumentController.index(),
    },
    {
        title: 'Upload Case Doc',
        href: CaseDocumentController.create(),
    },
];

export default function CaseDocsCreate({
    cases,
    categories,
    selectedCaseId,
    returnToCase,
}: {
    cases: CaseOption[];
    categories: string[];
    selectedCaseId?: number | null;
    returnToCase: boolean;
}) {
    const store = CaseDocumentController.store();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Case Doc" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Upload Case Doc</h1>
                    <Button asChild variant="outline">
                        <Link href={CaseDocumentController.index()}>Back</Link>
                    </Button>
                </div>

                <Form
                    action={store.url}
                    method={store.method}
                    encType="multipart/form-data"
                    className="grid gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="title">Document title</Label>
                                <Input id="title" name="title" required />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="case_id">Case</Label>
                                    <select
                                        id="case_id"
                                        name="case_id"
                                        defaultValue={
                                            selectedCaseId
                                                ? String(selectedCaseId)
                                                : ''
                                        }
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                        required
                                    >
                                        <option value="">Select case</option>
                                        {cases.map((caseFile) => (
                                            <option
                                                key={caseFile.id}
                                                value={caseFile.id}
                                            >
                                                {caseFile.title}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.case_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="file">File</Label>
                                <Input id="file" name="file" type="file" />
                                <p className="text-xs text-slate-500">
                                    Allowed formats: docx, pdf, png, jpeg, mp3,
                                    mp4, txt, csv, xls, xlsx and related legal
                                    document formats.
                                </p>
                                <InputError message={errors.file} />
                            </div>

                            <input
                                type="hidden"
                                name="return_to_case"
                                value={returnToCase ? '1' : '0'}
                            />

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Upload</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
