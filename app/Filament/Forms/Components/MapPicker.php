<?php

namespace App\Filament\Forms\Components;

use Filament\Forms\Components\Field;

/**
 * Leaflet/OpenStreetMap picker. Holds ['lat' => ..., 'lng' => ...] as its own
 * (non-dehydrated) state and mirrors it into the form's `lat`/`lng` fields.
 */
class MapPicker extends Field
{
    protected string $view = 'filament.forms.components.map-picker';

    protected function setUp(): void
    {
        parent::setUp();

        $this->dehydrated(false)
            ->live()
            ->afterStateHydrated(function (MapPicker $component, $get) {
                $component->state([
                    'lat' => $get('lat'),
                    'lng' => $get('lng'),
                ]);
            })
            ->afterStateUpdated(function ($state, $set) {
                $set('lat', $state['lat'] ?? null);
                $set('lng', $state['lng'] ?? null);
            });
    }
}
