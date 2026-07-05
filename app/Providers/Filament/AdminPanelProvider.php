<?php

namespace App\Providers\Filament;

use BezhanSalleh\FilamentShield\FilamentShieldPlugin;
use Datlechin\FilamentMenuBuilder\FilamentMenuBuilderPlugin;
use Datlechin\FilamentMenuBuilder\MenuPanel\ModelMenuPanel;
use Datlechin\FilamentMenuBuilder\MenuPanel\StaticMenuPanel;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets\AccountWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->viteTheme('resources/css/filament/admin/theme.css')
            ->login()
            ->colors([
                'primary' => Color::hex('#7B3B2A'),
            ])
            ->font('DM Sans')
            ->navigationGroups([
                'Estrutura',
                'Conteúdo',
                'Missões & Social',
                'Utilizadores & Comunicação',
                'Financeiro',
                'Configuração',
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                AccountWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->plugins([
                FilamentShieldPlugin::make(),

                FilamentMenuBuilderPlugin::make()
                    ->addLocations([
                        'main_nav'  => 'Navegação Principal',
                        'offcanvas' => 'Menu Lateral (Off-Canvas)',
                    ])
                    ->showCustomLinkPanel(true)
                    ->showCustomTextPanel(false)
                    ->addMenuPanels([
                        StaticMenuPanel::make('Páginas Principais')
                            ->add('Sobre',              '/sobre')
                            ->add('A Nossa História',   '/historia')
                            ->add('Agenda',             '/agenda')
                            ->add('Média',              '/media')
                            ->add('Missões',            '/missoes')
                            ->add('Notícias',           '/noticias')
                            ->add('Dar',                '/dar')
                            ->add('Grupos Homogéneos',   '/grupos-homogeneos')
                            ->add('Oração',             '/oracao')
                            ->add('Contacto',           '/contacto')
                            ->add('Intervenção Social', '/social')
                            ->add('Igrejas',            '/igrejas')
                            ->add('Documentos',         '/documentos')
                            ->add('Parceiros',          '/parceiros'),
                        ModelMenuPanel::make('Páginas de Site')->model(\App\Models\SitePage::class),
                    ]),
            ]);
    }
}
