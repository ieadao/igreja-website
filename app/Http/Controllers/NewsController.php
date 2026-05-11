<?php

namespace App\Http\Controllers;

use App\Models\News;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function index(): \Inertia\Response
    {
        $news = News::where('scope_type', 'national')
            ->where('status', 'published')
            ->with('author:id,name')
            ->orderByDesc('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('News', ['news' => $news]);
    }

    public function show(string $slug): \Inertia\Response
    {
        $article = News::where('slug', $slug)
            ->where('scope_type', 'national')
            ->where('status', 'published')
            ->with('author:id,name')
            ->firstOrFail();

        $related = News::where('scope_type', 'national')
            ->where('status', 'published')
            ->where('id', '!=', $article->id)
            ->orderByDesc('published_at')
            ->limit(3)
            ->get(['id', 'title', 'slug', 'excerpt', 'cover_image', 'published_at', 'status', 'scope_type', 'scope_id']);

        return Inertia::render('NewsDetail', compact('article', 'related'));
    }
}
