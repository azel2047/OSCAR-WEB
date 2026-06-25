<?php
 
namespace App\Policies;
 
use App\Models\User;
use App\Models\Pendaftaran;
 
class PendaftaranPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('pendaftaran', 'view');
    }
 
    public function view(User $user, Pendaftaran $model): bool
    {
        return $user->hasPermission('pendaftaran', 'view');
    }
 
    public function create(User $user): bool
    {
        return $user->hasPermission('pendaftaran', 'create');
    }
 
    public function update(User $user, Pendaftaran $model): bool
    {
        return $user->hasPermission('pendaftaran', 'update');
    }
 
    public function delete(User $user, Pendaftaran $model): bool
    {
        return $user->hasPermission('pendaftaran', 'delete');
    }
}
