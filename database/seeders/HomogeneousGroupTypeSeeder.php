<?php

namespace Database\Seeders;

use App\Models\HomogeneousGroupType;
use Illuminate\Database\Seeder;

class HomogeneousGroupTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Culto Principal',       'slug' => 'culto-principal',       'icon' => 'heroicon-o-building-library', 'order' => 1],
            ['name' => 'Escola Dominical',       'slug' => 'escola-dominical',       'icon' => 'heroicon-o-academic-cap',    'order' => 2],
            ['name' => 'Grupo de Jovens',        'slug' => 'grupo-de-jovens',        'icon' => 'heroicon-o-user-group',      'order' => 3],
            ['name' => 'Grupo de Mulheres',      'slug' => 'grupo-de-mulheres',      'icon' => 'heroicon-o-users',           'order' => 4],
            ['name' => 'Grupo de Homens',        'slug' => 'grupo-de-homens',        'icon' => 'heroicon-o-users',           'order' => 5],
            ['name' => 'Grupo Familiar',         'slug' => 'grupo-familiar',         'icon' => 'heroicon-o-home',            'order' => 6],
            ['name' => 'Grupo de Oração',        'slug' => 'grupo-de-oracao',        'icon' => 'heroicon-o-hand-raised',     'order' => 7],
            ['name' => 'Missões',                'slug' => 'missoes',                'icon' => 'heroicon-o-globe-alt',       'order' => 8],
            ['name' => 'Ministério de Louvor',   'slug' => 'ministerio-de-louvor',   'icon' => 'heroicon-o-musical-note',    'order' => 9],
            ['name' => 'Grupo de Crianças',      'slug' => 'grupo-de-criancas',      'icon' => 'heroicon-o-face-smile',      'order' => 10],
        ];

        foreach ($types as $type) {
            HomogeneousGroupType::firstOrCreate(['slug' => $type['slug']], $type);
        }
    }
}
