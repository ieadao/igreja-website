<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'title', 'category', 'file_url', 'file_size_kb', 'is_public', 'published_at',
    ];

    protected function casts(): array
    {
        return [
            'is_public'    => 'boolean',
            'published_at' => 'datetime',
        ];
    }
}
