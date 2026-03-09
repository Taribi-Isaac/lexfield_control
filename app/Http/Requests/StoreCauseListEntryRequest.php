<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCauseListEntryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('permission', 'cause-list.create') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'court' => ['required', 'string', 'max:255'],
            'suit_number' => ['nullable', 'string', 'max:255'],
            'case_title' => ['required', 'string', 'max:255'],
            'assigned_lawyer_id' => ['nullable', 'exists:users,id'],
            'business_of_day' => ['nullable', 'string', 'max:255'],
            'time' => ['nullable', 'date_format:H:i'],
            'status' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'date.required' => 'Date is required.',
            'court.required' => 'Court is required.',
            'case_title.required' => 'Case title is required.',
            'status.required' => 'Status is required.',
        ];
    }
}
