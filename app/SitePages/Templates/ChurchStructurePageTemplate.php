<?php

namespace App\SitePages\Templates;

class ChurchStructurePageTemplate extends SitePageTemplate
{
    public static function key(): string
    {
        return 'church_structure';
    }

    public static function label(): string
    {
        return 'Estrutura da Igreja';
    }

    public static function routeFamily(): string
    {
        return 'church_structure';
    }
}
