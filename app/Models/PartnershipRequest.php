<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnershipRequest extends Model
{
    protected $fillable = [
        'org_name', 'contact_name', 'email', 'phone',
        'type', 'proposal', 'status',
    ];
}
