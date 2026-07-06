<?php

namespace Database\Seeders;

use Datlechin\FilamentMenuBuilder\Models\Menu;
use Datlechin\FilamentMenuBuilder\Models\MenuItem;
use Datlechin\FilamentMenuBuilder\Models\MenuLocation;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        MenuLocation::query()->delete();
        MenuItem::query()->delete();
        Menu::query()->delete();

        // ── Navegação Principal ───────────────────────────────────────────────
        $main = Menu::create(['name' => 'Navegação Principal', 'is_visible' => true]);
        MenuLocation::create(['menu_id' => $main->id, 'location' => 'main_nav']);

        $sobre = MenuItem::create([
            'menu_id' => $main->id, 'title' => 'Sobre', 'url' => '/sobre',
            'target' => '_self', 'order' => 1,
        ]);
        MenuItem::create([
            'menu_id' => $main->id, 'parent_id' => $sobre->id,
            'title' => 'História', 'url' => '/historia',
            'target' => '_self', 'order' => 1,
        ]);

        $nav = [
            ['title' => 'Agenda',   'url' => '/agenda',   'order' => 2],
            ['title' => 'Mídia',    'url' => '/midia',    'order' => 3],
            ['title' => 'Missões',  'url' => '/missoes',  'order' => 4],
            ['title' => 'Notícias', 'url' => '/noticias', 'order' => 5],
            ['title' => 'Dar',      'url' => '/dar',      'order' => 6],
        ];
        foreach ($nav as $item) {
            MenuItem::create(array_merge($item, ['menu_id' => $main->id, 'target' => '_self']));
        }

        // ── Menu Lateral (Off-Canvas) ─────────────────────────────────────────
        $offcanvas = Menu::create(['name' => 'Menu Lateral', 'is_visible' => true]);
        MenuLocation::create(['menu_id' => $offcanvas->id, 'location' => 'offcanvas']);

        // Section: Explorar
        $explorar = MenuItem::create([
            'menu_id' => $offcanvas->id, 'title' => 'Explorar', 'url' => null,
            'target' => '_self', 'order' => 1,
        ]);
        $explorarLinks = [
            ['title' => 'Quem Somos',         'url' => '/sobre',    'order' => 1],
            ['title' => 'A Nossa História',   'url' => '/historia', 'order' => 2],
            ['title' => 'Intervenção Social', 'url' => '/social',   'order' => 3],
            ['title' => 'Missões',            'url' => '/missoes',  'order' => 4],
            ['title' => 'Mídia',              'url' => '/midia',    'order' => 5],
            ['title' => 'Agenda',             'url' => '/agenda',   'order' => 6],
            ['title' => 'Notícias',           'url' => '/noticias', 'order' => 7],
        ];
        foreach ($explorarLinks as $link) {
            MenuItem::create(array_merge($link, [
                'menu_id' => $offcanvas->id, 'parent_id' => $explorar->id, 'target' => '_self',
            ]));
        }

        // Section: Estrutura
        $estrutura = MenuItem::create([
            'menu_id' => $offcanvas->id, 'title' => 'Estrutura', 'url' => null,
            'target' => '_self', 'order' => 2,
        ]);
        $estruturaLinks = [
            ['title' => 'Igrejas & Províncias', 'url' => '/igrejas',    'order' => 1],
            ['title' => 'Documentos',           'url' => '/documentos', 'order' => 2],
        ];
        foreach ($estruturaLinks as $link) {
            MenuItem::create(array_merge($link, [
                'menu_id' => $offcanvas->id, 'parent_id' => $estrutura->id, 'target' => '_self',
            ]));
        }

        // Section: Apoiar
        $apoiar = MenuItem::create([
            'menu_id' => $offcanvas->id, 'title' => 'Apoiar', 'url' => null,
            'target' => '_self', 'order' => 3,
        ]);
        $apoiarLinks = [
            ['title' => 'Dar',      'url' => '/dar',      'order' => 1],
            ['title' => 'Oração',   'url' => '/oracao',   'order' => 2],
            ['title' => 'Contacto', 'url' => '/contacto', 'order' => 3],
        ];
        foreach ($apoiarLinks as $link) {
            MenuItem::create(array_merge($link, [
                'menu_id' => $offcanvas->id, 'parent_id' => $apoiar->id, 'target' => '_self',
            ]));
        }
    }
}
