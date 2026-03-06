<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uploader_id' => User::factory(),
            'title' => fake()->sentence(3),
            'category' => fake()->randomElement(['Court Filing', 'Agreement', 'Evidence', 'Research']),
            'disk' => 'local',
            'file_name' => fake()->lexify('document-????.pdf'),
            'file_path' => 'documents/'.fake()->uuid().'.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => fake()->numberBetween(10000, 200000),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
