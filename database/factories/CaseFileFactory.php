<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CaseFile>
 */
class CaseFileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'lead_lawyer_id' => User::factory(),
            'title' => fake()->sentence(3),
            'suit_number' => strtoupper(fake()->bothify('SUIT-####')),
            'court' => fake()->randomElement(['High Court', 'Magistrate Court', 'Federal High Court']),
            'filing_date' => fake()->date(),
            'opposing_party' => fake()->name(),
            'opposing_counsel' => fake()->name(),
            'status' => fake()->randomElement(['Open', 'Ongoing', 'Adjourned', 'Closed', 'Appeal']),
            'summary' => fake()->optional()->paragraph(),
        ];
    }
}
