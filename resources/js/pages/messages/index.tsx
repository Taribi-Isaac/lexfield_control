import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ConversationController from '@/actions/App/Http/Controllers/ConversationController';
import type { BreadcrumbItem } from '@/types';

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
                        <Link
                            key={conversation.id}
                            href={ConversationController.show({
                                message: conversation.id,
                            })}
                            className="rounded-lg border p-4 transition hover:border-blue-300"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        {conversation.title ??
                                            conversation.participants
                                                .map((participant) => participant.name)
                                                .filter(Boolean)
                                                .join(', ')}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {conversation.last_message ?? 'No messages yet.'}
                                    </p>
                                </div>
                                <span className="text-xs text-slate-400">
                                    {conversation.last_sent_at ?? ''}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
