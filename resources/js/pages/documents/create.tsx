import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import type { BreadcrumbItem } from '@/types';

type Option = {
    id: number;
    name?: string;
    title?: string;
};

type DocumentableType = {
    label: string;
    value: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Documents',
        href: DocumentController.index(),
    },
    {
        title: 'Upload Document',
        href: DocumentController.create(),
    },
];

export default function DocumentCreate({
    documentableTypes,
    clients,
    cases,
    staff,
}: {
    documentableTypes: DocumentableType[];
    clients: Option[];
    cases: Option[];
    staff: Option[];
}) {
    const store = DocumentController.store();
    const [documentableType, setDocumentableType] = useState(
        documentableTypes[0]?.value ?? '',
    );
    const [documentableId, setDocumentableId] = useState('');

    const options =
        documentableType === documentableTypes[0]?.value
            ? clients
            : documentableType === documentableTypes[1]?.value
              ? cases
              : staff;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Document" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Upload Document</h1>
                    <Button asChild variant="outline">
                        <Link href={DocumentController.index()}>Back</Link>
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
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" required />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" name="category" />
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="documentable_type">
                                        Link type
                                    </Label>
                                    <select
                                        id="documentable_type"
                                        name="documentable_type"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                        value={documentableType}
                                        onChange={(event) => {
                                            setDocumentableType(
                                                event.target.value,
                                            );
                                            setDocumentableId('');
                                        }}
                                    >
                                        {documentableTypes.map((type) => (
                                            <option
                                                key={type.value}
                                                value={type.value}
                                            >
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.documentable_type} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="documentable_id">
                                        Link target
                                    </Label>
                                    <select
                                        id="documentable_id"
                                        name="documentable_id"
                                        className="h-9 rounded-md border bg-transparent px-3 text-sm"
                                        value={documentableId}
                                        onChange={(event) =>
                                            setDocumentableId(
                                                event.target.value,
                                            )
                                        }
                                    >
                                        <option value="">Select</option>
                                        {options.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name ?? item.title}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.documentable_id} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="file">File</Label>
                                <Input id="file" name="file" type="file" />
                                <InputError message={errors.file} />
                            </div>

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
