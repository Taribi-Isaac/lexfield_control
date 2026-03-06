<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $clientType = fake()->randomElement(['Individual', 'Corporate']);

        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'client_type' => $clientType,
            'company_name' => $clientType === 'Corporate' ? fake()->company() : null,
            'company_registration_number' => $clientType === 'Corporate' ? fake()->regexify('[A-Z]{2}-[0-9]{6}') : null,
            'contact_person_name' => $clientType === 'Corporate' ? fake()->name() : null,
            'contact_person_email' => $clientType === 'Corporate' ? fake()->safeEmail() : null,
            'contact_person_phone' => $clientType === 'Corporate' ? fake()->phoneNumber() : null,
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
