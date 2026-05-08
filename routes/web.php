<?php

use App\Models\Province;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

// ── Province pages ─────────────────────────────────────────────────────────────
Route::prefix('/provincia/{provinceSlug}')->group(function () {
    Route::get('/',          fn (string $provinceSlug) => Inertia::render('Province/Home',     ['province' => Province::where('slug', $provinceSlug)->firstOrFail()]))->name('province.home');
    Route::get('/sobre',     fn (string $provinceSlug) => Inertia::render('Province/About',    ['province' => Province::where('slug', $provinceSlug)->firstOrFail()]))->name('province.about');
    Route::get('/igrejas',   fn (string $provinceSlug) => Inertia::render('Province/Churches', ['province' => Province::where('slug', $provinceSlug)->firstOrFail()]))->name('province.churches');
    Route::get('/eventos',   fn (string $provinceSlug) => Inertia::render('Province/Events',   ['province' => Province::where('slug', $provinceSlug)->firstOrFail()]))->name('province.events');
    Route::get('/pregacoes', fn (string $provinceSlug) => Inertia::render('Province/Sermons',  ['province' => Province::where('slug', $provinceSlug)->firstOrFail()]))->name('province.sermons');
    Route::get('/noticias',  fn (string $provinceSlug) => Inertia::render('Province/News',     ['province' => Province::where('slug', $provinceSlug)->firstOrFail()]))->name('province.news');
    Route::get('/contacto',  fn (string $provinceSlug) => Inertia::render('Province/Contact',  ['province' => Province::where('slug', $provinceSlug)->firstOrFail()]))->name('province.contact');
})->where('provinceSlug', '[a-z0-9\-]+');
