<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChurchProgram extends Model
{
    protected $fillable = [
        'church_id', 'group_type_id', 'name', 'day_of_week',
        'start_time', 'end_time', 'frequency', 'location', 'description', 'status',
    ];

    public function church(): BelongsTo
    {
        return $this->belongsTo(Church::class);
    }

    public function groupType(): BelongsTo
    {
        return $this->belongsTo(HomogeneousGroupType::class, 'group_type_id');
    }
}
