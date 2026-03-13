<?php

namespace Tests\Feature;

use App\Models\NotificationLetter;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class NotificationLetterTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_create_notification_letter(): void
    {
        $user = $this->createUserWithPermissions(['notification-letters.create']);

        $response = $this->actingAs($user)->post(route('notification-letters.store'), [
            'title' => 'Test Notification',
            'body' => '<p>This is a test notification.</p>',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('generated_letters', 1);
    }

    public function test_staff_can_download_notification_letter(): void
    {
        $user = $this->createUserWithPermissions(['notification-letters.view']);
        $letter = NotificationLetter::factory()->create([
            'generated_by_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get(
            route('notification-letters.download', $letter)
        );

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_notification_letters_index_page_can_be_viewed(): void
    {
        $user = $this->createUserWithPermissions(['notification-letters.view']);
        NotificationLetter::factory()->count(2)->create([
            'generated_by_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get(route('notification-letters.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('notification-letters/index')
            ->has('letters.data', 2));
    }

    public function test_staff_can_duplicate_notification_letter(): void
    {
        $user = $this->createUserWithPermissions(['notification-letters.create', 'notification-letters.edit']);
        $letter = NotificationLetter::factory()->create([
            'title' => 'Original Title',
            'generated_by_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->post(route('notification-letters.duplicate', $letter));

        $response->assertRedirect();
        $this->assertDatabaseHas('generated_letters', [
            'title' => 'Original Title (Copy)',
        ]);
    }

    public function test_staff_can_delete_notification_letter(): void
    {
        $user = $this->createUserWithPermissions(['notification-letters.delete']);
        $letter = NotificationLetter::factory()->create([
            'generated_by_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->delete(route('notification-letters.destroy', $letter));

        $response->assertRedirect(route('notification-letters.index'));
        $this->assertDatabaseMissing('generated_letters', ['id' => $letter->id]);
    }

    private function createUserWithPermissions(array $permissionSlugs): User
    {
        $role = Role::factory()->create(['slug' => 'notification-letters-role']);

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
