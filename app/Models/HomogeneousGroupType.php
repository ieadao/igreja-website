<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HomogeneousGroupType extends Model
{
    public $timestamps = false;

    protected $fillable = ['name', 'acronym', 'slug', 'icon', 'order', 'description', 'whatsapp_number'];

    public function programs(): HasMany
    {
        return $this->hasMany(ChurchProgram::class, 'group_type_id');
    }
}
