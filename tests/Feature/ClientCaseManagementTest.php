<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientCaseManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_with_permissions_can_create_client(): void
    {
        $user = $this->createUserWithPermissions(['clients.create']);

        $response = $this->actingAs($user)->post(route('clients.store'), [
            'name' => 'Lexfield Client',
            'client_type' => 'Individual',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('clients', [
            'name' => 'Lexfield Client',
            'client_type' => 'Individual',
        ]);
    }

    public function test_staff_with_permissions_can_create_case(): void
    {
        $user = $this->createUserWithPermissions(['cases.create']);
        $client = Client::factory()->create();

        $response = $this->actingAs($user)->post(route('cases.store'), [
            'client_id' => $client->id,
            'title' => 'Sample Case',
            'status' => 'Open',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('case_files', [
            'client_id' => $client->id,
            'title' => 'Sample Case',
            'status' => 'Open',
        ]);
    }

    private function createUserWithPermissions(array $permissionSlugs): User
    {
        $role = Role::factory()->create(['slug' => 'custom-role']);

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
