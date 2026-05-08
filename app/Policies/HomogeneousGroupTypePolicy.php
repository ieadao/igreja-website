<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\HomogeneousGroupType;
use Illuminate\Auth\Access\HandlesAuthorization;

class HomogeneousGroupTypePolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:HomogeneousGroupType');
    }

    public function view(AuthUser $authUser, HomogeneousGroupType $homogeneousGroupType): bool
    {
        return $authUser->can('View:HomogeneousGroupType');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:HomogeneousGroupType');
    }

    public function update(AuthUser $authUser, HomogeneousGroupType $homogeneousGroupType): bool
    {
        return $authUser->can('Update:HomogeneousGroupType');
    }

    public function delete(AuthUser $authUser, HomogeneousGroupType $homogeneousGroupType): bool
    {
        return $authUser->can('Delete:HomogeneousGroupType');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:HomogeneousGroupType');
    }

    public function restore(AuthUser $authUser, HomogeneousGroupType $homogeneousGroupType): bool
    {
        return $authUser->can('Restore:HomogeneousGroupType');
    }

    public function forceDelete(AuthUser $authUser, HomogeneousGroupType $homogeneousGroupType): bool
    {
        return $authUser->can('ForceDelete:HomogeneousGroupType');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:HomogeneousGroupType');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:HomogeneousGroupType');
    }

    public function replicate(AuthUser $authUser, HomogeneousGroupType $homogeneousGroupType): bool
    {
        return $authUser->can('Replicate:HomogeneousGroupType');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:HomogeneousGroupType');
    }

}