<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Province extends Model
{
    protected $fillable = [
        'name', 'slug', 'code', 'country',
        'hero_image', 'hero_video_url', 'tagline', 'description', 'status',
    ];

    public function regions(): HasMany
    {
        return $this->hasMany(Region::class);
    }

    public function churches(): HasMany
    {
        return $this->hasMany(Church::class);
    }
}
