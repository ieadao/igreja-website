<?php

use App\Http\Controllers\ProvinceController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// ── National pages ────────────────────────────────────────────────────────────
Route::get('/', fn () => Inertia::render('Home'))->name('home');

Route::get('/sobre',      fn () => Inertia::render('About'))->name('about');
Route::get('/igrejas',    fn () => Inertia::render('Churches'))->name('churches');
Route::get('/eventos',    fn () => Inertia::render('Events'))->name('events');
Route::get('/pregacoes',  fn () => Inertia::render('Sermons'))->name('sermons');
Route::get('/noticias',   fn () => Inertia::render('News'))->name('news');
Route::get('/documentos', fn () => Inertia::render('Documents'))->name('documents');
Route::get('/dar',        fn () => Inertia::render('Give'))->name('give');
Route::get('/missoes',    fn () => Inertia::render('Missions'))->name('missions');
Route::get('/oracao',     fn () => Inertia::render('Prayer'))->name('prayer');
Route::get('/contacto',   fn () => Inertia::render('Contact'))->name('contact');
Route::get('/privacidade',fn () => Inertia::render('Privacy'))->name('privacy');
Route::get('/termos',     fn () => Inertia::render('Terms'))->name('terms');

// Detail pages
Route::get('/eventos/{slug}',   fn (string $slug) => Inertia::render('EventDetail',   ['slug' => $slug]))->name('events.show');
Route::get('/pregacoes/{id}',   fn (int $id)       => Inertia::render('SermonDetail',  ['id' => $id]))->name('sermons.show');
Route::get('/noticias/{slug}',  fn (string $slug) => Inertia::render('NewsDetail',    ['slug' => $slug]))->name('news.show');

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
        Route::get('/igrejas',       fn (string $provinceSlug) => Inertia::render('Province/Churches', ['province' => \App\Models\Province::where('slug', $provinceSlug)->firstOrFail()]))->name('province.churches');
        Route::get('/pregacoes',     fn (string $provinceSlug) => Inertia::render('Province/Sermons',  ['province' => \App\Models\Province::where('slug', $provinceSlug)->firstOrFail()]))->name('province.sermons');
        Route::get('/contacto',      fn (string $provinceSlug) => Inertia::render('Province/Contact',  ['province' => \App\Models\Province::where('slug', $provinceSlug)->firstOrFail()]))->name('province.contact');
    });
