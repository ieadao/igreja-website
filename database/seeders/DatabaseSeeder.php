<?php

namespace Database\Seeders;

use App\Models\HomogeneousGroupType;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            HomogeneousGroupTypeSeeder::class,
            SitePageSeeder::class,
        ]);

        // Só semeia os menus quando ainda não existem, para não apagar
        // alterações feitas no menu builder do painel (o MenuSeeder faz
        // delete de tudo; para repor de propósito: db:seed --class=MenuSeeder)
        if (\Datlechin\FilamentMenuBuilder\Models\Menu::count() === 0) {
            $this->call(MenuSeeder::class);
        }

        // firstOrCreate: não reescreve a password se a conta já existir
        $admin = User::firstOrCreate(
            ['email' => 'wiltonbaltazar@gmail.com'],
            [
                'name' => 'Wilton Baltazar',
                'password' => 'wilton17',
            ],
        );
        $admin->assignRole('super_admin');
    }
}
