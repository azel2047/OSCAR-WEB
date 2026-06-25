<?php
 
namespace App\Policies;
 
use App\Models\User;
use App\Models\Lomba;
 
class LombaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('lomba', 'view');
    }
 
    public function view(User $user, Lomba $model): bool
    {
        return $user->hasPermission('lomba', 'view');
    }
 
    public function create(User $user): bool
    {
        return $user->hasPermission('lomba', 'create');
    }
 
    public function update(User $user, Lomba $model): bool
    {
        return $user->hasPermission('lomba', 'update');
    }
 
    public function delete(User $user, Lomba $model): bool
    {
        return $user->hasPermission('lomba', 'delete');
    }
}
