<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sermon extends Model
{
    protected $fillable = [
        'user_id', 'speaker_name', 'scope_type', 'scope_id', 'title', 'series', 'cover_image',
        'description', 'video_url', 'audio_url', 'pdf_url', 'duration_minutes', 'preached_at', 'status',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'preached_at' => 'date',
            'is_featured' => 'boolean',
        ];
    }

    public function speaker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
