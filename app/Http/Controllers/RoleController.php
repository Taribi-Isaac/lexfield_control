<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateRoleRequest;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('permission', 'roles.view');

        $roles = Role::query()
            ->withCount('permissions')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role): array => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'permissions_count' => $role->permissions_count,
            ]);

        return Inertia::render('roles/index', [
            'roles' => $roles,
        ]);
    }

    public function edit(Role $role): Response
    {
        Gate::authorize('permission', 'roles.edit');

        $role->load('permissions');

        $permissions = Permission::query()
            ->orderBy('module')
            ->orderBy('name')
            ->get()
            ->groupBy(fn (Permission $permission) => $permission->module ?: 'General')
            ->map(fn ($group, string $module): array => [
                'module' => $module,
                'permissions' => $group->map(fn (Permission $permission): array => [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'slug' => $permission->slug,
                    'action' => $permission->action,
                ])->values()->all(),
            ])
            ->values()
            ->all();

        return Inertia::render('roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'permissions' => $role->permissions->pluck('id'),
            ],
            'permissions' => $permissions,
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        Gate::authorize('permission', 'roles.edit');

        $role->permissions()->sync($request->validated('permissions', []));

        return redirect()
            ->route('roles.edit', $role)
            ->with('success', 'Role permissions updated.');
    }
}
