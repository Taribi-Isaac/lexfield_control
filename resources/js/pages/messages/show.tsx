import { Form, Head, Link, usePage } from '@inertiajs/react';
import ConversationAttachmentController from '@/actions/App/Http/Controllers/ConversationAttachmentController';
import ConversationController from '@/actions/App/Http/Controllers/ConversationController';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import MessageController from '@/actions/App/Http/Controllers/MessageController';
import DeleteAction from '@/components/delete-action';
import DocumentPreviewTrigger from '@/components/document-preview-trigger';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { type ChangeEvent, useState } from 'react';

type Document = {
    id: number;
    title: string;
};

type Message = {
    id: number;
    content: string;
    sender?: string | null;
    sent_at?: string | null;
    attachments: { id: number; title?: string | null }[];
    conversation_attachments: {
        id: number;
        file_name: string;
        mime_type?: string | null;
    }[];
};

type Conversation = {
    id: number;
    title?: string | null;
    type: string;
    participants: { id: number; name?: string | null }[];
    messages: Message[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Messages',
        href: ConversationController.index(),
    },
    {
        title: 'Conversation',
        href: '#',
    },
];

export default function MessagesShow({
    conversation,
    documents,
}: {
    conversation: Conversation;
    documents: Document[];
}) {
    const { auth } = usePage<{ auth: { user: { permissions: string[] } } }>().props;
    const canDownloadMessages = auth.user.permissions.includes('messages.download');
    const canDownloadDocuments = auth.user.permissions.includes('documents.download');
    const canViewDocuments = auth.user.permissions.includes('documents.view');
    const [fileValidationError, setFileValidationError] = useState<string | null>(null);
    const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

    const send = MessageController.store({ conversation: conversation.id });
    const maxFileSizeBytes = 10 * 1024 * 1024;

    const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);

        if (files.length === 0) {
            setFileValidationError(null);
            setSelectedFileNames([]);

            return;
        }

        const oversizedFiles = files.filter((file) => file.size > maxFileSizeBytes);

        if (oversizedFiles.length > 0) {
            const names = oversizedFiles.map((file) => file.name).join(', ');
            setFileValidationError(
                `File upload limit is 10MB. Please remove oversized file(s): ${names}.`,
            );
            setSelectedFileNames([]);
            event.target.value = '';

            return;
        }

        setFileValidationError(null);
        setSelectedFileNames(files.map((file) => file.name));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Conversation" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {conversation.title ??
                                conversation.participants
                                    .map((participant) => participant.name)
                                    .filter(Boolean)
                                    .join(', ')}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {conversation.type === 'group'
                                ? 'Group chat'
                                : 'Direct chat'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={ConversationController.index()}>
                                Back
                            </Link>
                        </Button>
                        <DeleteAction
                            action={ConversationController.destroy({
                                message: conversation.id,
                            })}
                            title="Delete Conversation"
                            description="Are you sure you want to delete this conversation? This will delete all messages within it."
                        />
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <div className="space-y-4">
                        {conversation.messages.length === 0 && (
                            <p className="text-sm text-slate-500">
                                No messages yet.
                            </p>
                        )}
                        {conversation.messages.map((message) => (
                            <div
                                key={message.id}
                                className="rounded-md border p-3"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-slate-900">
                                        {message.sender ?? 'Unknown'}
                                    </p>
                                    <span className="text-xs text-slate-400">
                                        {message.sent_at ?? ''}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-slate-700">
                                    {message.content}
                                </p>
                                {(message.attachments.length > 0 ||
                                    message.conversation_attachments.length >
                                        0) && (
                                    <div className="mt-2 text-xs text-slate-500">
                                        Attachments:{' '}
                                        {message.attachments.map(
                                            (attachment) => (
                                                <span
                                                    key={attachment.id}
                                                    className="mr-2"
                                                >
                                                    <DocumentPreviewTrigger
                                                        title={
                                                            attachment.title ??
                                                            'Document'
                                                        }
                                                        viewUrl={DocumentController.view({
                                                            document: attachment.id,
                                                        }).url}
                                                        downloadUrl={DocumentController.download({
                                                            document: attachment.id,
                                                        }).url}
                                                        canView={canViewDocuments}
                                                        canDownload={canDownloadDocuments}
                                                        onDenied={() => {
                                                            alert(
                                                                'You do not have permission to view this document.',
                                                            );
                                                        }}
                                                        className="text-blue-700"
                                                    >
                                                        {attachment.title}
                                                    </DocumentPreviewTrigger>
                                                </span>
                                            ),
                                        )}
                                        {message.conversation_attachments.map(
                                            (attachment) => (
                                                <span
                                                    key={attachment.id}
                                                    className="mr-2"
                                                >
                                                    <DocumentPreviewTrigger
                                                        title={attachment.file_name}
                                                        fileName={attachment.file_name}
                                                        mimeType={attachment.mime_type}
                                                        viewUrl={ConversationAttachmentController.view({
                                                            attachment: attachment.id,
                                                        }).url}
                                                        downloadUrl={ConversationAttachmentController.download({
                                                            attachment: attachment.id,
                                                        }).url}
                                                        canView={canDownloadMessages}
                                                        canDownload={canDownloadMessages}
                                                        onDenied={() => {
                                                            alert(
                                                                'You do not have permission to view this attachment.',
                                                            );
                                                        }}
                                                        className="text-blue-700"
                                                    >
                                                        {attachment.file_name}
                                                    </DocumentPreviewTrigger>
                                                </span>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <h2 className="mb-2 font-semibold">Send message</h2>
                    <Form
                        action={send.url}
                        method={send.method}
                        encType="multipart/form-data"
                        className="grid gap-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="content">Message</Label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        className="min-h-[120px] rounded-md border bg-transparent px-3 py-2 text-sm"
                                    />
                                    <InputError message={errors.content} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="attachments">
                                        Attach documents (existing)
                                    </Label>
                                    <select
                                        id="attachments"
                                        name="attachments[]"
                                        multiple
                                        className="min-h-[120px] rounded-md border bg-transparent px-3 text-sm"
                                    >
                                        {documents.map((document) => (
                                            <option
                                                key={document.id}
                                                value={document.id}
                                            >
                                                {document.title}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.attachments} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="files">
                                        Attach files (from device)
                                    </Label>
                                    <Input
                                        id="files"
                                        name="files[]"
                                        type="file"
                                        multiple
                                        onChange={handleFilesChange}
                                    />
                                    {fileValidationError && (
                                        <p className="text-sm text-red-600">
                                            {fileValidationError}
                                        </p>
                                    )}
                                    <InputError message={errors.files} />
                                    {selectedFileNames.length > 0 && (
                                        <p className="text-xs text-slate-500">
                                            Selected: {selectedFileNames.join(', ')}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button disabled={processing || !!fileValidationError}>
                                        Send
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
