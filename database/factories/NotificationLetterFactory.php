<?php

namespace Database\Factories;

use App\Models\CaseFile;
use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NotificationLetter>
 */
class NotificationLetterFactory extends Factory
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
            'case_file_id' => CaseFile::factory(),
            'generated_by_id' => User::factory(),
            'title' => $this->faker->sentence(4),
            'body' => $this->faker->paragraph(),
        ];
    }
}
