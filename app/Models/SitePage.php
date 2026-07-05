<?php

namespace App\Models;

use Datlechin\FilamentMenuBuilder\Contracts\MenuPanelable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SitePage extends Model implements MenuPanelable
{
    protected $fillable = [
        'group_type_id',
        'title',
        'slug',
        'template',
        'hero_image',
        'excerpt',
        'content',
        'sections',
        'whatsapp_number',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'sections' => 'array',
    ];

    public function groupType(): BelongsTo
    {
        return $this->belongsTo(HomogeneousGroupType::class, 'group_type_id');
    }

    public function getMenuPanelName(): string
    {
        return 'Páginas';
    }

    public function getMenuPanelTitleColumn(): string
    {
        return 'title';
    }

    public function getMenuPanelUrlUsing(): callable
    {
        return function (self $model) {
            return match ($model->template) {
                'about' => route('about'),
                'church_structure' => route('church-structure.show'),
                'homogeneous_group' => route('homogeneous-groups.show', ['slug' => $model->slug]),
                default => '#',
            };
        };
    }

    public function getMenuPanelModifyQueryUsing(): callable
    {
        return function ($query) {
            return $query->where('is_published', true);
        };
    }
}
