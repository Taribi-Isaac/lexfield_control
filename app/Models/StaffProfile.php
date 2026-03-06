<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffProfile extends Model
{
    /** @use HasFactory<\Database\Factories\StaffProfileFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
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
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
