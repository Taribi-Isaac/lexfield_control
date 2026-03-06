<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'Super Admin', 'slug' => 'super-admin', 'description' => 'Full system access'],
            ['name' => 'Partner', 'slug' => 'partner', 'description' => 'Senior partner access'],
            ['name' => 'Senior Associate', 'slug' => 'senior-associate', 'description' => 'Senior associate access'],
            ['name' => 'Associate', 'slug' => 'associate', 'description' => 'Associate access'],
            ['name' => 'Clerk', 'slug' => 'clerk', 'description' => 'Clerical access'],
            ['name' => 'Accounts Officer', 'slug' => 'accounts-officer', 'description' => 'Finance access'],
            ['name' => 'HR/Admin', 'slug' => 'hr-admin', 'description' => 'HR and admin access'],
        ];

        foreach ($roles as $role) {
            Role::query()->firstOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
