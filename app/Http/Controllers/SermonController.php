<?php

namespace App\Http\Controllers;

use App\Models\Sermon;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SermonController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $query = Sermon::where('status', 'published')
            ->orderByDesc('preached_at');

        if ($request->filled('serie')) {
            $query->where('series', $request->serie);
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
            $query->whereYear('preached_at', $year)
                  ->whereMonth('preached_at', $month);
        }

        $sermons = $query->paginate(12)->withQueryString();

        $series = Sermon::where('status', 'published')
            ->whereNotNull('series')
            ->distinct()
            ->orderBy('series')
            ->pluck('series');

        $driver = \DB::getDriverName();
        $monthFormat = $driver === 'sqlite' 
            ? "strftime('%Y-%m', preached_at)" 
            : "DATE_FORMAT(preached_at, '%Y-%m')";

        $months = Sermon::where('status', 'published')
            ->selectRaw("DISTINCT $monthFormat as month")
            ->orderByDesc('month')
            ->pluck('month');

        $provinces = \App\Models\Province::where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Media', [
            'sermons'   => $sermons,
            'series'    => $series,
            'months'    => $months,
            'provinces' => $provinces,
            'filters'   => $request->only(['serie', 'scope', 'mes', 'province']),
        ]);
    }

    public function show(int $id): \Inertia\Response
    {
        $sermon = Sermon::where('status', 'published')->findOrFail($id);

        $related = Sermon::where('status', 'published')
            ->where('id', '!=', $id)
            ->where(function ($q) use ($sermon) {
                if ($sermon->series) {
                    $q->where('series', $sermon->series);
                } else {
                    $q->where('speaker_name', $sermon->speaker_name);
                }
            })
            ->orderByDesc('preached_at')
            ->limit(4)
            ->get();

        return Inertia::render('SermonDetail', compact('sermon', 'related'));
    }
}
