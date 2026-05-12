<?php

namespace App\Http\Controllers;

use App\Models\Church;
use App\Models\Document;
use App\Models\Event;
use App\Models\Missionary;
use App\Models\Province;
use App\Models\Sermon;
use App\Models\SocialProject;
use App\Models\User;
use Inertia\Inertia;

class GlobalController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('Home', [
            'stats' => [
                'churches'     => Church::where('status', 'active')->count(),
                'provinces'    => Province::where('status', 'active')->count(),
                'missionaries' => Missionary::where('status', 'active')->count(),
                'years'        => now()->year - 1995,
            ],
            'socialProjects' => SocialProject::where('status', 'active')
                ->with('province:id,name,slug')
                ->limit(3)
                ->get(['id', 'name', 'category', 'description', 'status', 'started_at', 'province_id']),
            'events' => Event::where('scope_type', 'national')
                ->where('status', 'published')
                ->where('starts_at', '>=', now())
                ->orderBy('starts_at')
                ->limit(3)
                ->get(['id', 'title', 'slug', 'type', 'starts_at', 'ends_at', 'location', 'is_online', 'registration_required', 'status', 'scope_type', 'scope_id', 'cover_image']),
            'sermon' => Sermon::where('scope_type', 'national')
                ->where('status', 'published')
                ->latest('preached_at')
                ->first(['id', 'title', 'speaker_name', 'series', 'cover_image', 'description', 'video_url', 'audio_url', 'pdf_url', 'duration_minutes', 'preached_at', 'status', 'scope_type', 'scope_id']),
        ]);
    }

    public function quemSomos(): \Inertia\Response
    {
        $leadership = User::role(['super_admin', 'admin'])
            ->select('id', 'name')
            ->get()
            ->map(fn ($u) => [
                'id'   => $u->id,
                'name' => $u->name,
                'role' => match ($u->getRoleNames()->first()) {
                    'super_admin' => 'Superintendente Geral',
                    'admin'       => 'Director Nacional',
                    default       => 'Liderança',
                },
            ]);

        $documents = Document::where('is_public', true)
            ->orderBy('category')
            ->orderByDesc('published_at')
            ->get(['id', 'title', 'category', 'file_url', 'file_size_kb', 'published_at']);

        return Inertia::render('About', compact('leadership', 'documents'));
    }

    public function historia(): \Inertia\Response
    {
        return Inertia::render('Historia');
    }

    public function social(): \Inertia\Response
    {
        $projects = SocialProject::where('status', 'active')
            ->with([
                'province:id,name,slug',
                'projectImpacts:project_id,metric_name,metric_value,recorded_at',
            ])
            ->orderByDesc('started_at')
            ->get()
            ->map(fn ($p) => [
                'id'          => $p->id,
                'name'        => $p->name,
                'category'    => $p->category,
                'description' => $p->description,
                'status'      => $p->status,
                'started_at'  => $p->started_at,
                'province'    => $p->province ? ['name' => $p->province->name, 'slug' => $p->province->slug] : null,
                'impacts'     => $p->projectImpacts->map(fn ($i) => [
                    'metric_name'  => $i->metric_name,
                    'metric_value' => $i->metric_value,
                    'recorded_at'  => $i->recorded_at,
                ])->values(),
            ]);

        return Inertia::render('Social', compact('projects'));
    }

    public function missoes(): \Inertia\Response
    {
        $missionaries = Missionary::where('status', 'active')
            ->with('province:id,name,slug')
            ->get(['id', 'full_name', 'status', 'bio', 'specialization', 'photo_url', 'phone', 'email', 'needs', 'province_id']);

        $stats = [
            'missionaries' => Missionary::where('status', 'active')->count(),
            'provinces'    => Missionary::where('status', 'active')->distinct('province_id')->count('province_id'),
            'churches'     => Church::where('status', 'active')->count(),
        ];

        return Inertia::render('Missions', compact('missionaries', 'stats'));
    }

    public function apoiar(): \Inertia\Response
    {
        return Inertia::render('Give');
    }

    public function contacto(): \Inertia\Response
    {
        return Inertia::render('Contact');
    }

    public function churches(\Illuminate\Http\Request $request): \Inertia\Response
    {
        $province = $request->filled('province')
            ? Province::where('slug', $request->province)->first()
            : null;

        $churches = Church::where('status', 'active')
            ->when($province, fn ($q) => $q->where('province_id', $province->id))
            ->with(['province:id,name,slug', 'region:id,name,slug', 'zone:id,name,slug'])
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'type', 'address', 'lat', 'lng', 'pastor_name', 'phone', 'service_times', 'status', 'province_id', 'region_id', 'zone_id']);

        return Inertia::render('Churches', [
            'churches' => $churches,
            'filters'  => ['province' => $request->province ?? ''],
        ]);
    }
}
