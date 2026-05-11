<?php

namespace Database\Seeders;

use App\Models\Church;
use App\Models\ChurchProgram;
use App\Models\Document;
use App\Models\Event;
use App\Models\HomogeneousGroupType;
use App\Models\Missionary;
use App\Models\MissionReport;
use App\Models\News;
use App\Models\Province;
use App\Models\Region;
use App\Models\Sermon;
use App\Models\SocialProject;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ComprehensiveSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();
        $provinces = Province::all();
        $groupTypes = HomogeneousGroupType::all();

        foreach ($provinces as $province) {
            $this->command->info("Seeding data for {$province->name}...");

            // 1. Regions & Zones
            $region = Region::firstOrCreate(
                ['slug' => Str::slug($province->name . ' Regional')],
                [
                    'province_id' => $province->id,
                    'name'        => $province->name . ' Regional',
                    'status'      => 'active',
                ]
            );

            $zone = Zone::firstOrCreate(
                ['slug' => Str::slug($province->name . ' Central')],
                [
                    'region_id' => $region->id,
                    'name'      => $province->name . ' Central',
                    'status'    => 'active',
                ]
            );

            // 2. Churches
            $churchName = "MAO " . $province->name . " Sede";
            $church = Church::firstOrCreate(
                ['slug' => Str::slug($churchName)],
                [
                    'province_id'  => $province->id,
                    'region_id'    => $region->id,
                    'zone_id'      => $zone->id,
                    'name'         => $churchName,
                    'type'         => 'church',
                    'address'      => "Av. Principal de " . $province->name,
                    'pastor_name'  => "Pr. " . fake('pt_PT')->name(),
                    'phone'        => "+258 8" . rand(2, 7) . " " . rand(100, 999) . " " . rand(1000, 9999),
                    'service_times' => [
                        ['day' => 'sun', 'time' => '09:00', 'label' => 'Culto de Adoração'],
                        ['day' => 'wed', 'time' => '18:30', 'label' => 'Estudo Bíblico'],
                    ],
                    'status'       => 'active',
                    'founded_at'   => now()->subYears(rand(5, 20))->format('Y-m-d'),
                ]
            );

            // 3. Church Programs
            foreach ($groupTypes as $gt) {
                ChurchProgram::firstOrCreate(
                    ['church_id' => $church->id, 'group_type_id' => $gt->id],
                    [
                        'name'        => $gt->name . " " . $province->name,
                        'day_of_week' => ['sat', 'sun', 'wed', 'fri'][rand(0, 3)],
                        'start_time'  => '15:00',
                        'end_time'    => '17:00',
                        'frequency'   => 'weekly',
                        'status'      => 'active',
                    ]
                );
            }

            // 4. Events
            Event::create([
                'scope_type'           => 'province',
                'scope_id'             => $province->id,
                'title'                => "Conferência Provincial de " . $province->name,
                'slug'                 => Str::slug("conf-prov-{$province->slug}-" . now()->year),
                'type'                 => 'conference',
                'starts_at'            => now()->addMonths(rand(1, 3))->format('Y-m-d H:i:s'),
                'location'             => $church->name,
                'is_online'            => false,
                'registration_required'=> true,
                'status'               => 'published',
                'description'          => "Um tempo de renovação para toda a província de {$province->name}.",
            ]);

            // 5. News
            News::create([
                'user_id'      => $admin->id,
                'scope_type'   => 'province',
                'scope_id'     => $province->id,
                'title'        => "Crescimento da Obra em " . $province->name,
                'slug'         => Str::slug("crescimento-{$province->slug}-" . now()->timestamp),
                'excerpt'      => "Novas frentes de trabalho abertas na província.",
                'body'         => "<p>O trabalho em {$province->name} tem avançado com a graça de Deus.</p>",
                'status'       => 'published',
                'published_at' => now()->subDays(rand(1, 30)),
            ]);

            // 6. Sermons
            Sermon::create([
                'scope_type'      => 'province',
                'scope_id'        => $province->id,
                'speaker_name'    => $church->pastor_name,
                'title'           => "A Mensagem de Esperança em " . $province->name,
                'preached_at'     => now()->subWeeks(rand(1, 4)),
                'status'          => 'published',
                'description'     => "Palavra ministrada na sede provincial.",
            ]);

            // 7. Missionaries
            $missionary = Missionary::create([
                'full_name'      => "Miss. " . fake('pt_PT')->name(),
                'province_id'    => $province->id,
                'status'         => 'active',
                'specialization' => 'Plantação de Igrejas',
                'phone'          => $church->phone,
                'email'          => Str::slug($province->name) . ".mission@mao.org.mz",
                'bio'            => "Dedicado ao campo missionário em {$province->name}.",
                'needs'          => "Apoio para transporte e materiais didácticos.",
            ]);

            // 8. Social Projects
            SocialProject::create([
                'province_id' => $province->id,
                'name'        => "Projecto Esperança " . $province->name,
                'category'    => ['family', 'education', 'health'][rand(0, 2)],
                'status'      => 'active',
                'description' => "Apoio a famílias carenciadas em {$province->name}.",
            ]);
        }

        $this->command->info("Seeding national data...");

        // National Events & Documents
        Event::create([
            'scope_type'           => 'national',
            'title'                => 'Assembleia Geral MAO 2026',
            'slug'                 => 'assembleia-geral-2026',
            'type'                 => 'other',
            'starts_at'            => '2026-11-20 09:00:00',
            'location'             => 'Sede Nacional, Maputo',
            'status'               => 'published',
        ]);

        Document::create([
            'title'        => 'Plano Estratégico 2026-2030',
            'category'     => 'regulation',
            'file_url'     => 'documents/plano-estrategico.pdf',
            'is_public'    => true,
            'published_at' => now(),
        ]);
    }
}
