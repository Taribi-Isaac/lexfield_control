<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use App\Models\Conversation;
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

        return redirect()->route('messages.show', $conversation);
    }
}
