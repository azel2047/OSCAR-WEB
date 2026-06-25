<?php
 
namespace App\Policies;
 
use App\Models\User;
use App\Models\Config;
 
class ConfigPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }
 
    public function view(User $user, Config $model): bool
    {
        return $user->role === 'admin';
    }
 
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }
 
    public function update(User $user, Config $model): bool
    {
        return $user->role === 'admin';
    }
 
    public function delete(User $user, Config $model): bool
    {
        return $user->role === 'admin';
    }
}
