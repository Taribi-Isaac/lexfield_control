<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_with_permission_can_create_payment(): void
    {
        $user = $this->createUserWithPermissions(['payments.create', 'payments.view']);
        $invoice = Invoice::factory()->create([
            'total' => 100000,
            'status' => 'Unpaid',
        ]);

        $response = $this->actingAs($user)->post(route('payments.store'), [
            'invoice_id' => $invoice->id,
            'amount' => 40000,
            'method' => 'Bank Transfer',
            'reference' => 'REF-1001',
            'paid_at' => now()->toDateString(),
        ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('payments', 1);
        $invoice->refresh();
        $this->assertEquals('Partially Paid', $invoice->status);
    }

    public function test_payment_receipt_can_be_downloaded(): void
    {
        $user = $this->createUserWithPermissions(['payments.view']);
        $payment = Payment::factory()->create([
            'received_by_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get(route('payments.receipt', $payment));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_payment_cannot_exceed_balance(): void
    {
        $user = $this->createUserWithPermissions(['payments.create']);
        $invoice = Invoice::factory()->create([
            'total' => 20000,
            'status' => 'Unpaid',
        ]);

        $response = $this->actingAs($user)->post(route('payments.store'), [
            'invoice_id' => $invoice->id,
            'amount' => 50000,
            'method' => 'Cash',
        ]);

        $response->assertSessionHasErrors(['amount']);
        $this->assertDatabaseCount('payments', 0);
    }

    public function test_payments_index_page_can_be_viewed(): void
    {
        $user = $this->createUserWithPermissions(['payments.view']);
        Payment::factory()->count(2)->create([
            'received_by_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get(route('payments.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('payments/index')
            ->has('payments.data', 2));
    }

    private function createUserWithPermissions(array $permissionSlugs): User
    {
        $role = Role::factory()->create(['slug' => 'payments-role']);

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
