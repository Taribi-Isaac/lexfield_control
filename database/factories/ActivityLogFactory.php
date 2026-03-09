<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'action' => $this->faker->randomElement(['create', 'update', 'delete']),
            'route' => $this->faker->randomElement(['clients.store', 'cases.update', 'invoices.store']),
            'method' => $this->faker->randomElement(['POST', 'PUT', 'DELETE']),
            'url' => $this->faker->url(),
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => $this->faker->userAgent(),
            'subject_type' => $this->faker->randomElement(['Client', 'CaseFile', 'Invoice']),
            'subject_id' => $this->faker->randomNumber(),
            'description' => $this->faker->sentence(),
            'metadata' => [
                'sample' => $this->faker->word(),
            ],
        ];
    }
}
