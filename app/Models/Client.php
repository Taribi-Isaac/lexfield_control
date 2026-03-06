<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'photo_path',
        'client_type',
        'company_name',
        'company_registration_number',
        'contact_person_name',
        'contact_person_email',
        'contact_person_phone',
        'notes',
    ];

    public function caseFiles(): HasMany
    {
        return $this->hasMany(CaseFile::class);
    }

    public function documentLinks(): MorphMany
    {
        return $this->morphMany(DocumentLink::class, 'documentable');
    }
}
