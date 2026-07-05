<?php

namespace Database\Seeders;

use App\Models\HomogeneousGroupType;
use App\Models\SitePage;
use Illuminate\Database\Seeder;

class SitePageSeeder extends Seeder
{
    public function run(): void
    {
        $homens = HomogeneousGroupType::where('slug', 'grupo-homogeneo-de-homens')->first();

        SitePage::updateOrCreate(
            ['slug' => 'sobre'],
            [
                'group_type_id' => null,
                'title' => 'Quem Somos',
                'template' => 'about',
                'hero_image' => null,
                'excerpt' => 'Uma comunidade comprometida com o Evangelho, a unidade da Igreja e a transformação de Moçambique.',
                'content' => '<p>O Ministério Alfa e Ômega existe para proclamar Jesus Cristo com fidelidade, formar discípulos e servir as comunidades com amor, verdade e esperança.</p>',
                'sections' => [
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
                ],
                'whatsapp_number' => null,
                'is_published' => true,
            ]
        );

        if ($homens) {
            SitePage::updateOrCreate(
                ['slug' => 'grupo-homogeneo-de-homens'],
                [
                    'group_type_id' => $homens->id,
                    'title' => 'Grupo Homogéneo de Homens',
                    'template' => 'homogeneous_group',
                    'hero_image' => null,
                    'excerpt' => 'Uma página dedicada à visão, missão e actividades do Grupo Homogéneo de Homens.',
                    'content' => '<p>O Grupo Homogéneo de Homens promove discipulado, comunhão, serviço e crescimento espiritual dos homens na igreja local, fortalecendo o seu papel na família, na sociedade e na missão.</p>',
                    'sections' => [
                        'homogeneous_group' => [
                            'scripture_highlights' => [
                                [
                                    'label' => '1Rs 2:1',
                                    'url' => 'https://www.bible.com/pt/bible/1608/1KI.2.1',
                                ],
                                [
                                    'label' => 'Ef 5:25-28,33',
                                    'url' => 'https://www.bible.com/pt/bible/1608/EPH.5.25-28,33',
                                ],
                            ],
                            'key_points' => [
                                ['title' => 'Propósito', 'body' => 'Fortalecer a comunhão, o discipulado e a missão dos homens no contexto da igreja local.'],
                                ['title' => 'Encontros', 'body' => 'Promover reuniões, estudos, oração e iniciativas práticas que edifiquem os participantes.'],
                                ['title' => 'Impacto', 'body' => 'Criar acompanhamento espiritual consistente e gerar serviço relevante dentro e fora da igreja.'],
                            ],
                            'cta_heading' => 'Queres saber mais?',
                            'cta_body' => 'Fala com a liderança do grupo para conhecer actividades, encontros e formas de participação.',
                            'cta_button_label' => 'Falar no WhatsApp',
                        ],
                    ],
                    'whatsapp_number' => $homens->whatsapp_number,
                    'is_published' => true,
                ]
            );
        }

        SitePage::updateOrCreate(
            ['slug' => 'estrutura-da-igreja'],
            [
                'group_type_id' => null,
                'title' => 'Estrutura da Igreja',
                'template' => 'church_structure',
                'hero_image' => null,
                'excerpt' => 'Uma visão clara da liderança, das áreas de serviço e da forma como caminhamos juntos como corpo.',
                'content' => '<p>A estrutura da Igreja existe para servir a missão, fortalecer a unidade e garantir acompanhamento espiritual saudável em todos os níveis.</p>',
                'sections' => [
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
                ],
                'whatsapp_number' => null,
                'is_published' => true,
            ]
        );
    }
}
