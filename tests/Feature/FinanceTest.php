<?php

namespace Tests\Feature;

use App\Models\CaseFile;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\Permission;
use App\Models\Quote;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FinanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_with_permission_can_create_quote(): void
    {
        $user = $this->createUserWithPermissions(['quotes.create']);
        $client = Client::factory()->create();
        $caseFile = CaseFile::factory()->create(['client_id' => $client->id]);

        $response = $this->actingAs($user)->post(route('quotes.store'), [
            'client_id' => $client->id,
            'case_file_id' => $caseFile->id,
            'issued_at' => now()->toDateString(),
            'valid_until' => now()->addDays(14)->toDateString(),
            'tax' => 10,
            'items' => [
                [
                    'description' => 'Retainer',
                    'quantity' => 1,
                    'unit_price' => 150000,
                ],
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('quotes', 1);
        $this->assertDatabaseCount('quote_items', 1);

        $quote = Quote::query()->firstOrFail();
        $this->assertEquals(165000.0, (float) $quote->total);
    }

    public function test_staff_with_permission_can_view_quote(): void
    {
        $user = $this->createUserWithPermissions(['quotes.view']);
        $quote = Quote::factory()->create(['created_by_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('quotes.show', $quote));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('quotes/show')
            ->where('quote.id', $quote->id));
    }

    public function test_staff_with_permission_can_create_invoice(): void
    {
        $user = $this->createUserWithPermissions(['invoices.create']);
        $client = Client::factory()->create();
        $caseFile = CaseFile::factory()->create(['client_id' => $client->id]);

        $response = $this->actingAs($user)->post(route('invoices.store'), [
            'client_id' => $client->id,
            'case_file_id' => $caseFile->id,
            'issued_at' => now()->toDateString(),
            'due_date' => now()->addDays(7)->toDateString(),
            'tax' => 10,
            'items' => [
                [
                    'description' => 'Filing fee',
                    'quantity' => 1,
                    'unit_price' => 50000,
                ],
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('invoices', 1);
        $this->assertDatabaseCount('invoice_items', 1);

        $invoice = Invoice::query()->firstOrFail();
        $this->assertEquals(55000.0, (float) $invoice->total);
    }

    public function test_staff_with_permission_can_view_invoice(): void
    {
        $user = $this->createUserWithPermissions(['invoices.view']);
        $invoice = Invoice::factory()->create(['created_by_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('invoices.show', $invoice));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('invoices/show')
            ->where('invoice.id', $invoice->id));
    }

    public function test_staff_with_permission_can_download_quote(): void
    {
        $user = $this->createUserWithPermissions(['quotes.view']);
        $quote = Quote::factory()->create(['created_by_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('quotes.download', $quote));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_staff_with_permission_can_download_invoice(): void
    {
        $user = $this->createUserWithPermissions(['invoices.view']);
        $invoice = Invoice::factory()->create(['created_by_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('invoices.download', $invoice));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_paid_invoice_allows_receipt_download(): void
    {
        $user = $this->createUserWithPermissions(['invoices.view']);
        $invoice = Invoice::factory()->create([
            'created_by_id' => $user->id,
            'status' => 'Paid',
        ]);

        $response = $this->actingAs($user)->get(route('invoices.receipt', $invoice));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    private function createUserWithPermissions(array $permissionSlugs): User
    {
        $role = Role::factory()->create(['slug' => 'finance-role']);

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
