<?php
 
namespace App\Policies;
 
use App\Models\User;
use App\Models\Config;
 
class ConfigPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'po', 'sc', 'event', 'humas', 'bendahara', 'sekretaris']);
    }
 
    public function view(User $user, Config $model): bool
    {
        return in_array($user->role, ['admin', 'po', 'sc', 'event', 'humas', 'bendahara', 'sekretaris']);
    }
 
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }
 
    public function update(User $user, Config $model): bool
    {
        if ($user->role === 'admin') {
            return true;
        }
        return $model->key === 'booklet_url' && in_array($user->role, ['po', 'sc', 'event', 'humas', 'sekretaris']);
    }
 
    public function delete(User $user, Config $model): bool
    {
        return $user->role === 'admin';
    }
}
