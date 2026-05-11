<?php

namespace Database\Seeders;

use App\Models\Church;
use App\Models\MissionReport;
use App\Models\Missionary;
use App\Models\ProjectImpact;
use App\Models\Province;
use App\Models\SocialProject;
use Illuminate\Database\Seeder;

class MissionsSeeder extends Seeder
{
    public function run(): void
    {
        $maputo  = Province::where('slug', 'maputo-cidade')->firstOrFail();
        $nampula = Province::where('slug', 'nampula')->firstOrFail();
        $sofala  = Province::where('slug', 'sofala')->firstOrFail();
        $gaza    = Province::where('slug', 'gaza')->firstOrFail();
        $zambezia = Province::where('slug', 'zambezia')->firstOrFail();

        $churchSomm    = Church::where('slug', 'mao-sommerschield')->first();
        $churchMatola  = Church::where('slug', 'mao-matola')->first();
        $churchNampula = Church::where('slug', 'mao-nampula-central')->first();

        // ── MISSIONARIES ────────────────────────────────────────────────────

        $missionaries = [
            [
                'full_name'      => 'Elias Cumbe',
                'province_id'    => $nampula->id,
                'church_id'      => $churchNampula?->id,
                'status'         => 'active',
                'specialization' => 'Evangelismo e plantação de igrejas',
                'phone'          => '+258 84 401 0001',
                'email'          => 'elias.cumbe@mao.org.mz',
                'started_at'     => '2018-03-01',
                'bio'            => 'Missionário há mais de 8 anos nas províncias do norte de Moçambique. Plantou 4 congregações nos distritos rurais de Nampula.',
                'needs'          => 'Transporte para alcançar comunidades rurais, materiais de evangelismo em língua makua.',
            ],
            [
                'full_name'      => 'Graça Tamele',
                'province_id'    => $gaza->id,
                'church_id'      => null,
                'status'         => 'active',
                'specialization' => 'Missão entre mulheres e famílias',
                'phone'          => '+258 82 501 0002',
                'email'          => 'graca.tamele@mao.org.mz',
                'started_at'     => '2020-07-15',
                'bio'            => 'Lidera um programa de discipleship para mulheres em situação de vulnerabilidade na Província de Gaza. Também coordena grupos familiares em 3 distritos.',
                'needs'          => 'Material didáctico, apoio financeiro para deslocações mensais.',
            ],
            [
                'full_name'      => 'Domingos Cossa',
                'province_id'    => $sofala->id,
                'church_id'      => null,
                'status'         => 'active',
                'specialization' => 'Evangelismo urbano e media',
                'phone'          => '+258 86 601 0003',
                'email'          => 'domingos.cossa@mao.org.mz',
                'started_at'     => '2015-01-10',
                'bio'            => 'Com mais de 10 anos de experiência, coordena acções de evangelismo na cidade da Beira e usa rádio comunitária para alcançar regiões remotas de Sofala.',
                'needs'          => 'Equipamento de gravação, apoio para produção de programa de rádio semanal.',
            ],
            [
                'full_name'      => 'Ruth Bila',
                'province_id'    => $zambezia->id,
                'church_id'      => null,
                'status'         => 'international',
                'specialization' => 'Missão transcultural e tradução bíblica',
                'phone'          => '+258 84 701 0004',
                'email'          => 'ruth.bila@mao.org.mz',
                'started_at'     => '2022-09-01',
                'bio'            => 'Missionária em parceria com uma organização internacional de tradução bíblica. Trabalha na tradução de textos bíblicos para línguas locais da Zambézia.',
                'needs'          => 'Orações pela saúde, apoio para aquisição de software de tradução.',
            ],
            [
                'full_name'      => 'Samuel Machava',
                'province_id'    => $maputo->id,
                'church_id'      => $churchSomm?->id,
                'status'         => 'active',
                'specialization' => 'Missão entre jovens e universitários',
                'phone'          => '+258 84 801 0005',
                'email'          => 'samuel.machava@mao.org.mz',
                'started_at'     => '2021-02-20',
                'bio'            => 'Coordena o ministério universitário da MAO em Maputo, alcançando estudantes em 4 universidades da capital.',
                'needs'          => 'Material de estudo bíblico para grupos universitários, apoio para eventos de evangelismo no campus.',
            ],
        ];

        $createdMissionaries = [];
        foreach ($missionaries as $data) {
            $missionary = Missionary::firstOrCreate(
                ['email' => $data['email']],
                $data
            );
            $createdMissionaries[$data['email']] = $missionary;
        }

        // ── MISSION REPORTS ──────────────────────────────────────────────────

        $reports = [
            [
                'missionary_email' => 'elias.cumbe@mao.org.mz',
                'title'            => 'Relatório Q1 2026 — Crescimento nas zonas rurais de Nampula',
                'report_date'      => '2026-03-31',
                'status'           => 'published',
                'body'             => '<p>Durante o primeiro trimestre de 2026, alcançámos 3 novas aldeias nos distritos de Meconta e Mogovolas. Foram realizados 12 cultos ao ar livre com uma participação média de 80 pessoas por culto.</p><h2>Decisões e conversões</h2><p>Registámos 47 decisões de fé e 23 pedidos de baptismo. Uma nova congregação foi estabelecida na aldeia de Namaita com 35 membros fundadores.</p><h2>Desafios</h2><p>As chuvas intensas em Fevereiro limitaram as deslocações. Necessitamos de uma mota para alcançar comunidades mais remotas.</p>',
            ],
            [
                'missionary_email' => 'elias.cumbe@mao.org.mz',
                'title'            => 'Relatório Q4 2025 — Formação de líderes locais',
                'report_date'      => '2025-12-31',
                'status'           => 'published',
                'body'             => '<p>O último trimestre de 2025 foi marcado pela formação de 8 líderes locais através de um curso intensivo de 6 semanas. Os formandos são agora responsáveis por congregações nos seus próprios bairros.</p><p>Distribuímos 200 bíblias e 150 novos testamentos nas comunidades visitadas.</p>',
            ],
            [
                'missionary_email' => 'graca.tamele@mao.org.mz',
                'title'            => 'Programa "Mulher Forte" — Relatório Semestral 2026',
                'report_date'      => '2026-04-30',
                'status'           => 'published',
                'body'             => '<p>O programa "Mulher Forte" completou o seu terceiro semestre com resultados encorajadores. Actualmente acompanhamos 68 mulheres em 5 grupos de discipleship nos distritos de Chókwè, Chibuto e Xai-Xai.</p><h2>Impacto</h2><p>12 mulheres iniciaram pequenos negócios após participar no módulo de microempreendedorismo cristão. 6 famílias foram restauradas através do programa de aconselhamento familiar.</p>',
            ],
            [
                'missionary_email' => 'domingos.cossa@mao.org.mz',
                'title'            => 'Programa de Rádio "Boa Nova FM" — Relatório Mensal Abril 2026',
                'report_date'      => '2026-04-30',
                'status'           => 'published',
                'body'             => '<p>O programa semanal "Boa Nova FM" continua a ser transmitido todos os sábados às 10h na Rádio Comunitária da Beira. No mês de Abril recebemos 23 mensagens de ouvintes, sendo 8 delas pedidos de contacto para aconselhamento pastoral.</p><p>Estimamos alcançar cerca de 15.000 ouvintes regulares nas províncias de Sofala e Manica.</p>',
            ],
            [
                'missionary_email' => 'samuel.machava@mao.org.mz',
                'title'            => 'Ministério Universitário — Relatório Q1 2026',
                'report_date'      => '2026-03-31',
                'status'           => 'draft',
                'body'             => '<p>O primeiro trimestre nas universidades foi marcado pelo início do ano académico. Estabelecemos grupos de estudo bíblico na UEM, UP, ISRI e UCM com um total de 112 estudantes inscritos.</p><p>Realizámos um evento de evangelismo no campus da UEM com 300 participantes e 18 decisões de fé.</p>',
            ],
        ];

        foreach ($reports as $data) {
            $missionary = $createdMissionaries[$data['missionary_email']] ?? null;
            if (! $missionary) {
                continue;
            }

            MissionReport::firstOrCreate(
                ['missionary_id' => $missionary->id, 'title' => $data['title']],
                [
                    'missionary_id' => $missionary->id,
                    'title'         => $data['title'],
                    'report_date'   => $data['report_date'],
                    'status'        => $data['status'],
                    'body'          => $data['body'],
                ]
            );
        }

        // ── SOCIAL PROJECTS ──────────────────────────────────────────────────

        $projects = [
            [
                'province_id' => $maputo->id,
                'name'        => 'Kits Escolares Maputo 2026',
                'category'    => 'education',
                'status'      => 'active',
                'started_at'  => '2026-01-15',
                'ended_at'    => null,
                'description' => 'Distribuição anual de material escolar a crianças de famílias carenciadas nos bairros periféricos de Maputo. Parceria com igrejas locais e doadores individuais.',
                'impacts'     => [
                    ['metric_name' => 'Crianças beneficiadas', 'metric_value' => 320, 'recorded_at' => '2026-02-10'],
                    ['metric_name' => 'Kits distribuídos',    'metric_value' => 320, 'recorded_at' => '2026-02-10'],
                    ['metric_name' => 'Escolas parceiras',    'metric_value' => 8,   'recorded_at' => '2026-02-10'],
                ],
            ],
            [
                'province_id' => $nampula->id,
                'name'        => 'Kits Escolares Nampula 2026',
                'category'    => 'education',
                'status'      => 'active',
                'started_at'  => '2026-01-20',
                'ended_at'    => null,
                'description' => 'Extensão do programa de kits escolares para a Província de Nampula, com foco nos distritos rurais de Meconta e Mogovolas.',
                'impacts'     => [
                    ['metric_name' => 'Crianças beneficiadas', 'metric_value' => 420, 'recorded_at' => '2026-02-15'],
                    ['metric_name' => 'Distritos abrangidos',  'metric_value' => 3,   'recorded_at' => '2026-02-15'],
                ],
            ],
            [
                'province_id' => $gaza->id,
                'name'        => 'Apoio a Famílias Vulneráveis — Gaza',
                'category'    => 'family',
                'status'      => 'active',
                'started_at'  => '2025-06-01',
                'ended_at'    => null,
                'description' => 'Programa de apoio alimentar, psicológico e espiritual a famílias vulneráveis afectadas por situações de pobreza extrema e violência doméstica na Província de Gaza.',
                'impacts'     => [
                    ['metric_name' => 'Famílias acompanhadas',       'metric_value' => 68,  'recorded_at' => '2026-04-30'],
                    ['metric_name' => 'Sessões de aconselhamento',   'metric_value' => 145, 'recorded_at' => '2026-04-30'],
                    ['metric_name' => 'Cestas básicas distribuídas', 'metric_value' => 204, 'recorded_at' => '2026-04-30'],
                ],
            ],
            [
                'province_id' => $sofala->id,
                'name'        => 'Clínica Comunitária Beira',
                'category'    => 'health',
                'status'      => 'completed',
                'started_at'  => '2024-03-01',
                'ended_at'    => '2025-12-31',
                'description' => 'Projecto de parceria com uma ONG de saúde para oferecer consultas gratuitas, rastreio de doenças e educação para a saúde às comunidades em torno da Igreja MAO Beira.',
                'impacts'     => [
                    ['metric_name' => 'Consultas realizadas',         'metric_value' => 1840, 'recorded_at' => '2025-12-31'],
                    ['metric_name' => 'Pacientes rastreados HIV/SIDA','metric_value' => 620,  'recorded_at' => '2025-12-31'],
                    ['metric_name' => 'Sessões de educação em saúde', 'metric_value' => 48,   'recorded_at' => '2025-12-31'],
                ],
            ],
            [
                'province_id' => $zambezia->id,
                'name'        => 'Escola de Alfabetização — Zambézia',
                'category'    => 'education',
                'status'      => 'paused',
                'started_at'  => '2023-08-01',
                'ended_at'    => null,
                'description' => 'Escola de alfabetização de adultos que funcionou durante 2 anos na Zambézia, actualmente em pausa por falta de financiamento. Visa retomar actividades em 2027.',
                'impacts'     => [
                    ['metric_name' => 'Adultos alfabetizados', 'metric_value' => 112, 'recorded_at' => '2025-06-30'],
                    ['metric_name' => 'Turmas funcionais',     'metric_value' => 4,   'recorded_at' => '2025-06-30'],
                ],
            ],
        ];

        $projectCount = 0;
        $impactCount  = 0;

        foreach ($projects as $data) {
            $impacts = $data['impacts'];
            unset($data['impacts']);

            $project = SocialProject::firstOrCreate(
                ['name' => $data['name'], 'province_id' => $data['province_id']],
                $data
            );

            $projectCount++;

            foreach ($impacts as $impact) {
                $exists = ProjectImpact::where('project_id', $project->id)
                    ->where('metric_name', $impact['metric_name'])
                    ->where('recorded_at', $impact['recorded_at'])
                    ->exists();

                if (! $exists) {
                    ProjectImpact::create(array_merge($impact, ['project_id' => $project->id]));
                    $impactCount++;
                }
            }
        }

        $this->command->info(sprintf(
            'Missions seeded: %d missionaries, %d reports, %d social projects, %d impact records',
            count($missionaries), count($reports), $projectCount, $impactCount
        ));
    }
}
