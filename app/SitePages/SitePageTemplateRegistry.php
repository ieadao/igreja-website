<?php

namespace App\SitePages;

use App\SitePages\Templates\AboutPageTemplate;
use App\SitePages\Templates\ChurchStructurePageTemplate;
use App\SitePages\Templates\HomogeneousGroupPageTemplate;
use App\SitePages\Templates\SitePageTemplate;
use InvalidArgumentException;

class SitePageTemplateRegistry
{
    /**
     * @return array<class-string<SitePageTemplate>>
     */
    public static function all(): array
    {
        return [
            AboutPageTemplate::class,
            HomogeneousGroupPageTemplate::class,
            ChurchStructurePageTemplate::class,
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        $options = [];

        foreach (self::all() as $templateClass) {
            $options[$templateClass::key()] = $templateClass::label();
        }

        return $options;
    }

    /**
     * @return class-string<SitePageTemplate>
     */
    public static function for(string $key): string
    {
        foreach (self::all() as $templateClass) {
            if ($templateClass::key() === $key) {
                return $templateClass;
            }
        }

        throw new InvalidArgumentException("Unknown site page template [{$key}]");
    }

    /**
     * @return class-string<SitePageTemplate>
     */
    public static function forRouteFamily(string $routeFamily): string
    {
        foreach (self::all() as $templateClass) {
            if ($templateClass::routeFamily() === $routeFamily) {
                return $templateClass;
            }
        }

        throw new InvalidArgumentException("Unknown site page route family [{$routeFamily}]");
    }
}
