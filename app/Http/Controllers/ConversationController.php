<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConversationRequest;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Document;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ConversationController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('permission', 'messages.view');

        $userId = $request->user()->id;

        $conversations = Conversation::query()
            ->whereHas('participants', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->with(['participants.user', 'messages' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->latest()
            ->get()
            ->map(function (Conversation $conversation): array {
                $lastMessage = $conversation->messages->first();

                return [
                    'id' => $conversation->id,
                    'title' => $conversation->title,
                    'type' => $conversation->type,
                    'participants' => $conversation->participants->map(fn ($participant): array => [
                        'id' => $participant->user_id,
                        'name' => $participant->user?->name,
                    ]),
                    'last_message' => $lastMessage?->content,
                    'last_sent_at' => $lastMessage?->created_at?->toDateTimeString(),
                ];
            });

        return Inertia::render('messages/index', [
            'conversations' => $conversations,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('permission', 'messages.create');

        return Inertia::render('messages/create', [
            'staff' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreConversationRequest $request): RedirectResponse
    {
        Gate::authorize('permission', 'messages.create');

        $data = $request->validated();
        $userId = $request->user()->id;

        $conversation = DB::transaction(function () use ($data, $userId) {
            $conversation = Conversation::query()->create([
                'title' => $data['type'] === 'group' ? $data['title'] : null,
                'type' => $data['type'],
                'created_by_id' => $userId,
            ]);

            $participants = array_unique(array_merge($data['participants'], [$userId]));

            $rows = collect($participants)->map(fn ($participantId): array => [
                'conversation_id' => $conversation->id,
                'user_id' => $participantId,
                'joined_at' => now(),
            ])->all();

            ConversationParticipant::query()->insert($rows);

            return $conversation;
        });

        return redirect()->route('messages.show', $conversation);
    }

    public function show(Conversation $message): Response
    {
        Gate::authorize('permission', 'messages.view');

        $message->load([
            'participants.user',
            'messages.sender',
            'messages.attachments.document',
            'messages.conversationAttachments',
        ]);

        return Inertia::render('messages/show', [
            'conversation' => [
                'id' => $message->id,
                'title' => $message->title,
                'type' => $message->type,
                'participants' => $message->participants->map(fn ($participant): array => [
                    'id' => $participant->user_id,
                    'name' => $participant->user?->name,
                ]),
                'messages' => $message->messages->map(fn (Message $entry): array => [
                    'id' => $entry->id,
                    'content' => $entry->content,
                    'sender' => $entry->sender?->name,
                    'sent_at' => $entry->created_at?->toDateTimeString(),
                    'attachments' => $entry->attachments->map(fn ($attachment): array => [
                        'id' => $attachment->document?->id,
                        'title' => $attachment->document?->title,
                    ]),
                    'conversation_attachments' => $entry->conversationAttachments->map(fn ($attachment): array => [
                        'id' => $attachment->id,
                        'file_name' => $attachment->file_name,
                    ]),
                ]),
            ],
            'documents' => Document::query()->latest()->limit(50)->get(['id', 'title']),
        ]);
    }
}
