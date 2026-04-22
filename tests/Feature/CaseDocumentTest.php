<?php

namespace Tests\Feature;

use App\Models\CaseFile;
use App\Models\Client;
use App\Models\Document;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CaseDocumentTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_upload_case_document_with_allowed_format(): void
    {
        Storage::fake('local');
        $user = $this->createUserWithPermissions(['documents.create']);
        $client = Client::factory()->create();
        $caseFile = CaseFile::factory()->create(['client_id' => $client->id]);

        $response = $this->actingAs($user)->post(route('case-docs.store'), [
            'title' => 'Defence Notes',
            'case_id' => $caseFile->id,
            'category' => 'defence',
            'file' => UploadedFile::fake()->create('notes.xlsx', 200),
        ]);

        $response->assertRedirect(route('case-docs.index'));
        $this->assertDatabaseHas('documents', [
            'title' => 'Defence Notes',
            'category' => 'defence',
        ]);
        $this->assertDatabaseHas('document_links', [
            'documentable_type' => CaseFile::class,
            'documentable_id' => $caseFile->id,
        ]);
    }

    public function test_staff_with_cases_view_permission_can_open_case_docs_tab(): void
    {
        $user = $this->createUserWithPermissions(['cases.view', 'documents.view']);
        $caseFile = CaseFile::factory()->create();
        $document = Document::factory()->create([
            'title' => 'Application Filing',
            'category' => 'application',
        ]);
        $document->links()->create([
            'documentable_type' => CaseFile::class,
            'documentable_id' => $caseFile->id,
        ]);

        $response = $this->actingAs($user)->get(route('cases.docs', $caseFile));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('cases/docs')
            ->where('caseFile.id', $caseFile->id)
            ->has('documents', 1)
            ->where('documents.0.title', 'Application Filing'));
    }

    private function createUserWithPermissions(array $permissionSlugs): User
    {
        $role = Role::factory()->create(['slug' => 'case-docs-role']);

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
