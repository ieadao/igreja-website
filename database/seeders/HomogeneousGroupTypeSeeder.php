<?php

namespace Database\Seeders;

use App\Models\HomogeneousGroupType;
use Illuminate\Database\Seeder;

class HomogeneousGroupTypeSeeder extends Seeder
{
    public function run(): void
    {
        // Limpar tipos anteriores (só correr uma vez em fresh install)
        HomogeneousGroupType::truncate();

        $types = [
            ['name' => 'Grupo Homogéneo de Homens',      'slug' => 'grupo-homogeneo-de-homens',      'icon' => 'heroicon-o-user',             'order' => 1],
            ['name' => 'Grupo Homogéneo de Senhoras',    'slug' => 'grupo-homogeneo-de-senhoras',    'icon' => 'heroicon-o-user-circle',      'order' => 2],
            ['name' => 'Grupo Homogéneo de Jovens',      'slug' => 'grupo-homogeneo-de-jovens',      'icon' => 'heroicon-o-sparkles',         'order' => 3],
            ['name' => 'Grupo Homogéneo de Crianças',    'slug' => 'grupo-homogeneo-de-criancas',    'icon' => 'heroicon-o-face-smile',       'order' => 4],
        ];

        foreach ($types as $type) {
            HomogeneousGroupType::create($type);
        }
    }
}
