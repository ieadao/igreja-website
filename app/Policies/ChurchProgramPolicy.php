<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\ChurchProgram;
use Illuminate\Auth\Access\HandlesAuthorization;

class ChurchProgramPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:ChurchProgram');
    }

    public function view(AuthUser $authUser, ChurchProgram $churchProgram): bool
    {
        return $authUser->can('View:ChurchProgram');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:ChurchProgram');
    }

    public function update(AuthUser $authUser, ChurchProgram $churchProgram): bool
    {
        return $authUser->can('Update:ChurchProgram');
    }

    public function delete(AuthUser $authUser, ChurchProgram $churchProgram): bool
    {
        return $authUser->can('Delete:ChurchProgram');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:ChurchProgram');
    }

    public function restore(AuthUser $authUser, ChurchProgram $churchProgram): bool
    {
        return $authUser->can('Restore:ChurchProgram');
    }

    public function forceDelete(AuthUser $authUser, ChurchProgram $churchProgram): bool
    {
        return $authUser->can('ForceDelete:ChurchProgram');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:ChurchProgram');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:ChurchProgram');
    }

    public function replicate(AuthUser $authUser, ChurchProgram $churchProgram): bool
    {
        return $authUser->can('Replicate:ChurchProgram');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:ChurchProgram');
    }

}