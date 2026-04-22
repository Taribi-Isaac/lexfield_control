<?php

namespace App\Http\Requests;

use App\Models\CaseFile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCaseDocumentRequest extends FormRequest
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
            'case_id' => ['required', 'integer', Rule::exists(CaseFile::class, 'id')],
            'category' => ['required', Rule::in([
                'writ/change',
                'case files',
                'defence',
                'application',
            ])],
            'file' => [
                'required',
                'file',
                'max:51200',
                'mimes:doc,docx,pdf,png,jpg,jpeg,mp3,mp4,txt,csv,xls,xlsx,rtf,odt,ods,ppt,pptx,zip',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Document title is required.',
            'case_id.required' => 'Please select a case.',
            'case_id.exists' => 'The selected case is invalid.',
            'category.required' => 'Please choose a case document category.',
            'category.in' => 'Category must be one of writ/change, case files, defence, or application.',
            'file.required' => 'Please upload a document.',
        ];
    }
}
