<?php
 
namespace App\Policies;
 
use App\Models\User;
use App\Models\Pengumuman;
 
class PengumumanPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('pengumuman', 'view');
    }
 
    public function view(User $user, Pengumuman $model): bool
    {
        return $user->hasPermission('pengumuman', 'view');
    }
 
    public function create(User $user): bool
    {
        return $user->hasPermission('pengumuman', 'create');
    }
 
    public function update(User $user, Pengumuman $model): bool
    {
        return $user->hasPermission('pengumuman', 'update');
    }
 
    public function delete(User $user, Pengumuman $model): bool
    {
        return $user->hasPermission('pengumuman', 'delete');
    }
}
