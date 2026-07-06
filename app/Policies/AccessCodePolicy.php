<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\AccessCode;
use Illuminate\Auth\Access\HandlesAuthorization;

class AccessCodePolicy
{
    use HandlesAuthorization;

    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:AccessCode');
    }

    public function view(AuthUser $authUser, AccessCode $model): bool
    {
        return $authUser->can('View:AccessCode');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:AccessCode');
    }

    public function update(AuthUser $authUser, AccessCode $model): bool
    {
        return $authUser->can('Update:AccessCode');
    }

    public function delete(AuthUser $authUser, AccessCode $model): bool
    {
        return $authUser->can('Delete:AccessCode');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:AccessCode');
    }

    public function restore(AuthUser $authUser, AccessCode $model): bool
    {
        return $authUser->can('Restore:AccessCode');
    }

    public function forceDelete(AuthUser $authUser, AccessCode $model): bool
    {
        return $authUser->can('ForceDelete:AccessCode');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:AccessCode');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:AccessCode');
    }

    public function replicate(AuthUser $authUser, AccessCode $model): bool
    {
        return $authUser->can('Replicate:AccessCode');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:AccessCode');
    }
}
