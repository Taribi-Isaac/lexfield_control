<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteInvoiceTitleTest extends TestCase
{
    use RefreshDatabase;

    public function test_quote_requires_title(): void
    {
        $user = $this->createUserWithPermissions(['quotes.create']);
        $client = Client::factory()->create();

        $response = $this->actingAs($user)->post(route('quotes.store'), [
            'client_id' => $client->id,
            'items' => [
                ['description' => 'Consulting', 'quantity' => 1, 'unit_price' => 5000],
            ],
            'status' => 'Draft',
        ]);

        $response->assertSessionHasErrors(['title']);
    }

    public function test_invoice_requires_title(): void
    {
        $user = $this->createUserWithPermissions(['invoices.create']);
        $client = Client::factory()->create();

        $response = $this->actingAs($user)->post(route('invoices.store'), [
            'client_id' => $client->id,
            'items' => [
                ['description' => 'Retainer', 'quantity' => 1, 'unit_price' => 10000],
            ],
            'status' => 'Unpaid',
        ]);

        $response->assertSessionHasErrors(['title']);
    }

    public function test_quote_with_title_is_created(): void
    {
        $user = $this->createUserWithPermissions(['quotes.create']);
        $client = Client::factory()->create();

        $response = $this->actingAs($user)->post(route('quotes.store'), [
            'client_id' => $client->id,
            'title' => 'Business Agreement Quote',
            'items' => [
                ['description' => 'Consulting', 'quantity' => 1, 'unit_price' => 5000],
            ],
            'status' => 'Draft',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('quotes', ['title' => 'Business Agreement Quote']);
    }

    public function test_invoice_with_title_is_created(): void
    {
        $user = $this->createUserWithPermissions(['invoices.create']);
        $client = Client::factory()->create();

        $response = $this->actingAs($user)->post(route('invoices.store'), [
            'client_id' => $client->id,
            'title' => 'Retainer Invoice',
            'items' => [
                ['description' => 'Retainer', 'quantity' => 1, 'unit_price' => 10000],
            ],
            'status' => 'Unpaid',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('invoices', ['title' => 'Retainer Invoice']);
    }

    private function createUserWithPermissions(array $permissionSlugs): User
    {
        $role = Role::query()->firstOrCreate(
            ['slug' => 'finance-role'],
            ['name' => 'Finance Role']
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
