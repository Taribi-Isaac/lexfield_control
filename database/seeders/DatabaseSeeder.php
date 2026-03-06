<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class,
        ]);

        $user = User::query()->updateOrCreate(
            ['email' => 'control@lexfieldattorneys.com'],
            [
                'name' => 'Lexfield Super Admin',
                'password' => Hash::make('admin@123'),
                'email_verified_at' => now(),
            ]
        );

        $superAdminRole = Role::query()->where('slug', 'super-admin')->first();

        if ($superAdminRole) {
            $user->roles()->syncWithoutDetaching([$superAdminRole->id]);
            $permissionIds = Permission::query()->pluck('id')->all();
            $superAdminRole->permissions()->syncWithoutDetaching($permissionIds);
        }
    }
}
