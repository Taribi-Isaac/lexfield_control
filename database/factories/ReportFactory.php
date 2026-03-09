<?php

namespace Database\Factories;

use App\Models\CaseFile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
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
            'submitted_by_id' => User::factory(),
            'assigned_to_id' => User::factory(),
            'title' => fake()->sentence(4),
            'content' => fake()->paragraph(),
            'status' => fake()->randomElement(['Draft', 'Submitted', 'Reviewed']),
            'submitted_at' => fake()->optional()->dateTime(),
            'reviewed_at' => fake()->optional()->dateTime(),
        ];
    }
}
