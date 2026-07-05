<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    protected $fillable = [
        'scope_type', 'scope_id', 'church_id', 'title', 'slug', 'cover_image', 'description', 'type',
        'starts_at', 'ends_at', 'location', 'is_online', 'stream_url',
        'max_capacity', 'registration_required', 'status',
    ];

    protected function casts(): array
    {
        return [
            'starts_at'             => 'datetime',
            'ends_at'               => 'datetime',
            'is_online'             => 'boolean',
            'registration_required' => 'boolean',
        ];
    }

    public function church(): BelongsTo
    {
        return $this->belongsTo(Church::class);
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }
}
