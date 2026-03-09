<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ActivityLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_activity_log_is_created_for_write_actions(): void
    {
        $user = $this->createUserWithPermissions(['clients.create']);

        $response = $this->actingAs($user)->post(route('clients.store'), [
            'name' => 'Audit Client',
            'client_type' => 'Individual',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('activity_logs', 1);

        $log = ActivityLog::query()->first();
        $this->assertEquals($user->id, $log->user_id);
        $this->assertEquals('POST', $log->action);
        $this->assertEquals('clients.store', $log->route);
    }

    public function test_activity_logs_index_can_be_viewed(): void
    {
        $user = $this->createUserWithPermissions(['activity-logs.view']);
        ActivityLog::factory()->count(2)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get(route('activity-logs.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('activity/index')
            ->has('logs.data', 2));
    }

    private function createUserWithPermissions(array $permissionSlugs): User
    {
        $role = Role::factory()->create(['slug' => 'audit-role']);

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
