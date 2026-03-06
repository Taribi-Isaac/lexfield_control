<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Permission>
 */
class PermissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $module = fake()->randomElement(['cases', 'clients', 'staff', 'documents']);
        $action = fake()->randomElement(['view', 'create', 'edit', 'delete']);
        $name = ucfirst($module).' '.ucfirst($action);

        return [
            'name' => $name,
            'slug' => Str::slug($module.'.'.$action),
            'module' => $module,
            'action' => $action,
        ];
    }
}
