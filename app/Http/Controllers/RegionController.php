<?php

namespace App\Http\Controllers;

use App\Models\Province;
use App\Models\Region;
use Inertia\Inertia;

class RegionController extends Controller
{
    public function show(string $provinceSlug, string $regionSlug): \Inertia\Response
    {
        $province = Province::where('slug', $provinceSlug)
            ->where('status', 'active')
            ->firstOrFail();

        $region = Region::where('province_id', $province->id)
            ->where('slug', $regionSlug)
            ->firstOrFail();

        $zones = $region->zones()
            ->withCount('churches')
            ->orderBy('name')
            ->get();

        return Inertia::render('Region/Index', [
            'province' => $province,
            'region'   => $region,
            'zones'    => $zones,
        ]);
    }
}
