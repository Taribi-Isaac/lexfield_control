<?php

namespace Database\Factories;

use App\Models\CaseFile;
use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quote>
 */
class QuoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 500, 5000);
        $tax = $this->faker->randomFloat(2, 0, 20);
        $taxAmount = $subtotal * ($tax / 100);

        return [
            'quote_number' => 'Q-'.now()->format('Ymd').'-'.Str::upper(Str::random(4)),
            'title' => $this->faker->sentence(3),
            'client_id' => Client::factory(),
            'case_file_id' => CaseFile::factory(),
            'created_by_id' => User::factory(),
            'status' => 'Draft',
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $subtotal + $taxAmount,
            'issued_at' => now()->toDateString(),
            'valid_until' => now()->addDays(30)->toDateString(),
            'notes' => $this->faker->sentence(),
        ];
    }
}
