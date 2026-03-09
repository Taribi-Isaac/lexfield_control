<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CauseListEntry>
 */
class CauseListEntryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => fake()->date(),
            'court' => fake()->randomElement(['High Court', 'Magistrate Court', 'Federal High Court']),
            'suit_number' => strtoupper(fake()->bothify('SUIT-####')),
            'case_title' => fake()->sentence(4),
            'assigned_lawyer_id' => User::factory(),
            'created_by_id' => User::factory(),
            'business_of_day' => fake()->sentence(3),
            'time' => fake()->time('H:i:s'),
            'status' => fake()->randomElement(['Scheduled', 'In Court', 'Adjourned', 'Completed']),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
