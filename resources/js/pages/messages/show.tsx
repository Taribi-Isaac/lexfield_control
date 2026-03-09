import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import ConversationController from '@/actions/App/Http/Controllers/ConversationController';
import MessageController from '@/actions/App/Http/Controllers/MessageController';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import type { BreadcrumbItem } from '@/types';

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
    const send = MessageController.store({ conversation: conversation.id });

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
                            {conversation.type === 'group' ? 'Group chat' : 'Direct chat'}
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={ConversationController.index()}>Back</Link>
                    </Button>
                </div>

                <div className="rounded-lg border p-4">
                    <div className="space-y-4">
                        {conversation.messages.length === 0 && (
                            <p className="text-sm text-slate-500">No messages yet.</p>
                        )}
                        {conversation.messages.map((message) => (
                            <div key={message.id} className="rounded-md border p-3">
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
                                {message.attachments.length > 0 && (
                                    <div className="mt-2 text-xs text-slate-500">
                                        Attachments:{' '}
                                        {message.attachments.map((attachment) => (
                                            <span key={attachment.id} className="mr-2">
                                                <a
                                                    href={DocumentController.download({
                                                        document: attachment.id,
                                                    }).url}
                                                    className="text-blue-700 hover:underline"
                                                >
                                                    {attachment.title}
                                                </a>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <h2 className="mb-2 font-semibold">Send message</h2>
                    <Form action={send.url} method={send.method} className="grid gap-4">
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
                                    <Label htmlFor="attachments">Attach documents</Label>
                                    <select
                                        id="attachments"
                                        name="attachments[]"
                                        multiple
                                        className="min-h-[120px] rounded-md border bg-transparent px-3 text-sm"
                                    >
                                        {documents.map((document) => (
                                            <option key={document.id} value={document.id}>
                                                {document.title}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.attachments} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button disabled={processing}>Send</Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
