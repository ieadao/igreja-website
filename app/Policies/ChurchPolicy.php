<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\Church;
use Illuminate\Auth\Access\HandlesAuthorization;

class ChurchPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:Church');
    }

    public function view(AuthUser $authUser, Church $church): bool
    {
        return $authUser->can('View:Church');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:Church');
    }

    public function update(AuthUser $authUser, Church $church): bool
    {
        return $authUser->can('Update:Church');
    }

    public function delete(AuthUser $authUser, Church $church): bool
    {
        return $authUser->can('Delete:Church');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:Church');
    }

    public function restore(AuthUser $authUser, Church $church): bool
    {
        return $authUser->can('Restore:Church');
    }

    public function forceDelete(AuthUser $authUser, Church $church): bool
    {
        return $authUser->can('ForceDelete:Church');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:Church');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:Church');
    }

    public function replicate(AuthUser $authUser, Church $church): bool
    {
        return $authUser->can('Replicate:Church');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:Church');
    }

}