<?php

use App\Models\HomogeneousGroupType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_pages', function (Blueprint $table) {
            $table->string('template', 60)->default('about')->after('slug');
            $table->string('hero_image')->nullable()->after('template');
            $table->text('excerpt')->nullable()->after('hero_image');
            $table->json('sections')->nullable()->after('content');
        });

        DB::table('site_pages')
            ->whereNull('template')
            ->update([
                'template' => DB::raw("CASE WHEN group_type_id IS NOT NULL THEN 'homogeneous_group' ELSE 'about' END"),
            ]);

        $this->seedDefaultPages();
    }

    public function down(): void
    {
        Schema::table('site_pages', function (Blueprint $table) {
            $table->dropColumn(['template', 'hero_image', 'excerpt', 'sections']);
        });
    }

    private function seedDefaultPages(): void
    {
        $now = now();

        if (! DB::table('site_pages')->where('slug', 'sobre')->exists()) {
            DB::table('site_pages')->insert([
                'group_type_id' => null,
                'title' => 'Quem Somos',
                'slug' => 'sobre',
                'template' => 'about',
                'hero_image' => null,
                'excerpt' => 'Uma comunidade comprometida com o Evangelho, a unidade da Igreja e a transformação de Moçambique.',
                'content' => '<p>O Ministério Alfa e Ômega existe para proclamar Jesus Cristo com fidelidade, formar discípulos e servir as comunidades com amor, verdade e esperança.</p>',
                'sections' => json_encode([
                    'about' => [
                        'hero_quote' => '«O Espírito do Senhor está sobre mim, porque me ungiu para evangelizar os pobres.»',
                        'hero_reference' => 'Lucas 4:18',
                        'mission' => 'Proclamar o Evangelho de Jesus Cristo a toda Moçambique, fazendo discípulos em todas as nações, plantando igrejas e transformando comunidades através do amor incondicional de Deus.',
                        'vision' => 'Ser uma comunidade cristã comprometida com o crescimento espiritual, a unidade do corpo de Cristo e o impacto social em cada canto de Moçambique.',
                        'timeline' => [
                            ['year' => '1995', 'label' => 'Fundação', 'desc' => 'O Ministério Alfa e Ômega é fundado em Moçambique com uma visão de transformar o país para Cristo.'],
                            ['year' => '2000', 'label' => 'Expansão Provincial', 'desc' => 'Abertura das primeiras sedes provinciais em Maputo e Sofala, com crescimento acelerado de igrejas locais.'],
                            ['year' => '2005', 'label' => 'Programa de Missões', 'desc' => 'Lançamento do programa nacional de missionação, enviando os primeiros missionários às zonas rurais.'],
                            ['year' => '2010', 'label' => 'Intervenção Social', 'desc' => 'Criação dos primeiros projectos de intervenção social em educação, saúde e apoio às comunidades vulneráveis.'],
                            ['year' => '2015', 'label' => '20 Anos de Fé', 'desc' => 'Celebração de duas décadas de serviço com presença activa em várias províncias e novas igrejas plantadas.'],
                            ['year' => '2020', 'label' => 'Era Digital', 'desc' => 'Expansão do ministério para o espaço digital, alcançando crentes em todo o mundo.'],
                        ],
                        'cta_heading' => 'Faz Parte da Família',
                        'cta_body' => 'Estamos presentes em todo o país. Encontra uma igreja perto de ti.',
                        'cta_button_label' => 'Encontrar uma Igreja',
                        'cta_button_href' => '/igrejas',
                    ],
                ], JSON_UNESCAPED_UNICODE),
                'whatsapp_number' => null,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        if (! DB::table('site_pages')->where('slug', 'estrutura-da-igreja')->exists()) {
            DB::table('site_pages')->insert([
                'group_type_id' => null,
                'title' => 'Estrutura da Igreja',
                'slug' => 'estrutura-da-igreja',
                'template' => 'church_structure',
                'hero_image' => null,
                'excerpt' => 'Uma visão clara da liderança, das áreas de serviço e da forma como caminhamos juntos como corpo.',
                'content' => '<p>A estrutura da Igreja existe para servir a missão, fortalecer a unidade e garantir acompanhamento espiritual saudável em todos os níveis.</p>',
                'sections' => json_encode([
                    'church_structure' => [
                        'intro_title' => 'Como nos organizamos',
                        'intro_body' => 'Da liderança nacional às equipas locais, cada área existe para equipar santos, cuidar da Igreja e sustentar a expansão da obra.',
                        'blocks' => [
                            [
                                'type' => 'text',
                                'title' => 'Liderança Nacional',
                                'body' => '<p>A liderança nacional define direcção espiritual, doutrina e prioridades ministeriais, trabalhando em alinhamento com as províncias e igrejas locais.</p>',
                            ],
                            [
                                'type' => 'text',
                                'title' => 'Províncias, Regiões e Zonas',
                                'body' => '<p>A estrutura territorial aproxima a liderança do povo, facilita acompanhamento pastoral e cria um fluxo saudável entre visão, cuidado e execução.</p>',
                            ],
                            [
                                'type' => 'text',
                                'title' => 'Equipas e Ministérios',
                                'body' => '<p>Os ministérios, departamentos e grupos homogéneos traduzem a visão em discipulado, serviço, evangelização e cuidado prático da comunidade.</p>',
                            ],
                        ],
                    ],
                ], JSON_UNESCAPED_UNICODE),
                'whatsapp_number' => null,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        HomogeneousGroupType::query()
            ->orderBy('order')
            ->get()
            ->each(function (HomogeneousGroupType $groupType) use ($now) {
                if (DB::table('site_pages')->where('slug', $groupType->slug)->exists()) {
                    return;
                }

                $title = $groupType->name;
                $acronym = $groupType->acronym ?: str($groupType->name)->title()->explode(' ')->map(fn ($part) => mb_substr($part, 0, 1))->join('');

                DB::table('site_pages')->insert([
                    'group_type_id' => $groupType->id,
                    'title' => $title,
                    'slug' => $groupType->slug,
                    'template' => 'homogeneous_group',
                    'hero_image' => null,
                    'excerpt' => "Uma página dedicada à visão, missão e actividades do {$title}.",
                    'content' => "<p>Esta página apresenta a identidade, missão e linhas de acção do {$title}, oferecendo um espaço claro para comunicar propósito, actividades e acompanhamento espiritual.</p>",
                    'sections' => json_encode([
                        'homogeneous_group' => [
                            'scripture_badge' => $acronym,
                            'key_points' => [
                                ['title' => 'Propósito', 'body' => "Fortalecer a comunhão, o discipulado e a missão do {$title} no contexto da igreja local."],
                                ['title' => 'Encontros', 'body' => 'Promover reuniões, estudos, oração e iniciativas práticas que edifiquem os participantes.'],
                                ['title' => 'Impacto', 'body' => 'Criar acompanhamento espiritual consistente e gerar serviço relevante dentro e fora da igreja.'],
                            ],
                            'cta_heading' => 'Queres saber mais?',
                            'cta_body' => "Fala com a liderança do {$title} para conhecer actividades, encontros e formas de participação.",
                            'cta_button_label' => 'Falar no WhatsApp',
                        ],
                    ], JSON_UNESCAPED_UNICODE),
                    'whatsapp_number' => $groupType->whatsapp_number,
                    'is_published' => false,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            });
    }
};
