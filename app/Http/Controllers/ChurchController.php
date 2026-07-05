<?php

namespace App\Http\Controllers;

use App\Models\Church;
use App\Models\Province;
use Inertia\Inertia;

class ChurchController extends Controller
{
    public function show(
        string $provinceSlug,
        string $regionSlug,
        string $zoneSlug,
        string $churchSlug,
    ): \Inertia\Response {
        $province = Province::where('slug', $provinceSlug)
            ->where('status', 'active')
            ->firstOrFail();

        $church = Church::where('province_id', $province->id)
            ->where('slug', $churchSlug)
            ->with([
                'province:id,name,slug',
                'region:id,name,slug',
                'zone:id,name,slug',
                'programs' => fn ($q) => $q
                    ->where('status', 'active')
                    ->notCancelled()
                    ->with('groupType:id,name,acronym,slug,icon,order')
                    ->orderBy('group_type_id')
                    ->orderBy('name'),
            ])
            ->firstOrFail();

        return Inertia::render('Church/Show', compact('province', 'church'));
    }
}
