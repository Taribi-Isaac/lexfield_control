<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [
            'clients' => 'Clients',
            'cases' => 'Cases',
            'staff' => 'Staff',
            'documents' => 'Documents',
        ];

        $actions = [
            'view' => 'View',
            'create' => 'Create',
            'edit' => 'Edit',
            'delete' => 'Delete',
        ];

        foreach ($modules as $moduleSlug => $moduleName) {
            foreach ($actions as $actionSlug => $actionName) {
                $slug = $moduleSlug.'.'.$actionSlug;
                Permission::query()->firstOrCreate(
                    ['slug' => $slug],
                    [
                        'name' => $moduleName.' '.$actionName,
                        'slug' => $slug,
                        'module' => $moduleSlug,
                        'action' => $actionSlug,
                    ]
                );
            }
        }
    }
}
