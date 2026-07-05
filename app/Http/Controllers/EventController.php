<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Inertia\Inertia;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $query = Event::with(['church:id,name,address'])
            ->where('status', 'published')
            ->orderBy('starts_at');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('scope') && $request->scope !== 'all') {
            $query->where('scope_type', $request->scope);
        }
        if ($request->filled('province')) {
            $query->where('scope_type', 'province')
                  ->where('scope_id', $request->province);
        }
        if ($request->filled('mes')) {
            [$year, $month] = explode('-', $request->mes);
            $query->whereYear('starts_at', $year)
                  ->whereMonth('starts_at', $month);
        }

        $events = $query->paginate(15)->withQueryString();

        $types = Event::where('status', 'published')
            ->distinct()
            ->orderBy('type')
            ->pluck('type');

        $driver = \DB::getDriverName();
        $monthFormat = $driver === 'sqlite' 
            ? "strftime('%Y-%m', starts_at)" 
            : "DATE_FORMAT(starts_at, '%Y-%m')";

        $months = Event::where('status', 'published')
            ->selectRaw("DISTINCT $monthFormat as month")
            ->orderBy('month')
            ->pluck('month');

        $provinces = \App\Models\Province::where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Agenda', [
            'events'    => $events,
            'types'     => $types,
            'months'    => $months,
            'provinces' => $provinces,
            'filters'   => $request->only(['type', 'scope', 'mes', 'province']),
        ]);
    }

    public function show(string $slug): \Inertia\Response
    {
        $event = Event::with(['church:id,name,address'])
            ->where('status', 'published')
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('EventDetail', [
            'event'        => $event,
            'isRegistered' => false,
        ]);
    }
}
