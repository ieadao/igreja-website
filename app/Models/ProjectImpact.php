<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectImpact extends Model
{
    protected $fillable = ['project_id', 'metric_name', 'metric_value', 'recorded_at'];

    protected function casts(): array
    {
        return ['recorded_at' => 'date'];
    }

    public function socialProject(): BelongsTo
    {
        return $this->belongsTo(SocialProject::class, 'project_id');
    }
}
