<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('permission', 'clients.view');

        $clients = Client::query()
            ->orderBy('name')
            ->paginate(15)
            ->through(function (Client $client): array {
                return [
                    'id' => $client->id,
                    'name' => $client->name,
                    'client_type' => $client->client_type,
                    'email' => $client->email,
                    'phone' => $client->phone,
                ];
            });

        return Inertia::render('clients/index', [
            'clients' => $clients,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('permission', 'clients.create');

        return Inertia::render('clients/create');
    }

    public function store(StoreClientRequest $request): RedirectResponse
    {
        $client = Client::query()->create($request->validated());

        return redirect()
            ->route('clients.edit', $client)
            ->with('success', 'Client created.');
    }

    public function edit(Client $client): Response
    {
        Gate::authorize('permission', 'clients.edit');

        return Inertia::render('clients/edit', [
            'client' => $client,
        ]);
    }

    public function update(UpdateClientRequest $request, Client $client): RedirectResponse
    {
        $client->update($request->validated());

        return redirect()
            ->route('clients.edit', $client)
            ->with('success', 'Client updated.');
    }

    public function destroy(Client $client): RedirectResponse
    {
        Gate::authorize('permission', 'clients.delete');

        $client->delete();

        return redirect()
            ->route('clients.index')
            ->with('success', 'Client removed.');
    }
}
