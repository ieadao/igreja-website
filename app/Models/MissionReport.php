<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MissionReport extends Model
{
    protected $fillable = ['missionary_id', 'title', 'body', 'report_date', 'status'];

    protected function casts(): array
    {
        return ['report_date' => 'date'];
    }

    public function missionary(): BelongsTo
    {
        return $this->belongsTo(Missionary::class);
    }
}
