<?php

namespace Database\Seeders;

use App\Models\Church;
use App\Models\ChurchProgram;
use App\Models\HomogeneousGroupType;
use App\Models\Province;
use App\Models\Region;
use App\Models\Zone;
use Illuminate\Database\Seeder;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // ── Group type IDs ──────────────────────────────────────────────────
        $geral    = HomogeneousGroupType::where('slug', 'geral')->firstOrFail();
        $homens   = HomogeneousGroupType::where('slug', 'grupo-homogeneo-de-homens')->firstOrFail();
        $senhoras = HomogeneousGroupType::where('slug', 'grupo-homogeneo-de-senhoras')->firstOrFail();
        $jovens   = HomogeneousGroupType::where('slug', 'grupo-homogeneo-de-jovens')->firstOrFail();
        $criancas = HomogeneousGroupType::where('slug', 'grupo-homogeneo-de-criancas')->firstOrFail();

        // ── Provinces ───────────────────────────────────────────────────────
        $maputoC = Province::where('slug', 'maputo-cidade')->firstOrFail();
        $nampula = Province::where('slug', 'nampula')->firstOrFail();

        // ── Regions ─────────────────────────────────────────────────────────
        $regCentro = Region::firstOrCreate(
            ['slug' => 'maputo-centro'],
            [
                'province_id' => $maputoC->id,
                'name'        => 'Maputo Centro',
                'slug'        => 'maputo-centro',
                'status'      => 'active',
            ]
        );

        $regNorte = Region::firstOrCreate(
            ['slug' => 'maputo-norte'],
            [
                'province_id' => $maputoC->id,
                'name'        => 'Maputo Norte',
                'slug'        => 'maputo-norte',
                'status'      => 'active',
            ]
        );

        $regNampulaCidade = Region::firstOrCreate(
            ['slug' => 'nampula-cidade'],
            [
                'province_id' => $nampula->id,
                'name'        => 'Nampula Cidade',
                'slug'        => 'nampula-cidade',
                'status'      => 'active',
            ]
        );

        // ── Zones ────────────────────────────────────────────────────────────
        $zonaSomm = Zone::firstOrCreate(
            ['slug' => 'sommerschield'],
            [
                'region_id' => $regCentro->id,
                'name'      => 'Sommerschield',
                'slug'      => 'sommerschield',
                'status'    => 'active',
            ]
        );

        $zonaMatola = Zone::firstOrCreate(
            ['slug' => 'matola'],
            [
                'region_id' => $regNorte->id,
                'name'      => 'Matola',
                'slug'      => 'matola',
                'status'    => 'active',
            ]
        );

        $zonaNampulaRua = Zone::firstOrCreate(
            ['slug' => 'nampula-rua-do-trabalho'],
            [
                'region_id' => $regNampulaCidade->id,
                'name'      => 'Rua do Trabalho',
                'slug'      => 'nampula-rua-do-trabalho',
                'status'    => 'active',
            ]
        );

        // ── Churches ─────────────────────────────────────────────────────────
        $churchSomm = Church::firstOrCreate(
            ['slug' => 'mao-sommerschield'],
            [
                'province_id'  => $maputoC->id,
                'region_id'    => $regCentro->id,
                'zone_id'      => $zonaSomm->id,
                'name'         => 'MAO Sommerschield',
                'slug'         => 'mao-sommerschield',
                'type'         => 'church',
                'address'      => 'Av. Julius Nyerere, Sommerschield, Maputo',
                'pastor_name'  => 'Pr. António Macuácua',
                'phone'        => '+258 84 100 0001',
                'service_times' => [
                    ['day' => 'sun', 'time' => '09:00', 'label' => 'Culto da Manhã'],
                    ['day' => 'sun', 'time' => '17:00', 'label' => 'Culto da Tarde'],
                    ['day' => 'wed', 'time' => '19:00', 'label' => 'Estudo Bíblico'],
                ],
                'status'       => 'active',
                'founded_at'   => '2005-03-12',
            ]
        );

        $churchMatola = Church::firstOrCreate(
            ['slug' => 'mao-matola'],
            [
                'province_id'  => $maputoC->id,
                'region_id'    => $regNorte->id,
                'zone_id'      => $zonaMatola->id,
                'name'         => 'MAO Matola',
                'slug'         => 'mao-matola',
                'type'         => 'church',
                'address'      => 'Av. das FPLM, Matola',
                'pastor_name'  => 'Pr. Carlos Nhantumbo',
                'phone'        => '+258 84 200 0002',
                'service_times' => [
                    ['day' => 'sun', 'time' => '08:30', 'label' => 'Culto Principal'],
                    ['day' => 'thu', 'time' => '19:00', 'label' => 'Noite de Oração'],
                ],
                'status'       => 'active',
                'founded_at'   => '2010-06-20',
            ]
        );

        $churchNampula = Church::firstOrCreate(
            ['slug' => 'mao-nampula-central'],
            [
                'province_id'  => $nampula->id,
                'region_id'    => $regNampulaCidade->id,
                'zone_id'      => $zonaNampulaRua->id,
                'name'         => 'MAO Nampula Central',
                'slug'         => 'mao-nampula-central',
                'type'         => 'church',
                'address'      => 'Rua do Trabalho, Nampula',
                'pastor_name'  => 'Pr. José Mussa',
                'phone'        => '+258 86 300 0003',
                'service_times' => [
                    ['day' => 'sun', 'time' => '09:00', 'label' => 'Culto Público'],
                ],
                'status'       => 'active',
                'founded_at'   => '2015-01-11',
            ]
        );

        // ── Programs — templates applied to each church ───────────────────
        $programTemplates = [
            // Programas Gerais
            [
                'group_type_id' => $geral->id,
                'name'          => 'Culto Público de Domingo',
                'day_of_week'   => 'sun',
                'start_time'    => '09:00',
                'end_time'      => '11:00',
                'frequency'     => 'weekly',
                'status'        => 'active',
            ],
            [
                'group_type_id' => $geral->id,
                'name'          => 'Estudo Bíblico',
                'day_of_week'   => 'wed',
                'start_time'    => '19:00',
                'end_time'      => '20:30',
                'frequency'     => 'weekly',
                'status'        => 'active',
            ],
            [
                'group_type_id' => $geral->id,
                'name'          => 'Noite de Oração',
                'day_of_week'   => 'fri',
                'start_time'    => '19:00',
                'end_time'      => '21:00',
                'frequency'     => 'weekly',
                'status'        => 'active',
            ],

            // Grupos Homogéneos
            [
                'group_type_id' => $homens->id,
                'name'          => null,
                'day_of_week'   => 'sat',
                'start_time'    => '07:00',
                'end_time'      => '09:00',
                'frequency'     => 'weekly',
                'status'        => 'active',
            ],
            [
                'group_type_id' => $senhoras->id,
                'name'          => null,
                'day_of_week'   => 'sat',
                'start_time'    => '09:00',
                'end_time'      => '11:00',
                'frequency'     => 'weekly',
                'status'        => 'active',
            ],
            [
                'group_type_id' => $jovens->id,
                'name'          => null,
                'day_of_week'   => 'sat',
                'start_time'    => '15:00',
                'end_time'      => '17:00',
                'frequency'     => 'weekly',
                'status'        => 'active',
            ],
            [
                'group_type_id' => $criancas->id,
                'name'          => 'Escola Bíblica de Crianças',
                'day_of_week'   => 'sun',
                'start_time'    => '09:00',
                'end_time'      => '11:00',
                'frequency'     => 'weekly',
                'status'        => 'active',
            ],
        ];

        foreach ([$churchSomm, $churchMatola, $churchNampula] as $church) {
            foreach ($programTemplates as $tpl) {
                $exists = ChurchProgram::where('church_id', $church->id)
                    ->where('group_type_id', $tpl['group_type_id'])
                    ->where('day_of_week', $tpl['day_of_week'])
                    ->exists();

                if (! $exists) {
                    ChurchProgram::create(array_merge($tpl, ['church_id' => $church->id]));
                }
            }
        }

        $this->command->info('Sample data seeded: 3 regions, 3 zones, 3 churches, ' . (count($programTemplates) * 3) . ' programs');
    }
}
