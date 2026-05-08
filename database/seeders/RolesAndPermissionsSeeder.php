<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Ensure all roles exist
        $roles = ['super_admin', 'admin', 'province_manager', 'province_editor', 'region_leader', 'pastor', 'missionary', 'viewer'];
        foreach ($roles as $name) {
            Role::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        // Helper: resolve Permission models by name, silently skip missing ones
        $perms = fn (array $names) => Permission::whereIn('name', $names)->get();

        // Permission sets per resource
        $r    = fn (string $res) => ["ViewAny:{$res}", "View:{$res}"];
        $crud = fn (string $res) => ["ViewAny:{$res}", "View:{$res}", "Create:{$res}", "Update:{$res}", "Delete:{$res}", "DeleteAny:{$res}"];
        $cru  = fn (string $res) => ["ViewAny:{$res}", "View:{$res}", "Create:{$res}", "Update:{$res}"];

        // ── RBAC matrix (Phase 1 resources only; expand each phase) ──────────
        //
        // R = view only | CRUD = full | CRU = no delete | — = no access
        //
        //               Province  Region  Zone    Church  HGType  Program  FamilyGroup
        // admin          R        CRUD    CRUD    CRUD    R       CRUD     CRUD
        // province_mgr   R        CRUD    CRUD    CRUD    R       CRUD     CRUD
        // province_ed    R        R       R       R       R       —        —
        // region_leader  R        R       CRUD    CRUD    R       —        CRUD
        // pastor         R        R       R       R       R       CRUD     CRUD
        // missionary     R        R       —       —       R       —        —
        // viewer         R        R       R       R       R       —        —

        $matrix = [
            'admin' => array_merge(
                // Phase 1 — Estrutura
                $r('Province'),
                $crud('Region'), $crud('Zone'), $crud('Church'),
                $r('HomogeneousGroupType'),
                $crud('ChurchProgram'), $crud('FamilyGroup'),
                $r('Role'),
                // Phase 2 — Conteúdo
                $crud('Event'), $crud('Sermon'), $crud('News'), $crud('Document')
            ),

            'province_manager' => array_merge(
                // Phase 1
                $r('Province'),
                $crud('Region'), $crud('Zone'), $crud('Church'),
                $r('HomogeneousGroupType'),
                $crud('ChurchProgram'), $crud('FamilyGroup'),
                // Phase 2
                $crud('Event'), $crud('Sermon'), $crud('News'),
                $r('Document')
            ),

            'province_editor' => array_merge(
                // Phase 1
                $r('Province'), $r('Region'), $r('Zone'), $r('Church'),
                $r('HomogeneousGroupType'),
                // Phase 2
                $cru('Event'), $cru('Sermon'), $cru('News'),
                $r('Document')
            ),

            'region_leader' => array_merge(
                // Phase 1
                $r('Province'), $r('Region'),
                $crud('Zone'), $crud('Church'),
                $r('HomogeneousGroupType'),
                $crud('FamilyGroup')
            ),

            'pastor' => array_merge(
                // Phase 1
                $r('Province'), $r('Region'), $r('Zone'), $r('Church'),
                $r('HomogeneousGroupType'),
                $crud('ChurchProgram'), $crud('FamilyGroup')
            ),

            'missionary' => array_merge(
                // Phase 1
                $r('Province'), $r('Region'),
                $r('HomogeneousGroupType')
            ),

            'viewer' => array_merge(
                // Phase 1
                $r('Province'), $r('Region'), $r('Zone'), $r('Church'),
                $r('HomogeneousGroupType'),
                // Phase 2
                $r('Document')
            ),
        ];

        foreach ($matrix as $roleName => $permissionNames) {
            $role = Role::findByName($roleName);
            $role->syncPermissions($perms($permissionNames));
            $this->command->info("{$roleName}: " . count($permissionNames) . ' permissions assigned');
        }

        // super_admin gets everything
        $superAdmin = Role::findByName('super_admin');
        $superAdmin->syncPermissions(Permission::all());
        $this->command->info('super_admin: all ' . Permission::count() . ' permissions');
    }
}
