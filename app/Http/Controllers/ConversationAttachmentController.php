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
        Gate::authorize('permission', 'messages.view');

        return Storage::disk('local')->download($attachment->file_path, $attachment->file_name);
    }
}
