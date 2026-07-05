<?php

namespace App\SitePages\Templates;

use App\Models\SitePage;

class HomogeneousGroupPageTemplate extends SitePageTemplate
{
    public static function key(): string
    {
        return 'homogeneous_group';
    }

    public static function label(): string
    {
        return 'Grupo Homogéneo';
    }

    public static function routeFamily(): string
    {
        return 'homogeneous_groups';
    }

    public static function requiresGroupType(): bool
    {
        return true;
    }

    public static function templateRules(): array
    {
        return [
            'group_type_id' => ['required', 'exists:homogeneous_group_types,id'],
        ];
    }

    public static function enrich(SitePage $page): array
    {
        $page->loadMissing('groupType:id,name,slug,acronym,icon,description,whatsapp_number');

        return [
            'groupType' => $page->groupType,
        ];
    }
}
