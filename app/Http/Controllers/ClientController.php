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

        $search = request('search');

        $clients = Client::query()
            ->when($search, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('company_name', 'like', "%{$search}%")
                        ->orWhere('contact_person_name', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString()
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
            'filters' => [
                'search' => $search,
            ],
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

    public function show(Client $client): Response
    {
        Gate::authorize('permission', 'clients.view');

        $client->load(['caseFiles', 'documentLinks.document']);

        return Inertia::render('clients/show', [
            'client' => [
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
                'phone' => $client->phone,
                'address' => $client->address,
                'client_type' => $client->client_type,
                'company_name' => $client->company_name,
                'company_registration_number' => $client->company_registration_number,
                'contact_person_name' => $client->contact_person_name,
                'contact_person_email' => $client->contact_person_email,
                'contact_person_phone' => $client->contact_person_phone,
                'cases' => $client->caseFiles->map(fn ($caseFile): array => [
                    'id' => $caseFile->id,
                    'title' => $caseFile->title,
                    'status' => $caseFile->status,
                ]),
                'documents' => $client->documentLinks->map(fn ($link): array => [
                    'id' => $link->document?->id,
                    'title' => $link->document?->title,
                ])->filter(),
            ],
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
