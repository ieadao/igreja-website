<?php

namespace App\Filament\Resources\SitePages\Pages\Concerns;

use App\SitePages\SitePageTemplateRegistry;
use Illuminate\Support\Facades\Validator;

trait InteractsWithSitePageData
{
    protected function mutateSitePageData(array $data): array
    {
        $templateClass = SitePageTemplateRegistry::for($data['template']);

        Validator::make($data, array_merge([
            'template' => ['required', 'in:' . implode(',', array_keys(SitePageTemplateRegistry::options()))],
            'group_type_id' => [$templateClass::requiresGroupType() ? 'required' : 'nullable'],
        ], $templateClass::templateRules()))->validate();

        if (! $templateClass::requiresGroupType()) {
            $data['group_type_id'] = null;
        }

        $data['sections'] ??= [];

        return $data;
    }
}
