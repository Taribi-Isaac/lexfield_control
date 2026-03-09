<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DocumentTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_with_permission_can_view_document(): void
    {
        $user = $this->createUserWithPermissions(['documents.view']);

        $document = Document::factory()->create([
            'uploader_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get(route('documents.show', $document));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('documents/show')
            ->where('document.id', $document->id));
    }

    private function createUserWithPermissions(array $permissionSlugs): User
    {
        $role = Role::factory()->create(['slug' => 'documents-role']);

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
