<?php
 
namespace App\Policies;
 
use App\Models\User;
use App\Models\Mitra;
 
class MitraPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('mitra', 'view');
    }
 
    public function view(User $user, Mitra $model): bool
    {
        return $user->hasPermission('mitra', 'view');
    }
 
    public function create(User $user): bool
    {
        return $user->hasPermission('mitra', 'create');
    }
 
    public function update(User $user, Mitra $model): bool
    {
        return $user->hasPermission('mitra', 'update');
    }
 
    public function delete(User $user, Mitra $model): bool
    {
        return $user->hasPermission('mitra', 'delete');
    }
}
