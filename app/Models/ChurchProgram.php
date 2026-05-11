<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChurchProgram extends Model
{
    protected $fillable = [
        'church_id', 'group_type_id', 'name', 'day_of_week',
        'start_time', 'end_time', 'frequency', 'location', 'description',
        'status', 'cancelled_from', 'cancelled_until',
    ];

    protected function casts(): array
    {
        return [
            'cancelled_from'  => 'date',
            'cancelled_until' => 'date',
        ];
    }

    /**
     * Exclude programs whose cancellation window covers today.
     */
    public function scopeNotCancelled(Builder $query): void
    {
        $today = today();

        $query->where(function (Builder $q) use ($today) {
            $q->whereNull('cancelled_from')
              ->orWhereNull('cancelled_until')
              ->orWhere('cancelled_until', '<', $today)
              ->orWhere('cancelled_from', '>', $today);
        });
    }

    public function church(): BelongsTo
    {
        return $this->belongsTo(Church::class);
    }

    public function groupType(): BelongsTo
    {
        return $this->belongsTo(HomogeneousGroupType::class, 'group_type_id');
    }
}
