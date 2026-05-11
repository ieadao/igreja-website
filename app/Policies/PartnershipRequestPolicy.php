<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\PartnershipRequest;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Foundation\Auth\User as AuthUser;

class PartnershipRequestPolicy
{
    use HandlesAuthorization;

    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:PartnershipRequest');
    }

    public function view(AuthUser $authUser, PartnershipRequest $partnershipRequest): bool
    {
        return $authUser->can('View:PartnershipRequest');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:PartnershipRequest');
    }

    public function update(AuthUser $authUser, PartnershipRequest $partnershipRequest): bool
    {
        return $authUser->can('Update:PartnershipRequest');
    }

    public function delete(AuthUser $authUser, PartnershipRequest $partnershipRequest): bool
    {
        return $authUser->can('Delete:PartnershipRequest');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:PartnershipRequest');
    }

    public function restore(AuthUser $authUser, PartnershipRequest $partnershipRequest): bool
    {
        return $authUser->can('Restore:PartnershipRequest');
    }

    public function forceDelete(AuthUser $authUser, PartnershipRequest $partnershipRequest): bool
    {
        return $authUser->can('ForceDelete:PartnershipRequest');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:PartnershipRequest');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:PartnershipRequest');
    }

    public function replicate(AuthUser $authUser, PartnershipRequest $partnershipRequest): bool
    {
        return $authUser->can('Replicate:PartnershipRequest');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:PartnershipRequest');
    }
}
