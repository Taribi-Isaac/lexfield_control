<?php

namespace App\Http\Requests;

use App\Models\CaseFile;
use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('permission', 'documents.create') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'documentable_type' => ['required', Rule::in([Client::class, CaseFile::class, User::class, 'general'])],
            'documentable_id' => ['required_if:documentable_type,'.Client::class.','.CaseFile::class.','.User::class, 'integer'],
            'file' => ['required', 'file', 'max:10240', 'mimes:pdf,doc,docx,jpg,jpeg,png'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Document title is required.',
            'documentable_type.required' => 'Document link type is required.',
            'documentable_id.required' => 'Document link target is required.',
            'file.required' => 'Document file is required.',
        ];
    }
}
