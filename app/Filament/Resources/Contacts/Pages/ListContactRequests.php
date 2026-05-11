<?php

namespace App\Filament\Resources\Contacts\Pages;

use App\Filament\Resources\Contacts\ContactRequestResource;
use App\Models\ContactRequest;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;

class ListContactRequests extends ListRecords
{
    protected static string $resource = ContactRequestResource::class;

    public function getTabs(): array
    {
        return [
            'all'         => Tab::make('Todos'),
            'new'         => Tab::make('Novos')
                ->badge(ContactRequest::where('status', 'new')->count())
                ->modifyQueryUsing(fn ($query) => $query->where('status', 'new')),
            'in_progress' => Tab::make('Em curso')
                ->modifyQueryUsing(fn ($query) => $query->where('status', 'in_progress')),
            'resolved'    => Tab::make('Resolvidos')
                ->modifyQueryUsing(fn ($query) => $query->where('status', 'resolved')),
            'closed'      => Tab::make('Encerrados')
                ->modifyQueryUsing(fn ($query) => $query->where('status', 'closed')),
        ];
    }
}
