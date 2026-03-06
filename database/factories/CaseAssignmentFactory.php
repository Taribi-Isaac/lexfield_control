<?php

namespace Database\Factories;

use App\Models\CaseFile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CaseAssignment>
 */
class CaseAssignmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'case_file_id' => CaseFile::factory(),
            'user_id' => User::factory(),
            'role' => fake()->randomElement(['Lead', 'Associate']),
            'assigned_at' => fake()->dateTime(),
        ];
    }
}
