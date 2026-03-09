<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RolePermissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_roles_index_is_accessible(): void
    {
        $user = $this->createUserWithPermissions(['roles.view']);

        $response = $this->actingAs($user)->get(route('roles.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('roles/index')
            ->has('roles'));
    }

    public function test_role_permissions_can_be_updated(): void
    {
        $user = $this->createUserWithPermissions(['roles.edit']);
        $role = Role::factory()->create();
        $permission = Permission::factory()->create([
            'slug' => 'clients.view',
        ]);

        $response = $this->actingAs($user)->put(route('roles.update', $role), [
            'permissions' => [$permission->id],
        ]);

        $response->assertRedirect();
        $this->assertTrue($role->permissions()->whereKey($permission->id)->exists());
    }

    private function createUserWithPermissions(array $permissionSlugs): User
    {
        $role = Role::query()->firstOrCreate(
            ['slug' => 'roles-admin'],
            ['name' => 'Roles Admin']
        );

        foreach ($permissionSlugs as $slug) {
            $permission = Permission::query()->firstOrCreate(
                ['slug' => $slug],
                ['name' => ucfirst(str_replace('.', ' ', $slug))]
            );
            $role->permissions()->syncWithoutDetaching([$permission->id]);
        }

        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);
        $user->roles()->syncWithoutDetaching([$role->id]);

        return $user;
    }
}
