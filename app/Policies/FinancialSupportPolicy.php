<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\FinancialSupport;
use Illuminate\Auth\Access\HandlesAuthorization;

class FinancialSupportPolicy
{
    use HandlesAuthorization;

    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:FinancialSupport');
    }

    public function view(AuthUser $authUser, FinancialSupport $model): bool
    {
        return $authUser->can('View:FinancialSupport');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:FinancialSupport');
    }

    public function update(AuthUser $authUser, FinancialSupport $model): bool
    {
        return $authUser->can('Update:FinancialSupport');
    }

    public function delete(AuthUser $authUser, FinancialSupport $model): bool
    {
        return $authUser->can('Delete:FinancialSupport');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny:FinancialSupport');
    }

    public function restore(AuthUser $authUser, FinancialSupport $model): bool
    {
        return $authUser->can('Restore:FinancialSupport');
    }

    public function forceDelete(AuthUser $authUser, FinancialSupport $model): bool
    {
        return $authUser->can('ForceDelete:FinancialSupport');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:FinancialSupport');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:FinancialSupport');
    }

    public function replicate(AuthUser $authUser, FinancialSupport $model): bool
    {
        return $authUser->can('Replicate:FinancialSupport');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:FinancialSupport');
    }
}
