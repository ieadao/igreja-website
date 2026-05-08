<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\Event;
use App\Models\News;
use App\Models\Province;
use App\Models\Sermon;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();

        $maputo  = Province::where('slug', 'maputo-cidade')->first();
        $nampula = Province::where('slug', 'nampula')->first();
        $sofala  = Province::where('slug', 'sofala')->first();

        // ── EVENTS ────────────────────────────────────────────────────────────
        $events = [
            [
                'scope_type'           => 'national',
                'scope_id'             => null,
                'title'                => 'Conferência Nacional MAO 2026',
                'slug'                 => 'conferencia-nacional-mao-2026',
                'type'                 => 'conference',
                'starts_at'            => '2026-07-10 08:00:00',
                'ends_at'              => '2026-07-13 18:00:00',
                'location'             => 'Centro de Conferências Joaquim Chissano, Maputo',
                'is_online'            => false,
                'registration_required'=> true,
                'max_capacity'         => 3000,
                'status'               => 'published',
                'description'          => 'A maior conferência anual do Ministério Alfa e Ômega. Três dias de louvor, ensino e comunhão sob o tema "Firmes na Fé".',
            ],
            [
                'scope_type'           => 'province',
                'scope_id'             => $maputo?->id,
                'title'                => 'Retiro de Jovens — Maputo 2026',
                'slug'                 => 'retiro-jovens-maputo-2026',
                'type'                 => 'retreat',
                'starts_at'            => '2026-06-20 14:00:00',
                'ends_at'              => '2026-06-22 12:00:00',
                'location'             => 'Centro de Retiros Matola Rio, Maputo',
                'is_online'            => false,
                'registration_required'=> true,
                'max_capacity'         => 300,
                'status'               => 'published',
                'description'          => 'Retiro espiritual para jovens da Província de Maputo. Tema: "Uma Geração que Busca a Deus".',
            ],
            [
                'scope_type'           => 'province',
                'scope_id'             => $nampula?->id,
                'title'                => 'Culto de Evangelismo — Nampula',
                'slug'                 => 'culto-evangelismo-nampula-2026',
                'type'                 => 'service',
                'starts_at'            => '2026-06-05 18:00:00',
                'ends_at'              => '2026-06-05 21:00:00',
                'location'             => 'Praça dos Heróis, Nampula',
                'is_online'            => false,
                'registration_required'=> false,
                'status'               => 'published',
                'description'          => 'Culto ao ar livre para alcançar a cidade de Nampula com o Evangelho.',
            ],
            [
                'scope_type'           => 'national',
                'scope_id'             => null,
                'title'                => 'Semana de Oração Nacional',
                'slug'                 => 'semana-oracao-nacional-2026',
                'type'                 => 'service',
                'starts_at'            => '2026-05-18 19:00:00',
                'ends_at'              => '2026-05-24 21:00:00',
                'location'             => 'Online e nas igrejas locais',
                'is_online'            => true,
                'stream_url'           => 'https://youtube.com/@mao-mocambique',
                'registration_required'=> false,
                'status'               => 'published',
                'description'          => 'Uma semana dedicada à oração e jejum em todas as igrejas MAO de Moçambique.',
            ],
            [
                'scope_type'           => 'province',
                'scope_id'             => $sofala?->id,
                'title'                => 'Conferência de Pastores — Beira',
                'slug'                 => 'conferencia-pastores-beira-2026',
                'type'                 => 'conference',
                'starts_at'            => '2026-08-14 09:00:00',
                'ends_at'              => '2026-08-15 17:00:00',
                'location'             => 'Igreja MAO Beira Central',
                'is_online'            => false,
                'registration_required'=> true,
                'max_capacity'         => 150,
                'status'               => 'draft',
                'description'          => 'Encontro de pastores e líderes da Província de Sofala para formação e comunhão.',
            ],
        ];

        foreach ($events as $data) {
            Event::firstOrCreate(['slug' => $data['slug']], $data);
        }

        // ── SERMONS ───────────────────────────────────────────────────────────
        $sermons = [
            [
                'scope_type'      => 'national',
                'scope_id'        => null,
                'speaker_name'    => 'Pr. David Mabjaia',
                'title'           => 'Firmes na Fé em Tempos de Provação',
                'series'          => 'Firmes na Fé',
                'video_url'       => 'https://www.youtube.com/watch?v=exemplo1',
                'duration_minutes'=> 52,
                'preached_at'     => '2026-04-27',
                'status'          => 'published',
                'description'     => 'Mensagem baseada em Tiago 1:2-8 sobre perseverar na fé diante das tribulações.',
            ],
            [
                'scope_type'      => 'province',
                'scope_id'        => $maputo?->id,
                'speaker_name'    => 'Pr. António Macuácua',
                'title'           => 'O Poder da Oração Persistente',
                'series'          => null,
                'video_url'       => 'https://www.youtube.com/watch?v=exemplo2',
                'duration_minutes'=> 45,
                'preached_at'     => '2026-05-04',
                'status'          => 'published',
                'description'     => 'Lucas 18:1-8 — ensinamento sobre a parábola da viúva persistente.',
            ],
            [
                'scope_type'      => 'province',
                'scope_id'        => $nampula?->id,
                'speaker_name'    => 'Pr. José Mussa',
                'title'           => 'Identidade em Cristo',
                'series'          => 'Quem Sou Eu em Cristo',
                'video_url'       => null,
                'duration_minutes'=> 38,
                'preached_at'     => '2026-05-01',
                'status'          => 'published',
                'description'     => 'Efésios 2:1-10 — compreendendo nossa nova identidade como filhos de Deus.',
            ],
            [
                'scope_type'      => 'national',
                'scope_id'        => null,
                'speaker_name'    => 'Pr. David Mabjaia',
                'title'           => 'Chamados para Servir',
                'series'          => 'Firmes na Fé',
                'video_url'       => 'https://www.youtube.com/watch?v=exemplo3',
                'duration_minutes'=> 60,
                'preached_at'     => '2026-05-04',
                'status'          => 'published',
                'description'     => 'Marcos 10:45 — o modelo de serviço de Jesus como chamado de todo crente.',
            ],
        ];

        foreach ($sermons as $data) {
            Sermon::firstOrCreate(
                ['title' => $data['title'], 'preached_at' => $data['preached_at']],
                $data
            );
        }

        // ── NEWS ──────────────────────────────────────────────────────────────
        $now = now();

        $newsItems = [
            [
                'user_id'      => $admin?->id,
                'scope_type'   => 'national',
                'scope_id'     => null,
                'title'        => 'MAO celebra 30 anos de missão em Moçambique',
                'slug'         => 'mao-celebra-30-anos-missao-mocambique',
                'excerpt'      => 'O Ministério Alfa e Ômega completa três décadas de evangelismo, plantação de igrejas e acção social em todo o país.',
                'body'         => '<p>O Ministério Alfa e Ômega celebrou em Abril de 2026 o seu 30.º aniversário com uma série de cultos de acção de graças em todo Moçambique. Fundado em 1996 com uma única congregação em Maputo, o ministério cresceu para mais de 200 igrejas distribuídas pelas 10 províncias do país.</p><p>O pastor presidente, Pr. David Mabjaia, destacou que "tudo o que foi alcançado é fruto da fidelidade de Deus e do sacrifício dos nossos pastores, líderes e membros que plantaram sementes em todo o território nacional".</p><p>As celebrações incluíram uma conferência nacional com mais de 2.000 participantes, testemunhos de crescimento e lançamento do plano estratégico para os próximos 10 anos.</p>',
                'status'       => 'published',
                'published_at' => $now->copy()->subDays(7),
            ],
            [
                'user_id'      => $admin?->id,
                'scope_type'   => 'province',
                'scope_id'     => $maputo?->id,
                'title'        => 'Igreja MAO Sommerschield inaugura novo templo',
                'slug'         => 'mao-sommerschield-inaugura-novo-templo',
                'excerpt'      => 'A congregação de Sommerschield estreou o seu novo espaço de culto com capacidade para 500 pessoas.',
                'body'         => '<p>A Igreja MAO Sommerschield inaugurou no passado domingo o seu novo templo, um espaço moderno com capacidade para 500 pessoas sentadas. O projecto de construção durou 18 meses e contou com a contribuição de membros e parceiros da congregação.</p><p>O pastor responsável, Pr. António Macuácua, disse que "este templo é um sinal do crescimento da obra de Deus nesta cidade. Pedimos a Deus que este lugar seja uma bênção para toda a comunidade de Sommerschield".</p><p>O culto inaugural contou com a presença do pastor presidente e de delegações de várias igrejas da província.</p>',
                'status'       => 'published',
                'published_at' => $now->copy()->subDays(3),
            ],
            [
                'user_id'      => $admin?->id,
                'scope_type'   => 'province',
                'scope_id'     => $nampula?->id,
                'title'        => 'Projecto Social distribui kits escolares em Nampula',
                'slug'         => 'projecto-social-kits-escolares-nampula-2026',
                'excerpt'      => 'Mais de 400 crianças de famílias carenciadas receberam material escolar no início do ano lectivo.',
                'body'         => '<p>O projecto social da Igreja MAO Nampula Central distribuiu kits escolares a 420 crianças de famílias carenciadas no início do ano lectivo de 2026. A iniciativa faz parte do programa anual de responsabilidade social do ministério na região norte do país.</p><p>Cada kit continha cadernos, lápis, canetas, uma mochila e uniforme escolar. O pastor José Mussa sublinhou que "o nosso compromisso vai além das quatro paredes da igreja. Queremos ser luz e sal na nossa comunidade".</p>',
                'status'       => 'published',
                'published_at' => $now->copy()->subDays(14),
            ],
            [
                'user_id'      => $admin?->id,
                'scope_type'   => 'national',
                'scope_id'     => null,
                'title'        => 'Lançamento do novo website e aplicação MAO',
                'slug'         => 'lancamento-novo-website-aplicacao-mao',
                'excerpt'      => 'O Ministério Alfa e Ômega lança a sua nova plataforma digital para conectar igrejas e membros em todo Moçambique.',
                'body'         => '<p>O Ministério Alfa e Ômega lançou hoje a sua nova plataforma digital — website e aplicação móvel — que permitirá a membros, pastores e visitantes acederem a conteúdos, eventos, pregações e informações sobre as igrejas em todo Moçambique.</p><p>A plataforma inclui transmissões ao vivo, arquivo de pregações, mapa de igrejas e sistema de pedidos de oração. A aplicação está disponível para Android e iOS.</p>',
                'status'       => 'draft',
                'published_at' => null,
            ],
        ];

        foreach ($newsItems as $data) {
            News::firstOrCreate(['slug' => $data['slug']], $data);
        }

        // ── DOCUMENTS ─────────────────────────────────────────────────────────
        $documents = [
            [
                'title'        => 'Estatuto do Ministério Alfa e Ômega',
                'category'     => 'statute',
                'file_url'     => 'documents/estatuto-mao-2024.pdf',
                'file_size_kb' => 1240,
                'is_public'    => true,
                'published_at' => '2024-01-15',
            ],
            [
                'title'        => 'Regulamento Interno das Igrejas Locais',
                'category'     => 'regulation',
                'file_url'     => 'documents/regulamento-interno-2024.pdf',
                'file_size_kb' => 890,
                'is_public'    => true,
                'published_at' => '2024-03-01',
            ],
            [
                'title'        => 'Relatório Anual 2025',
                'category'     => 'report',
                'file_url'     => 'documents/relatorio-anual-2025.pdf',
                'file_size_kb' => 3200,
                'is_public'    => true,
                'published_at' => '2026-02-28',
            ],
        ];

        foreach ($documents as $data) {
            Document::firstOrCreate(['title' => $data['title']], $data);
        }

        $this->command->info(sprintf(
            'Content seeded: %d events, %d sermons, %d news, %d documents',
            count($events), count($sermons), count($newsItems), count($documents)
        ));
    }
}
