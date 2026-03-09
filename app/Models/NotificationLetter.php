<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationLetter extends Model
{
    /** @use HasFactory<\Database\Factories\NotificationLetterFactory> */
    use HasFactory;

    protected $table = 'generated_letters';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'client_id',
        'case_file_id',
        'generated_by_id',
        'title',
        'body',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function caseFile(): BelongsTo
    {
        return $this->belongsTo(CaseFile::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by_id');
    }
}
