<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\FamilyGroup;
use Illuminate\Auth\Access\HandlesAuthorization;

class FamilyGroupPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:FamilyGroup');
    }

    public function view(AuthUser $authUser, FamilyGroup $familyGroup): bool
    {
        return $authUser->can('View:FamilyGroup');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:FamilyGroup');
    }

    public function update(AuthUser $authUser, FamilyGroup $familyGroup): bool
    {
        return $authUser->can('Update:FamilyGroup');
    }

    public function delete(AuthUser $authUser, FamilyGroup $familyGroup): bool
    {
        return $authUser->can('Delete:FamilyGroup');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:FamilyGroup');
    }

    public function restore(AuthUser $authUser, FamilyGroup $familyGroup): bool
    {
        return $authUser->can('Restore:FamilyGroup');
    }

    public function forceDelete(AuthUser $authUser, FamilyGroup $familyGroup): bool
    {
        return $authUser->can('ForceDelete:FamilyGroup');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:FamilyGroup');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:FamilyGroup');
    }

    public function replicate(AuthUser $authUser, FamilyGroup $familyGroup): bool
    {
        return $authUser->can('Replicate:FamilyGroup');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:FamilyGroup');
    }

}