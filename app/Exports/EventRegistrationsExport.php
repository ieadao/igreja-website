<?php

namespace App\Exports;

use App\Models\EventRegistration;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class EventRegistrationsExport implements FromQuery, WithHeadings, WithMapping, WithTitle, ShouldAutoSize
{
    public function __construct(private readonly int $eventId) {}

    public function query(): Builder
    {
        return EventRegistration::with('user')
            ->where('event_id', $this->eventId)
            ->orderBy('created_at');
    }

    public function headings(): array
    {
        return ['Nome', 'Email', 'Telefone', 'Estado', 'Inscrito em'];
    }

    public function map(mixed $row): array
    {
        return [
            $row->name,
            $row->email ?? '—',
            $row->phone ?? '—',
            match ($row->status) {
                'confirmed'  => 'Confirmado',
                'waitlisted' => 'Lista de espera',
                'cancelled'  => 'Cancelado',
                default      => $row->status,
            },
            $row->created_at->format('d/m/Y H:i'),
        ];
    }

    public function title(): string
    {
        return 'Inscrições';
    }
}
