<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactRequest extends Model
{
    protected $fillable = [
        'province_id', 'name', 'email', 'phone', 'type', 'message',
        'status', 'assigned_to', 'response',
    ];

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }
}
