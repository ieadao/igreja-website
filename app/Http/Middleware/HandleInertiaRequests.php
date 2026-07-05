<?php

namespace App\Http\Middleware;

use App\Models\Province;
use Datlechin\FilamentMenuBuilder\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    private static function mapMenuItems(\Illuminate\Support\Collection $items): array
    {
        return $items->map(fn ($item) => [
            'id'       => $item->id,
            'label'    => $item->title,
            'href'     => $item->url ?: null,
            'children' => $item->children->isNotEmpty()
                ? self::mapMenuItems($item->children)
                : [],
        ])->values()->all();
    }

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'provinces' => fn () => Province::where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'code']),

            'mainMenu' => fn () => self::mapMenuItems(
                Menu::location('main_nav')?->menuItems ?? collect()
            ),

            'offcanvasMenu' => fn () => self::mapMenuItems(
                Menu::location('offcanvas')?->menuItems ?? collect()
            ),

            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
        ];
    }
}
