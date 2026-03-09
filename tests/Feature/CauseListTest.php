<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CauseListTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_with_permission_can_view_cause_list(): void
    {
        $user = $this->createUserWithPermissions(['cause-list.view']);

        $response = $this->actingAs($user)->get(route('cause-list.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('cause-list/index')
            ->has('entries'));
    }

    public function test_staff_with_permission_can_create_cause_list_entry(): void
    {
        $user = $this->createUserWithPermissions(['cause-list.create']);

        $response = $this->actingAs($user)->post(route('cause-list.store'), [
            'date' => now()->toDateString(),
            'court' => 'High Court',
            'case_title' => 'Lexfield Matter',
            'status' => 'Scheduled',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('cause_list_entries', [
            'court' => 'High Court',
            'case_title' => 'Lexfield Matter',
            'status' => 'Scheduled',
        ]);
    }

    public function test_staff_with_permission_can_view_cause_list_entry(): void
    {
        $user = $this->createUserWithPermissions(['cause-list.view']);

        $entry = \App\Models\CauseListEntry::factory()->create([
            'created_by_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get(route('cause-list.show', $entry));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('cause-list/show')
            ->where('entry.id', $entry->id));
    }

    private function createUserWithPermissions(array $permissionSlugs): User
    {
        $role = Role::factory()->create(['slug' => 'cause-list-role']);

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
