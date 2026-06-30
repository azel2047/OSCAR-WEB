<?php
 
namespace App\Policies;
 
use App\Models\User;
use App\Models\SyaratBerkas;
 
class SyaratBerkasPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('syarat_berkas', 'view');
    }
 
    public function view(User $user, SyaratBerkas $model): bool
    {
        return $user->hasPermission('syarat_berkas', 'view');
    }
 
    public function create(User $user): bool
    {
        return $user->hasPermission('syarat_berkas', 'create');
    }
 
    public function update(User $user, SyaratBerkas $model): bool
    {
        return $user->hasPermission('syarat_berkas', 'update');
    }
 
    public function delete(User $user, SyaratBerkas $model): bool
    {
        return $user->hasPermission('syarat_berkas', 'delete');
    }
}
