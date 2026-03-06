<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StaffProfile>
 */
class StaffProfileFactory extends Factory
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
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'position' => fake()->jobTitle(),
            'department' => fake()->randomElement(['Litigation', 'Corporate', 'Finance', 'Admin']),
            'employment_type' => fake()->randomElement(['Full Time', 'Contract', 'Intern']),
            'employment_status' => fake()->randomElement(['Active', 'On Leave']),
            'date_hired' => fake()->date(),
            'guarantor_name' => fake()->name(),
            'guarantor_phone' => fake()->phoneNumber(),
            'guarantor_address' => fake()->address(),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
