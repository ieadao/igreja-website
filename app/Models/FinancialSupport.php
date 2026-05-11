<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FinancialSupport extends Model
{
    protected $fillable = [
        'user_id', 'province_id', 'name', 'type', 'amount', 'currency',
        'payment_method', 'destination', 'reference', 'status', 'supported_at',
    ];

    protected function casts(): array
    {
        return [
            'amount'       => 'decimal:2',
            'supported_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }
}
