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
            'cause-list' => 'Cause List',
            'reports' => 'Reports',
            'quotes' => 'Quotes',
            'invoices' => 'Invoices',
            'payments' => 'Payments',
            'messages' => 'Messages',
            'notification-letters' => 'Notification Letters',
            'activity-logs' => 'Activity Logs',
            'roles' => 'Roles',
        ];

        $actions = [
            'view' => 'View',
            'create' => 'Create',
            'edit' => 'Edit',
            'delete' => 'Delete',
            'review' => 'Review',
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
