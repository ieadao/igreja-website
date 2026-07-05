<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteLock extends Model
{
    protected $guarded = [];

    protected $casts = [
        'is_active'    => 'boolean',
        'locked_paths' => 'array',
    ];

    public static function config(): self
    {
        return self::firstOrCreate([], [
            'is_active'   => false,
            'scope'       => 'global',
            'gate_title'  => 'Acesso Restrito',
            'gate_message' => null,
        ]);
    }
}
