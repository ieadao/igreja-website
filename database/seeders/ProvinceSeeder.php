<?php

namespace Database\Seeders;

use App\Models\Province;
use Illuminate\Database\Seeder;

class ProvinceSeeder extends Seeder
{
    public function run(): void
    {
        $provinces = [
            ['name' => 'Niassa',            'slug' => 'niassa',            'code' => 'NS'],
            ['name' => 'Cabo Delgado',      'slug' => 'cabo-delgado',      'code' => 'CD'],
            ['name' => 'Nampula',           'slug' => 'nampula',           'code' => 'NP'],
            ['name' => 'Zambézia',          'slug' => 'zambezia',          'code' => 'ZB'],
            ['name' => 'Tete',              'slug' => 'tete',              'code' => 'TT'],
            ['name' => 'Manica',            'slug' => 'manica',            'code' => 'MC'],
            ['name' => 'Sofala',            'slug' => 'sofala',            'code' => 'SF'],
            ['name' => 'Inhambane',         'slug' => 'inhambane',         'code' => 'IH'],
            ['name' => 'Gaza',              'slug' => 'gaza',              'code' => 'GZ'],
            ['name' => 'Maputo Província',  'slug' => 'maputo-provincia',  'code' => 'MP'],
            ['name' => 'Maputo Cidade',     'slug' => 'maputo-cidade',     'code' => 'MC2'],
        ];

        foreach ($provinces as $province) {
            Province::firstOrCreate(['slug' => $province['slug']], array_merge($province, [
                'country' => 'Moçambique',
                'status'  => 'active',
            ]));
        }
    }
}
