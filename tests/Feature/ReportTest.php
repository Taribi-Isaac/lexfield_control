<?php

namespace Tests\Feature;

use App\Models\CaseFile;
use App\Models\Client;
use App\Models\Permission;
use App\Models\Report;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_with_permission_can_view_reports(): void
    {
        $user = $this->createUserWithPermissions(['reports.view']);

        $response = $this->actingAs($user)->get(route('reports.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('reports/index')
            ->has('reports'));
    }

    public function test_staff_with_permission_can_create_report(): void
    {
        $user = $this->createUserWithPermissions(['reports.create']);
        $client = Client::factory()->create();
        $caseFile = CaseFile::factory()->create([
            'client_id' => $client->id,
            'lead_lawyer_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->post(route('reports.store'), [
            'case_file_id' => $caseFile->id,
            'title' => 'Weekly Report',
            'content' => 'Weekly report content.',
            'status' => 'Draft',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('reports', [
            'title' => 'Weekly Report',
            'status' => 'Draft',
        ]);
    }

    public function test_staff_with_permission_can_review_report(): void
    {
        $user = $this->createUserWithPermissions(['reports.review']);
        $report = Report::factory()->create([
            'submitted_by_id' => $user->id,
            'status' => 'Submitted',
        ]);

        $response = $this->actingAs($user)->patch(route('reports.review', $report), [
            'status' => 'Reviewed',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('reports', [
            'id' => $report->id,
            'status' => 'Reviewed',
        ]);
    }

    public function test_staff_with_permission_can_view_report(): void
    {
        $user = $this->createUserWithPermissions(['reports.view']);
        $report = Report::factory()->create([
            'submitted_by_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get(route('reports.show', $report));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('reports/show')
            ->where('report.id', $report->id));
    }

    public function test_report_is_visible_to_shared_users(): void
    {
        $owner = $this->createUserWithPermissions(['reports.view']);
        $sharedUser = $this->createUserWithPermissions(['reports.view']);

        $report = Report::factory()->create([
            'submitted_by_id' => $owner->id,
        ]);
        $report->sharedWith()->sync([$sharedUser->id]);

        $response = $this->actingAs($sharedUser)->get(route('reports.show', $report));

        $response->assertOk();
    }

    public function test_report_is_not_visible_to_unshared_users(): void
    {
        $owner = $this->createUserWithPermissions(['reports.view']);
        $otherUser = $this->createUserWithPermissions(['reports.view']);

        $report = Report::factory()->create([
            'submitted_by_id' => $owner->id,
        ]);

        $response = $this->actingAs($otherUser)->get(route('reports.show', $report));

        $response->assertForbidden();
    }

    private function createUserWithPermissions(array $permissionSlugs): User
    {
        $role = Role::query()->firstOrCreate(
            ['slug' => 'reports-role'],
            ['name' => 'Reports Role']
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
