<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\Missionary;
use Illuminate\Auth\Access\HandlesAuthorization;

class MissionaryPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:Missionary');
    }

    public function view(AuthUser $authUser, Missionary $missionary): bool
    {
        return $authUser->can('View:Missionary');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:Missionary');
    }

    public function update(AuthUser $authUser, Missionary $missionary): bool
    {
        return $authUser->can('Update:Missionary');
    }

    public function delete(AuthUser $authUser, Missionary $missionary): bool
    {
        return $authUser->can('Delete:Missionary');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:Missionary');
    }

    public function restore(AuthUser $authUser, Missionary $missionary): bool
    {
        return $authUser->can('Restore:Missionary');
    }

    public function forceDelete(AuthUser $authUser, Missionary $missionary): bool
    {
        return $authUser->can('ForceDelete:Missionary');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:Missionary');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:Missionary');
    }

    public function replicate(AuthUser $authUser, Missionary $missionary): bool
    {
        return $authUser->can('Replicate:Missionary');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:Missionary');
    }

}