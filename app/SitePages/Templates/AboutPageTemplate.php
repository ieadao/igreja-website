<?php

namespace App\SitePages\Templates;

use App\Models\Document;
use App\Models\SitePage;
use App\Models\User;

class AboutPageTemplate extends SitePageTemplate
{
    public static function key(): string
    {
        return 'about';
    }

    public static function label(): string
    {
        return 'Sobre / Quem Somos';
    }

    public static function routeFamily(): string
    {
        return 'about';
    }

    public static function enrich(SitePage $page): array
    {
        $leadership = User::query()
            ->with('roles:name')
            ->select('id', 'name')
            ->get()
            ->filter(fn (User $user) => $user->hasAnyRole(['super_admin', 'admin']))
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => match ($user->getRoleNames()->first()) {
                    'super_admin' => 'Superintendente Geral',
                    'admin' => 'Director Nacional',
                    default => 'Liderança',
                },
            ])
            ->values();

        $documents = Document::where('is_public', true)
            ->orderBy('category')
            ->orderByDesc('published_at')
            ->get(['id', 'title', 'category', 'file_url', 'file_size_kb', 'published_at']);

        return [
            'leadership' => $leadership,
            'documents' => $documents,
        ];
    }
}
