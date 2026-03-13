<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use App\Models\Conversation;
use App\Models\ConversationAttachment;
use App\Models\Message;
use App\Models\MessageAttachment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class MessageController extends Controller
{
    public function store(StoreMessageRequest $request, Conversation $conversation): RedirectResponse
    {
        Gate::authorize('permission', 'messages.create');

        $message = Message::query()->create([
            'conversation_id' => $conversation->id,
            'sender_id' => $request->user()->id,
            'content' => $request->validated()['content'],
        ]);

        $attachments = $request->validated()['attachments'] ?? [];

        if (count($attachments) > 0) {
            $rows = collect($attachments)->map(fn ($documentId): array => [
                'message_id' => $message->id,
                'document_id' => $documentId,
            ])->all();

            MessageAttachment::query()->insert($rows);
        }

        $files = $request->file('files') ?? [];

        foreach ($files as $file) {
            $path = $file->store('conversation_attachments', 'local');

            ConversationAttachment::query()->create([
                'message_id' => $message->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'mime_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
            ]);
        }

        return redirect()->route('messages.show', $conversation);
    }
}
