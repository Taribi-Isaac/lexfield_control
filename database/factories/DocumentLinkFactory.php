<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DocumentLink>
 */
class DocumentLinkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'document_id' => Document::factory(),
            'documentable_type' => Client::class,
            'documentable_id' => Client::factory(),
        ];
    }
}
