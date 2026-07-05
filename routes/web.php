<?php

use App\Http\Controllers\ChurchController;
use App\Http\Controllers\GateController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DocumentsController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventRegistrationController;
use App\Http\Controllers\GlobalController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PartnershipController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\SermonController;
use App\Http\Controllers\SitePageController;
use App\Http\Controllers\ZoneController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// ── Gate unlock ───────────────────────────────────────────────────────────────
Route::post('/gate/unlock', [GateController::class, 'unlock'])->name('gate.unlock');

// ── National pages ────────────────────────────────────────────────────────────
Route::get('/', [GlobalController::class, 'index'])->name('home');

// Churches map data (JSON)
Route::get('/api/churches', function () {
    return \App\Models\Church::where('status', 'active')
        ->whereNotNull('lat')
        ->whereNotNull('lng')
        ->with('province:id,name,slug')
        ->get(['id', 'name', 'slug', 'lat', 'lng', 'province_id'])
        ->map(fn ($c) => [
            'id'       => $c->id,
            'name'     => $c->name,
            'slug'     => $c->slug,
            'lat'      => (float) $c->lat,
            'lng'      => (float) $c->lng,
            'province' => $c->province ? ['name' => $c->province->name, 'slug' => $c->province->slug] : null,
        ]);
})->name('api.churches');

Route::get('/sobre',               [SitePageController::class, 'about'])->name('about');
Route::get('/historia',            [GlobalController::class, 'historia'])->name('history');
Route::get('/social',              [GlobalController::class, 'social'])->name('social');
Route::get('/missoes',             [GlobalController::class, 'missoes'])->name('missions');
Route::get('/dar',                 [GlobalController::class, 'apoiar'])->name('give');
Route::get('/contacto',            [GlobalController::class, 'contacto'])->name('contact');
Route::post('/contacto',           [ContactController::class, 'store'])->name('contact.store');
Route::post('/parcerias',          [PartnershipController::class, 'store'])->name('partnership.store');
Route::post('/apoios',             [DonationController::class, 'store'])->name('donation.store');

Route::get('/igrejas',    [GlobalController::class, 'churches'])->name('churches');
Route::get('/grupos-homogeneos', [GlobalController::class, 'homogeneousGroups'])->name('homogeneous-groups.index');
Route::get('/grupos-homogeneos/{slug}', [SitePageController::class, 'homogeneousGroup'])->name('homogeneous-groups.show');
Route::get('/estrutura-da-igreja', [SitePageController::class, 'churchStructure'])->name('church-structure.show');
Route::get('/noticias',   [NewsController::class, 'index'])->name('news');
Route::get('/documentos', [DocumentsController::class, 'index'])->name('documents');
Route::get('/oracao',     fn () => Inertia::render('Prayer'))->name('prayer');
Route::get('/privacidade',fn () => Inertia::render('Privacy'))->name('privacy');
Route::get('/termos',     fn () => Inertia::render('Terms'))->name('terms');

// Media (Sermons)
Route::get('/media',          [SermonController::class, 'index'])->name('media');
Route::get('/media/{id}',     [SermonController::class, 'show'])->name('sermon.show')->whereNumber('id');

// Agenda (Events)
Route::get('/agenda',         [EventController::class, 'index'])->name('agenda');
Route::get('/agenda/{slug}',  [EventController::class, 'show'])->name('event.show');
Route::post('/agenda/{slug}/registar', [EventRegistrationController::class, 'store'])->name('event.register');

// News detail
Route::get('/noticias/{slug}', [NewsController::class, 'show'])->name('news.show');

// ── Province sub-sites ────────────────────────────────────────────────────────
Route::prefix('/provincia/{provinceSlug}')
    ->where(['provinceSlug' => '[a-z0-9\-]+'])
    ->group(function () {
        Route::get('/',              [ProvinceController::class, 'show'])->name('province.home');
        Route::get('/localizacoes',  [ProvinceController::class, 'localizacoes'])->name('province.locations');
        Route::get('/eventos',       [ProvinceController::class, 'eventos'])->name('province.events');
        Route::get('/noticias',      [ProvinceController::class, 'noticias'])->name('province.news');
        Route::get('/noticias/{slug}',[ProvinceController::class, 'noticiasShow'])->name('province.news.show');
        Route::get('/missoes',       [ProvinceController::class, 'missoes'])->name('province.missions');
        Route::get('/ministerios',   [ProvinceController::class, 'ministerios'])->name('province.ministries');
        Route::get('/dar',           [ProvinceController::class, 'dar'])->name('province.give');
        Route::get('/sobre',         fn (string $provinceSlug) => Inertia::render('Province/About',    ['province' => \App\Models\Province::where('slug', $provinceSlug)->firstOrFail()]))->name('province.about');
        Route::get('/igrejas',       [ProvinceController::class, 'igrejas'])->name('province.churches');
        Route::get('/pregacoes',     [ProvinceController::class, 'pregacoes'])->name('province.sermons');
        Route::get('/contacto',      [ProvinceController::class, 'contacto'])->name('province.contact');

        // Location hierarchy — wildcard routes must come last
        Route::get('/{regionSlug}',                               [RegionController::class, 'show'])->name('region.show');
        Route::get('/{regionSlug}/{zoneSlug}',                    [ZoneController::class,   'show'])->name('zone.show');
        Route::get('/{regionSlug}/{zoneSlug}/{churchSlug}',       [ChurchController::class, 'show'])->name('church.show');
    });
