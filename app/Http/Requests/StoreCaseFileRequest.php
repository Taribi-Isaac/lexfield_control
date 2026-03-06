<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCaseFileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('permission', 'cases.create') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_id' => ['required', 'exists:clients,id'],
            'lead_lawyer_id' => ['nullable', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'suit_number' => ['nullable', 'string', 'max:255', 'unique:case_files,suit_number'],
            'court' => ['nullable', 'string', 'max:255'],
            'filing_date' => ['nullable', 'date'],
            'opposing_party' => ['nullable', 'string', 'max:255'],
            'opposing_counsel' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['Open', 'Ongoing', 'Adjourned', 'Closed', 'Appeal'])],
            'summary' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'client_id.required' => 'Client is required.',
            'title.required' => 'Case title is required.',
            'status.required' => 'Case status is required.',
        ];
    }
}
