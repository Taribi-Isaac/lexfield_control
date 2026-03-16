<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\ConversationAttachment;
use App\Models\Message;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ConversationAttachmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_attach_files_to_message()
    {
        Storage::fake('local');

        $user = $this->createUserWithPermissions(['messages.view', 'messages.create']);
        $conversation = Conversation::factory()->create();
        $conversation->participants()->create(['user_id' => $user->id]);

        $file1 = UploadedFile::fake()->create('document1.pdf', 100);
        $file2 = UploadedFile::fake()->image('image1.jpg');

        $response = $this->actingAs($user)->from(route('messages.show', $conversation))->post(route('messages.send', $conversation), [
            'content' => 'Hello with attachments',
            'files' => [$file1, $file2],
        ]);

        if ($response->isInvalid() || $response->isClientError() || $response->isServerError()) {
            if ($response->isRedirect() && session('errors')) {
                $this->fail('Validation errors: '.json_encode(session('errors')->getMessages()));
            }
            $this->fail('Request failed with status '.$response->status().': '.$response->getContent());
        }

        $response->assertRedirect(route('messages.show', $conversation));

        $this->assertDatabaseCount('messages', 1);
        $message = Message::latest()->first();
        $this->assertNotNull($message, 'Message was not created');
        $this->assertEquals('Hello with attachments', $message->content);
        $this->assertCount(2, $message->conversationAttachments);

        Storage::disk('local')->assertExists($message->conversationAttachments[0]->file_path);
        Storage::disk('local')->assertExists($message->conversationAttachments[1]->file_path);
    }

    public function test_can_download_conversation_attachment()
    {
        Storage::fake('local');

        $user = $this->createUserWithPermissions(['messages.view']);

        $conversation = Conversation::factory()->create();
        $message = Message::factory()->create(['conversation_id' => $conversation->id]);

        $attachment = ConversationAttachment::create([
            'message_id' => $message->id,
            'file_path' => 'attachments/test.pdf',
            'file_name' => 'test.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 100,
        ]);
        Storage::disk('local')->put('attachments/test.pdf', 'content');

        $response = $this->actingAs($user)->get(route('conversation-attachments.download', $attachment));

        $response->assertOk();
        $response->assertHeader('Content-Disposition', 'attachment; filename=test.pdf');
    }

    private function createUserWithPermissions(array $permissionSlugs): User
    {
        $role = Role::factory()->create(['slug' => 'test-role']);

        foreach ($permissionSlugs as $slug) {
            $permission = Permission::factory()->create([
                'slug' => $slug,
                'name' => ucfirst(str_replace('.', ' ', $slug)),
            ]);
            $role->permissions()->syncWithoutDetaching([$permission->id]);
        }

        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);
        $user->roles()->syncWithoutDetaching([$role->id]);

        return $user;
    }
}
