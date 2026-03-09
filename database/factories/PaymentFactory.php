<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invoice_id' => Invoice::factory(),
            'received_by_id' => User::factory(),
            'receipt_number' => 'RCPT-'.now()->format('Ymd').'-'.Str::upper(Str::random(4)),
            'amount' => $this->faker->randomFloat(2, 1000, 50000),
            'method' => $this->faker->randomElement(['Bank Transfer', 'Cash', 'POS', 'Cheque']),
            'reference' => $this->faker->optional()->bothify('REF-####??'),
            'paid_at' => now()->subDays($this->faker->numberBetween(0, 10)),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}
