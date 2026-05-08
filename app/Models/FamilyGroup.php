<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FamilyGroup extends Model
{
    protected $fillable = [
        'church_id', 'name', 'zone', 'leader_name', 'leader_phone',
        'meeting_day', 'meeting_time', 'status',
    ];

    public function church(): BelongsTo
    {
        return $this->belongsTo(Church::class);
    }
}
