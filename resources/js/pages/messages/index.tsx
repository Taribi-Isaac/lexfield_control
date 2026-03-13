import { Head, Link } from '@inertiajs/react';
import ConversationController from '@/actions/App/Http/Controllers/ConversationController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import DeleteAction from '@/components/delete-action';

type Conversation = {
    id: number;
    title?: string | null;
    type: string;
    participants: { id: number; name?: string | null }[];
    last_message?: string | null;
    last_sent_at?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Messages',
        href: ConversationController.index(),
    },
];

export default function MessagesIndex({
    conversations,
}: {
    conversations: Conversation[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Messages" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Messages</h1>
                        <p className="text-sm text-slate-500">
                            Start a new chat or continue a conversation.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={ConversationController.create()}>
                            New Conversation
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4">
                    {conversations.length === 0 && (
                        <div className="rounded-lg border p-6 text-center text-sm text-slate-500">
                            No conversations yet.
                        </div>
                    )}
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className="group flex items-center justify-between rounded-lg border p-4 transition hover:border-blue-300"
                        >
                            <Link
                                href={ConversationController.show({
                                    message: conversation.id,
                                })}
                                className="flex-1"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {conversation.title ??
                                                conversation.participants
                                                    .map(
                                                        (participant) =>
                                                            participant.name,
                                                    )
                                                    .filter(Boolean)
                                                    .join(', ')}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {conversation.last_message ??
                                                'No messages yet.'}
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        {conversation.last_sent_at ?? ''}
                                    </span>
                                </div>
                            </Link>
                            <div className="ml-4 opacity-0 transition group-hover:opacity-100">
                                <DeleteAction
                                    action={ConversationController.destroy({
                                        message: conversation.id,
                                    })}
                                    title="Delete Conversation"
                                    description="Are you sure you want to delete this conversation? This will delete all messages within it."
                                    variant="icon"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
