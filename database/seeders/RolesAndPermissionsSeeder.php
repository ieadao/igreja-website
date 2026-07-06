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
        $roles = ['super_admin', 'admin', 'province_manager', 'province_editor', 'region_leader', 'pastor', 'church_editor', 'missionary', 'viewer'];
        foreach ($roles as $name) {
            Role::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        // Ensure all permissions exist for all resources in the matrix
        $resources = [
            'Province', 'Region', 'Zone', 'Church', 'HomogeneousGroupType', 'ChurchProgram', 'FamilyGroup', 'Role',
            'Event', 'Sermon', 'News', 'Document',
            'Missionary', 'MissionReport', 'SocialProject',
            'User', 'ContactRequest', 'PartnershipRequest',
            'AccessCode', 'FinancialSupport', 'SiteLock', 'SitePage'
        ];
        $actions = ['ViewAny', 'View', 'Create', 'Update', 'Delete', 'DeleteAny',
                    'ForceDelete', 'ForceDeleteAny', 'Reorder', 'Replicate', 'Restore', 'RestoreAny'];
        foreach ($resources as $resource) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "{$action}:{$resource}", 'guard_name' => 'web']);
            }
        }

        // Helper: resolve Permission models by name
        $perms = fn (array $names) => Permission::whereIn('name', $names)->get();

        // Permission sets per resource
        $r    = fn (string $res) => ["ViewAny:{$res}", "View:{$res}"];
        $crud = fn (string $res) => ["ViewAny:{$res}", "View:{$res}", "Create:{$res}", "Update:{$res}", "Delete:{$res}", "DeleteAny:{$res}"];
        $cru  = fn (string $res) => ["ViewAny:{$res}", "View:{$res}", "Create:{$res}", "Update:{$res}"];

        // ── RBAC matrix (Phases 1–4) ─────────────────────────────────────────
        //
        // R = view only | CRUD = full | CRU = no delete | RU = no create/delete | — = no access
        //
        //               Province  Region  Zone    Church  HGType  Program  FamilyGroup  Event  Sermon  News  Doc  Missionary  MissionReport  SocialProject  User   Contact  Partnership
        // admin          R        CRUD    CRUD    CRUD    R       CRUD     CRUD         CRUD   CRUD    CRUD  CRUD  CRUD        CRUD           CRUD           CRUD   CRUD     CRUD
        // province_mgr   R        CRUD    CRUD    CRUD    R       CRUD     CRUD         CRUD   CRUD    CRUD  R     CRUD        CRUD           CRUD           CRU    CRUD     R
        // province_ed    R        R       R       R       R       —        —            CRU    CRU     CRU   R     —           —              —              —      —        —
        // region_leader  R        R       CRUD    CRUD    R       —        CRUD         —      —       —     —     —           —              —              —      —        —
        // pastor         R        R       R       R       R       CRUD     CRUD         —      —       —     —     —           —              —              —      —        —
        // church_editor  —        —       —       R       —       —        —            CRU    CRU     CRU   —     —           —              —              —      —        —   (own church only)
        // missionary     R        R       —       —       R       —        —            —      —       —     —     RU(own)     CRU(own)       —              —      —        —
        // viewer         R        R       R       R       R       —        —            —      —       —     R     —           —              —              —      —        —

        $matrix = [
            'admin' => array_merge(
                // Phase 1 — Estrutura
                $r('Province'),
                $crud('Region'), $crud('Zone'), $crud('Church'),
                $r('HomogeneousGroupType'),
                $crud('ChurchProgram'), $crud('FamilyGroup'),
                $r('Role'),
                // Phase 2 — Conteúdo
                $crud('Event'), $crud('Sermon'), $crud('News'), $crud('Document'),
                // Phase 3 — Missões & Social
                $crud('Missionary'), $crud('MissionReport'), $crud('SocialProject'),
                // Phase 4 — Utilizadores & Comunicação
                $crud('User'), $crud('ContactRequest'), $crud('PartnershipRequest'),
                // Configuração & Financeiro
                $crud('AccessCode'), $crud('FinancialSupport'), $crud('SiteLock'), $crud('SitePage')
            ),

            'province_manager' => array_merge(
                // Phase 1
                $r('Province'),
                $crud('Region'), $crud('Zone'), $crud('Church'),
                $r('HomogeneousGroupType'),
                $crud('ChurchProgram'), $crud('FamilyGroup'),
                // Phase 2
                $crud('Event'), $crud('Sermon'), $crud('News'),
                $r('Document'),
                // Phase 3
                $crud('Missionary'), $crud('MissionReport'), $crud('SocialProject'),
                // Phase 4
                $cru('User'), $crud('ContactRequest'), $r('PartnershipRequest'),
                // Financeiro (registos limitados à própria província no resource)
                $crud('FinancialSupport')
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

            'church_editor' => array_merge(
                $r('Church'),
                // Phase 2 — content scoped to own church (see resource getEloquentQuery)
                $cru('Event'), $cru('Sermon'), $cru('News')
            ),

            'missionary' => array_merge(
                // Phase 1
                $r('Province'), $r('Region'),
                $r('HomogeneousGroupType'),
                // Phase 3 — RU own profile, CRU own reports
                ['ViewAny:Missionary', 'View:Missionary', 'Update:Missionary'],
                $cru('MissionReport')
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
