<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Church extends Model
{
    protected $fillable = [
        'province_id', 'region_id', 'zone_id', 'name', 'slug', 'type',
        'address', 'lat', 'lng', 'pastor_name', 'phone', 'email',
        'service_times', 'status', 'founded_at',
        'mpesa_number', 'mpesa_name', 'emola_number', 'emola_name',
        'bank_name', 'bank_account_name', 'bank_nib', 'give_instructions',
    ];

    protected $casts = [
        'service_times' => 'array',
        'founded_at' => 'date',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    public function programs(): HasMany
    {
        return $this->hasMany(ChurchProgram::class);
    }

    public function familyGroups(): HasMany
    {
        return $this->hasMany(FamilyGroup::class);
    }
}
