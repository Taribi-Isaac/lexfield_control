<?php

namespace App\Http\Controllers;

use App\Models\ConversationAttachment;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ConversationAttachmentController extends Controller
{
    public function download(ConversationAttachment $attachment): StreamedResponse
    {
        Gate::authorize('permission', 'messages.download');

        return Storage::disk('local')->download($attachment->file_path, $attachment->file_name);
    }

    public function view(ConversationAttachment $attachment): \Symfony\Component\HttpFoundation\Response
    {
        Gate::authorize('permission', 'messages.download');

        return Storage::disk('local')->response(
            $attachment->file_path,
            $attachment->file_name,
            ['Content-Type' => $attachment->mime_type ?? 'application/octet-stream'],
        );
    }
}
