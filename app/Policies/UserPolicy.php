<?php
 
namespace App\Policies;
 
use App\Models\User;
 
class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('pengguna', 'view');
    }
 
    public function view(User $user, User $model): bool
    {
        return $user->hasPermission('pengguna', 'view');
    }
 
    public function create(User $user): bool
    {
        return $user->hasPermission('pengguna', 'create');
    }
 
    public function update(User $user, User $model): bool
    {
        return $user->hasPermission('pengguna', 'update');
    }
 
    public function delete(User $user, User $model): bool
    {
        return $user->hasPermission('pengguna', 'delete');
    }
}
