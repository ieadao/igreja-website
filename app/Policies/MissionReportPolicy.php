<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\MissionReport;
use Illuminate\Auth\Access\HandlesAuthorization;

class MissionReportPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:MissionReport');
    }

    public function view(AuthUser $authUser, MissionReport $missionReport): bool
    {
        return $authUser->can('View:MissionReport');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:MissionReport');
    }

    public function update(AuthUser $authUser, MissionReport $missionReport): bool
    {
        return $authUser->can('Update:MissionReport');
    }

    public function delete(AuthUser $authUser, MissionReport $missionReport): bool
    {
        return $authUser->can('Delete:MissionReport');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:MissionReport');
    }

    public function restore(AuthUser $authUser, MissionReport $missionReport): bool
    {
        return $authUser->can('Restore:MissionReport');
    }

    public function forceDelete(AuthUser $authUser, MissionReport $missionReport): bool
    {
        return $authUser->can('ForceDelete:MissionReport');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:MissionReport');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:MissionReport');
    }

    public function replicate(AuthUser $authUser, MissionReport $missionReport): bool
    {
        return $authUser->can('Replicate:MissionReport');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:MissionReport');
    }

}