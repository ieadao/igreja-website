<?php

namespace App\Http\Controllers;

use App\Models\Church;
use App\Models\ChurchProgram;
use App\Models\Event;
use App\Models\Missionary;
use App\Models\News;
use App\Models\Province;
use App\Models\Sermon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProvinceController extends Controller
{
    private function findProvince(string $slug): Province
    {
        return Province::where('slug', $slug)->where('status', 'active')->firstOrFail();
    }

    public function show(string $provinceSlug): \Inertia\Response
    {
        $province = $this->findProvince($provinceSlug)->load('regions');

        return Inertia::render('Province/Home', [
            'province'     => $province,
            'events'       => Event::where('scope_type', 'province')
                ->where('scope_id', $province->id)
                ->where('status', 'published')
                ->where('starts_at', '>=', now())
                ->orderBy('starts_at')
                ->limit(4)
                ->get(['id', 'title', 'slug', 'type', 'starts_at', 'ends_at', 'location', 'is_online', 'registration_required', 'status', 'scope_type', 'scope_id']),
            'news'         => News::where('scope_type', 'province')
                ->where('scope_id', $province->id)
                ->where('status', 'published')
                ->orderByDesc('published_at')
                ->limit(3)
                ->get(['id', 'title', 'slug', 'excerpt', 'cover_image', 'published_at', 'status', 'scope_type', 'scope_id']),
            'missionaries' => Missionary::where('province_id', $province->id)
                ->where('status', 'active')
                ->limit(4)
                ->get(['id', 'full_name', 'status', 'bio', 'specialization', 'photo_url', 'phone', 'email', 'needs']),
        ]);
    }

    public function localizacoes(string $provinceSlug): \Inertia\Response
    {
        $province = $this->findProvince($provinceSlug);
        $regions  = $province->regions()
            ->with(['zones' => fn ($q) => $q
                ->withCount('churches')
                ->with(['churches' => fn ($q) => $q
                    ->where('status', 'active')
                    ->orderBy('name')
                    ->select('id', 'zone_id', 'name', 'slug', 'type', 'address', 'pastor_name', 'lat', 'lng')]),
            ])
            ->withCount('churches')
            ->get();

        return Inertia::render('Province/Localizacoes', [
            'province' => $province,
            'regions'  => $regions,
        ]);
    }

    public function eventos(Request $request, string $provinceSlug): \Inertia\Response
    {
        $province = $this->findProvince($provinceSlug);
        $types    = Event::where('scope_type', 'province')
            ->where('scope_id', $province->id)
            ->distinct()
            ->pluck('type');

        $events = Event::where('scope_type', 'province')
            ->where('scope_id', $province->id)
            ->where('status', 'published')
            ->when($request->type, fn ($q, $type) => $q->where('type', $type))
            ->orderBy('starts_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Province/Events', [
            'province' => $province,
            'events'   => $events,
            'types'    => $types,
        ]);
    }

    public function noticias(string $provinceSlug): \Inertia\Response
    {
        $province = $this->findProvince($provinceSlug);
        $news     = News::where('scope_type', 'province')
            ->where('scope_id', $province->id)
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Province/News', [
            'province' => $province,
            'news'     => $news,
        ]);
    }

    public function noticiasShow(string $provinceSlug, string $slug): \Inertia\Response
    {
        $province = $this->findProvince($provinceSlug);
        $article  = News::where('slug', $slug)
            ->where('scope_type', 'province')
            ->where('scope_id', $province->id)
            ->where('status', 'published')
            ->firstOrFail();

        $related = News::where('scope_type', 'province')
            ->where('scope_id', $province->id)
            ->where('status', 'published')
            ->where('id', '!=', $article->id)
            ->orderByDesc('published_at')
            ->limit(3)
            ->get(['id', 'title', 'slug', 'excerpt', 'cover_image', 'published_at', 'status', 'scope_type', 'scope_id']);

        return Inertia::render('Province/NewsDetail', [
            'province' => $province,
            'article'  => $article,
            'related'  => $related,
        ]);
    }

    public function missoes(string $provinceSlug): \Inertia\Response
    {
        $province     = $this->findProvince($provinceSlug);
        $missionaries = Missionary::where('province_id', $province->id)
            ->where('status', 'active')
            ->get(['id', 'full_name', 'status', 'bio', 'specialization', 'photo_url', 'phone', 'email', 'needs']);

        return Inertia::render('Province/Missoes', [
            'province'     => $province,
            'missionaries' => $missionaries,
        ]);
    }

    public function ministerios(string $provinceSlug): \Inertia\Response
    {
        $province = $this->findProvince($provinceSlug);

        $churches = Church::where('province_id', $province->id)
            ->where('status', 'active')
            ->with([
                'region:id,name,slug',
                'zone:id,name,slug',
                'programs' => fn ($q) => $q->where('status', 'active')
                    ->notCancelled()
                    ->with('groupType:id,name,slug,icon,order')
                    ->orderBy('group_type_id')
                    ->orderBy('name'),
            ])
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'type', 'address', 'pastor_name', 'province_id', 'region_id', 'zone_id'])
            ->filter(fn ($c) => $c->programs->isNotEmpty())
            ->values();

        return Inertia::render('Province/Ministerios', [
            'province' => $province,
            'churches' => $churches,
        ]);
    }

    public function igrejas(string $provinceSlug): \Inertia\Response
    {
        $province = $this->findProvince($provinceSlug);
        $churches = Church::where('province_id', $province->id)
            ->where('status', 'active')
            ->with(['region:id,name,slug', 'zone:id,name,slug'])
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'type', 'address', 'lat', 'lng', 'pastor_name', 'phone', 'email', 'service_times', 'status', 'province_id', 'region_id', 'zone_id']);

        return Inertia::render('Province/Churches', [
            'province' => $province,
            'churches' => $churches,
        ]);
    }

    public function pregacoes(string $provinceSlug): \Inertia\Response
    {
        $province = $this->findProvince($provinceSlug);
        $sermons  = Sermon::where('scope_type', 'province')
            ->where('scope_id', $province->id)
            ->where('status', 'published')
            ->orderByDesc('preached_at')
            ->limit(8)
            ->get();

        return Inertia::render('Province/Sermons', [
            'province' => $province,
            'sermons'  => $sermons,
        ]);
    }

    public function contacto(string $provinceSlug): \Inertia\Response
    {
        return Inertia::render('Province/Contact', [
            'province' => $this->findProvince($provinceSlug),
        ]);
    }
}
