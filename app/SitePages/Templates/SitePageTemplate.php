<?php

namespace App\SitePages\Templates;

use App\Models\SitePage;

abstract class SitePageTemplate
{
    abstract public static function key(): string;

    abstract public static function label(): string;

    abstract public static function routeFamily(): string;

    public static function requiresGroupType(): bool
    {
        return false;
    }

    public static function templateRules(): array
    {
        return [];
    }

    public static function enrich(SitePage $page): array
    {
        return [];
    }
}
