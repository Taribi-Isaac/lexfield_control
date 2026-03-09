<?php

namespace Tests\Feature;

use App\Models\CaseFile;
use App\Models\CauseListEntry;
use App\Models\Client;
use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $client = Client::factory()->create();
        Client::factory()->create();

        CaseFile::factory()->create([
            'client_id' => $client->id,
            'lead_lawyer_id' => $user->id,
            'status' => 'Open',
        ]);
        CaseFile::factory()->create([
            'client_id' => $client->id,
            'lead_lawyer_id' => $user->id,
            'status' => 'Closed',
        ]);

        Document::factory()->count(3)->create([
            'uploader_id' => $user->id,
        ]);

        CauseListEntry::factory()->create([
            'date' => now()->toDateString(),
            'assigned_lawyer_id' => $user->id,
            'created_by_id' => $user->id,
        ]);

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('metrics.totalClients', 2)
            ->where('metrics.activeCases', 1)
            ->where('metrics.staffCount', 1)
            ->where('metrics.documentsCount', 3)
            ->has('recentCases')
            ->has('recentDocuments')
            ->has('todayCauseList'));
    }
}
