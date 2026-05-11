<?php

namespace App\Http\Controllers;

use App\Models\Church;
use App\Models\Province;
use App\Models\Region;
use App\Models\Zone;
use Inertia\Inertia;

class ZoneController extends Controller
{
    public function show(string $provinceSlug, string $regionSlug, string $zoneSlug): \Inertia\Response
    {
        $province = Province::where('slug', $provinceSlug)
            ->where('status', 'active')
            ->firstOrFail();

        $region = Region::where('province_id', $province->id)
            ->where('slug', $regionSlug)
            ->firstOrFail();

        $zone = Zone::where('region_id', $region->id)
            ->where('slug', $zoneSlug)
            ->firstOrFail();

        $churches = Church::where('zone_id', $zone->id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'type', 'pastor_name', 'address', 'lat', 'lng', 'phone', 'service_times', 'status']);

        return Inertia::render('Zone/Index', [
            'province' => $province,
            'region'   => $region,
            'zone'     => $zone,
            'churches' => $churches,
        ]);
    }
}
