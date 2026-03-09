<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Message;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_messages_index(): void
    {
        $user = $this->createUserWithPermissions(['messages.view']);
        $conversation = Conversation::factory()->create([
            'created_by_id' => $user->id,
        ]);
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get(route('messages.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('messages/index')
            ->has('conversations', 1));
    }

    public function test_user_can_create_conversation(): void
    {
        $user = $this->createUserWithPermissions(['messages.create']);
        $participant = User::factory()->create();

        $response = $this->actingAs($user)->post(route('messages.store'), [
            'type' => 'direct',
            'participants' => [$participant->id],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('conversations', 1);
        $this->assertDatabaseCount('conversation_participants', 2);
    }

    public function test_user_can_send_message(): void
    {
        $user = $this->createUserWithPermissions(['messages.create', 'messages.view']);
        $conversation = Conversation::factory()->create([
            'created_by_id' => $user->id,
        ]);

        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->post(route('messages.send', $conversation), [
            'content' => 'Hello there',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('messages', 1);

        $message = Message::query()->firstOrFail();
        $this->assertEquals('Hello there', $message->content);
    }

    private function createUserWithPermissions(array $permissionSlugs): User
    {
        $role = Role::factory()->create(['slug' => 'messages-role']);

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
