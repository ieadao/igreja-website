<?php

namespace Database\Seeders;

use App\Models\Church;
use App\Models\ContactRequest;
use App\Models\FamilyGroup;
use App\Models\FinancialSupport;
use App\Models\PartnershipRequest;
use App\Models\Province;
use Illuminate\Database\Seeder;

class SupplementalSeeder extends Seeder
{
    public function run(): void
    {
        $maputo  = Province::where('slug', 'maputo-cidade')->firstOrFail();
        $nampula = Province::where('slug', 'nampula')->firstOrFail();

        $churchSomm    = Church::where('slug', 'mao-sommerschield')->firstOrFail();
        $churchMatola  = Church::where('slug', 'mao-matola')->firstOrFail();
        $churchNampula = Church::where('slug', 'mao-nampula-central')->firstOrFail();

        // ── 1. Family Groups ──────────────────────────────────────────────────

        $familyGroups = [
            [
                'church_id'    => $churchSomm->id,
                'name'         => 'Grupo Familiar Sommerschield A',
                'zone'         => 'Sommerschield',
                'leader_name'  => 'Irmão Paulo Tembe',
                'leader_phone' => '+258 84 111 0001',
                'meeting_day'  => 'fri',
                'meeting_time' => '18:30',
                'status'       => 'active',
            ],
            [
                'church_id'    => $churchSomm->id,
                'name'         => 'Grupo Familiar Polana',
                'zone'         => 'Polana',
                'leader_name'  => 'Irmã Rosa Cossa',
                'leader_phone' => '+258 84 111 0002',
                'meeting_day'  => 'thu',
                'meeting_time' => '19:00',
                'status'       => 'active',
            ],
            [
                'church_id'    => $churchMatola->id,
                'name'         => 'Grupo Familiar Matola A',
                'zone'         => 'Matola Sede',
                'leader_name'  => 'Irmão Jorge Bila',
                'leader_phone' => '+258 84 222 0001',
                'meeting_day'  => 'fri',
                'meeting_time' => '18:00',
                'status'       => 'active',
            ],
            [
                'church_id'    => $churchMatola->id,
                'name'         => 'Grupo Familiar Matola B',
                'zone'         => 'Infulene',
                'leader_name'  => 'Irmã Amélia Uache',
                'leader_phone' => '+258 84 222 0002',
                'meeting_day'  => 'wed',
                'meeting_time' => '19:00',
                'status'       => 'active',
            ],
            [
                'church_id'    => $churchNampula->id,
                'name'         => 'Grupo Familiar Nampula Centro',
                'zone'         => 'Centro',
                'leader_name'  => 'Irmão Filipe Mujovo',
                'leader_phone' => '+258 86 333 0001',
                'meeting_day'  => 'sat',
                'meeting_time' => '15:00',
                'status'       => 'active',
            ],
            [
                'church_id'    => $churchNampula->id,
                'name'         => 'Grupo Familiar Muhala',
                'zone'         => 'Muhala',
                'leader_name'  => 'Irmã Cecília Langa',
                'leader_phone' => '+258 86 333 0002',
                'meeting_day'  => 'thu',
                'meeting_time' => '18:30',
                'status'       => 'active',
            ],
        ];

        foreach ($familyGroups as $data) {
            FamilyGroup::firstOrCreate(
                ['church_id' => $data['church_id'], 'name' => $data['name']],
                $data,
            );
        }

        // ── 2. Contact Requests ───────────────────────────────────────────────

        $contacts = [
            [
                'province_id' => $maputo->id,
                'name'        => 'Maria João Machava',
                'email'       => 'mariamachava@gmail.com',
                'phone'       => '+258 84 500 0001',
                'type'        => 'general',
                'message'     => 'Gostaria de saber mais sobre os cultos de domingo e como posso participar na vida da igreja.',
                'status'      => 'new',
            ],
            [
                'province_id' => $maputo->id,
                'name'        => 'António Sitoe',
                'email'       => null,
                'phone'       => '+258 84 500 0002',
                'type'        => 'counseling',
                'message'     => 'Estou a passar por um momento difícil na minha família e gostaria de conversar com um pastor.',
                'status'      => 'in_progress',
                'response'    => 'Contactado pelo Pr. António. Sessão agendada para a semana.',
            ],
            [
                'province_id' => $maputo->id,
                'name'        => 'Esperança Cumbe',
                'email'       => 'esperanca.cumbe@outlook.com',
                'phone'       => '+258 84 500 0003',
                'type'        => 'support',
                'message'     => 'A minha família está em situação de necessidade. Precisamos de apoio alimentar urgente.',
                'status'      => 'resolved',
                'response'    => 'Família apoiada através do programa de intervenção social. Caso encerrado.',
            ],
            [
                'province_id' => $nampula->id,
                'name'        => 'Benedito Muhate',
                'email'       => 'bmuhate@yahoo.com',
                'phone'       => '+258 86 600 0001',
                'type'        => 'general',
                'message'     => 'Quero saber se há uma Igreja MAO na cidade de Nacala. Sou recém-chegado.',
                'status'      => 'new',
            ],
            [
                'province_id' => $maputo->id,
                'name'        => 'Fátima Nuvunga',
                'email'       => 'fatima.nuvunga@gmail.com',
                'phone'       => '+258 84 500 0004',
                'type'        => 'partnership',
                'message'     => 'Trabalho numa ONG de educação e gostaríamos de fazer parceria com o ministério social da igreja.',
                'status'      => 'new',
            ],
        ];

        foreach ($contacts as $data) {
            if (! ContactRequest::where('email', $data['email'] ?? '')->orWhere('phone', $data['phone'])->exists()) {
                ContactRequest::create($data);
            }
        }

        // ── 3. Partnership Requests ───────────────────────────────────────────

        $partnerships = [
            [
                'org_name'      => 'Fundação Criança Feliz',
                'contact_name'  => 'Dr. Samuel Zandamela',
                'email'         => 'samuel@criancafeliz.org.mz',
                'phone'         => '+258 21 300 001',
                'type'          => 'institutional',
                'proposal'      => 'Pretendemos estabelecer uma parceria com o Ministério Alfa e Ômega para o desenvolvimento conjunto de programas de apoio à infância vulnerável nas províncias de Maputo e Gaza. A nossa fundação tem experiência de 10 anos na área e recursos humanos especializados.',
                'status'        => 'reviewing',
            ],
            [
                'org_name'      => 'Rádio Vida FM',
                'contact_name'  => 'Anabela Macie',
                'email'         => 'anabela@radiovida.co.mz',
                'phone'         => '+258 21 400 002',
                'type'          => 'media',
                'proposal'      => 'Propomos uma parceria mediática para a transmissão semanal de pregações e eventos do ministério. Temos cobertura nacional e audiência de mais de 500 mil ouvintes.',
                'status'        => 'new',
            ],
            [
                'org_name'      => 'Instituto Teológico Emmanuel',
                'contact_name'  => 'Prof. Higino Massango',
                'email'         => 'higino.massango@ite.ac.mz',
                'phone'         => '+258 82 500 003',
                'type'          => 'theological',
                'proposal'      => 'O Instituto Teológico Emmanuel propõe um acordo de formação conjunta de líderes pastorais, com partilha de professores e reconhecimento mútuo de credenciais. Temos 3 campi em Maputo, Beira e Nampula.',
                'status'        => 'approved',
            ],
            [
                'org_name'      => 'Grupo Empresarial Visão',
                'contact_name'  => 'Eng. Domingos Cossa',
                'email'         => 'dcossa@grupovisao.co.mz',
                'phone'         => '+258 84 600 004',
                'type'          => 'business',
                'proposal'      => 'Empresa de construção civil interessada em apoiar projectos de construção de templos e instalações sociais do ministério mediante contrapartidas de visibilidade e responsabilidade social.',
                'status'        => 'new',
            ],
        ];

        foreach ($partnerships as $data) {
            PartnershipRequest::firstOrCreate(['email' => $data['email']], $data);
        }

        // ── 4. Financial Supports ─────────────────────────────────────────────

        $financialRecords = [
            // Confirmed — tithe
            [
                'province_id'    => $maputo->id,
                'name'           => 'João Machava',
                'type'           => 'tithe',
                'amount'         => 5000.00,
                'currency'       => 'MZN',
                'payment_method' => 'mpesa',
                'reference'      => 'MPESA-2026051101',
                'status'         => 'confirmed',
                'supported_at'   => now()->subDays(5),
            ],
            // Confirmed — offering
            [
                'province_id'    => $maputo->id,
                'name'           => 'Anónimo',
                'type'           => 'offering',
                'amount'         => 1500.00,
                'currency'       => 'MZN',
                'payment_method' => 'mpesa',
                'reference'      => 'MPESA-2026051102',
                'status'         => 'confirmed',
                'supported_at'   => now()->subDays(4),
            ],
            // Confirmed — mission
            [
                'province_id'    => $maputo->id,
                'name'           => 'Família Sitoe',
                'type'           => 'mission',
                'amount'         => 10000.00,
                'currency'       => 'MZN',
                'payment_method' => 'bank',
                'reference'      => 'BCI-REF-20260511',
                'destination'    => 'Fundo de Missões — Nampula',
                'status'         => 'confirmed',
                'supported_at'   => now()->subDays(3),
            ],
            // Confirmed — social
            [
                'province_id'    => $nampula->id,
                'name'           => 'Igreja MAO Nampula',
                'type'           => 'social',
                'amount'         => 25000.00,
                'currency'       => 'MZN',
                'payment_method' => 'bank',
                'reference'      => 'BNI-2026051103',
                'destination'    => 'Projecto Alimentar — Nampula Norte',
                'status'         => 'confirmed',
                'supported_at'   => now()->subDays(2),
            ],
            // Pending
            [
                'province_id'    => $maputo->id,
                'name'           => 'Esperança Cumbe',
                'type'           => 'tithe',
                'amount'         => 3000.00,
                'currency'       => 'MZN',
                'payment_method' => 'mpesa',
                'reference'      => 'MPESA-2026051104',
                'status'         => 'pending',
                'supported_at'   => now()->subDay(),
            ],
            // Pending
            [
                'province_id'    => $nampula->id,
                'name'           => 'Benedito Muhate',
                'type'           => 'offering',
                'amount'         => 500.00,
                'currency'       => 'MZN',
                'payment_method' => 'mpago',
                'reference'      => 'MPAGO-2026051105',
                'status'         => 'pending',
                'supported_at'   => now()->subHours(3),
            ],
            // Failed
            [
                'province_id'    => $maputo->id,
                'name'           => 'Carlos Nhantumbo',
                'type'           => 'offering',
                'amount'         => 2000.00,
                'currency'       => 'MZN',
                'payment_method' => 'mpesa',
                'reference'      => 'MPESA-FAIL-001',
                'status'         => 'failed',
                'supported_at'   => now()->subDays(6),
            ],
        ];

        foreach ($financialRecords as $data) {
            FinancialSupport::firstOrCreate(['reference' => $data['reference']], $data);
        }

        $this->command->info('Supplemental seed complete:');
        $this->command->info('  ' . FamilyGroup::count() . ' family groups');
        $this->command->info('  ' . ContactRequest::count() . ' contact requests');
        $this->command->info('  ' . PartnershipRequest::count() . ' partnership requests');
        $this->command->info('  ' . FinancialSupport::count() . ' financial support records');
    }
}
