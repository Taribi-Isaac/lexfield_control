<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStaffRequest;
use App\Http\Requests\UpdateStaffRequest;
use App\Models\Role;
use App\Models\StaffProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('permission', 'staff.view');

        $staff = User::query()
            ->with(['staffProfile', 'roles'])
            ->orderBy('name')
            ->paginate(15)
            ->through(function (User $user): array {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name'),
                    'position' => $user->staffProfile?->position,
                    'department' => $user->staffProfile?->department,
                ];
            });

        return Inertia::render('staff/index', [
            'staff' => $staff,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('permission', 'staff.create');

        return Inertia::render('staff/create', [
            'roles' => Role::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreStaffRequest $request): RedirectResponse
    {
        $staff = DB::transaction(function () use ($request): User {
            $user = User::query()->create([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
                'password' => Hash::make($request->validated('password')),
            ]);

            $profileData = $request->safe()->only([
                'phone',
                'address',
                'photo_path',
                'position',
                'department',
                'employment_type',
                'employment_status',
                'date_hired',
                'guarantor_name',
                'guarantor_phone',
                'guarantor_address',
                'notes',
            ]);

            $user->staffProfile()->create($profileData);

            $user->roles()->sync($request->validated('roles', []));

            return $user;
        });

        return redirect()
            ->route('staff.edit', $staff)
            ->with('success', 'Staff member created.');
    }

    public function edit(User $staff): Response
    {
        Gate::authorize('permission', 'staff.edit');

        $staff->load(['staffProfile', 'roles']);

        return Inertia::render('staff/edit', [
            'staff' => [
                'id' => $staff->id,
                'name' => $staff->name,
                'email' => $staff->email,
                'roles' => $staff->roles->pluck('id'),
                'profile' => $staff->staffProfile,
            ],
            'roles' => Role::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateStaffRequest $request, User $staff): RedirectResponse
    {
        DB::transaction(function () use ($request, $staff): void {
            $staff->update([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
            ]);

            if ($request->filled('password')) {
                $staff->update([
                    'password' => Hash::make($request->validated('password')),
                ]);
            }

            $profileData = $request->safe()->only([
                'phone',
                'address',
                'photo_path',
                'position',
                'department',
                'employment_type',
                'employment_status',
                'date_hired',
                'guarantor_name',
                'guarantor_phone',
                'guarantor_address',
                'notes',
            ]);

            if ($staff->staffProfile) {
                $staff->staffProfile->update($profileData);
            } else {
                StaffProfile::query()->create(array_merge($profileData, [
                    'user_id' => $staff->id,
                ]));
            }

            $staff->roles()->sync($request->validated('roles', []));
        });

        return redirect()
            ->route('staff.edit', $staff)
            ->with('success', 'Staff member updated.');
    }

    public function destroy(User $staff): RedirectResponse
    {
        Gate::authorize('permission', 'staff.delete');

        $staff->delete();

        return redirect()
            ->route('staff.index')
            ->with('success', 'Staff member removed.');
    }
}
