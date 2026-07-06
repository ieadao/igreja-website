<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\SiteLock;
use Illuminate\Auth\Access\HandlesAuthorization;

class SiteLockPolicy
{
    use HandlesAuthorization;

    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:SiteLock');
    }

    public function view(AuthUser $authUser, SiteLock $model): bool
    {
        return $authUser->can('View:SiteLock');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:SiteLock');
    }

    public function update(AuthUser $authUser, SiteLock $model): bool
    {
        return $authUser->can('Update:SiteLock');
    }

    public function delete(AuthUser $authUser, SiteLock $model): bool
    {
        return $authUser->can('Delete:SiteLock');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:SiteLock');
    }

    public function restore(AuthUser $authUser, SiteLock $model): bool
    {
        return $authUser->can('Restore:SiteLock');
    }

    public function forceDelete(AuthUser $authUser, SiteLock $model): bool
    {
        return $authUser->can('ForceDelete:SiteLock');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:SiteLock');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:SiteLock');
    }

    public function replicate(AuthUser $authUser, SiteLock $model): bool
    {
        return $authUser->can('Replicate:SiteLock');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:SiteLock');
    }
}
