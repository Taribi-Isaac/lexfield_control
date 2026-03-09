<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
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

    public function test_staff_can_search_clients(): void
    {
        $user = $this->createUserWithPermissions(['clients.view']);

        Client::factory()->create(['name' => 'Alpha Client']);
        Client::factory()->create(['name' => 'Beta Client']);

        $response = $this->actingAs($user)->get(route('clients.index', [
            'search' => 'Alpha',
        ]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('clients/index')
            ->has('clients.data', 1));
    }

    public function test_staff_can_view_client(): void
    {
        $user = $this->createUserWithPermissions(['clients.view']);
        $client = Client::factory()->create();

        $response = $this->actingAs($user)->get(route('clients.show', $client));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('clients/show')
            ->where('client.id', $client->id));
    }

    public function test_staff_can_view_case(): void
    {
        $user = $this->createUserWithPermissions(['cases.view']);
        $client = Client::factory()->create();

        $caseFile = \App\Models\CaseFile::factory()->create([
            'client_id' => $client->id,
            'lead_lawyer_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get(route('cases.show', $caseFile));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('cases/show')
            ->where('caseFile.id', $caseFile->id));
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
