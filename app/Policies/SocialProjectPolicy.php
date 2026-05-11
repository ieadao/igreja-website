<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\SocialProject;
use Illuminate\Auth\Access\HandlesAuthorization;

class SocialProjectPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:SocialProject');
    }

    public function view(AuthUser $authUser, SocialProject $socialProject): bool
    {
        return $authUser->can('View:SocialProject');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:SocialProject');
    }

    public function update(AuthUser $authUser, SocialProject $socialProject): bool
    {
        return $authUser->can('Update:SocialProject');
    }

    public function delete(AuthUser $authUser, SocialProject $socialProject): bool
    {
        return $authUser->can('Delete:SocialProject');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:SocialProject');
    }

    public function restore(AuthUser $authUser, SocialProject $socialProject): bool
    {
        return $authUser->can('Restore:SocialProject');
    }

    public function forceDelete(AuthUser $authUser, SocialProject $socialProject): bool
    {
        return $authUser->can('ForceDelete:SocialProject');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:SocialProject');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:SocialProject');
    }

    public function replicate(AuthUser $authUser, SocialProject $socialProject): bool
    {
        return $authUser->can('Replicate:SocialProject');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:SocialProject');
    }

}