<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Missionary extends Model
{
    protected $fillable = [
        'user_id', 'church_id', 'province_id', 'full_name', 'status',
        'bio', 'specialization', 'photo_url', 'phone', 'email', 'needs', 'started_at',
    ];

    protected function casts(): array
    {
        return ['started_at' => 'date'];
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function church(): BelongsTo
    {
        return $this->belongsTo(Church::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function missionReports(): HasMany
    {
        return $this->hasMany(MissionReport::class);
    }
}
