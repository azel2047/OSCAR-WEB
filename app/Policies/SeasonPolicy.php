<?php
 
namespace App\Policies;
 
use App\Models\User;
use App\Models\Season;
 
class SeasonPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('season', 'view');
    }
 
    public function view(User $user, Season $model): bool
    {
        return $user->hasPermission('season', 'view');
    }
 
    public function create(User $user): bool
    {
        return $user->hasPermission('season', 'create');
    }
 
    public function update(User $user, Season $model): bool
    {
        return $user->hasPermission('season', 'update');
    }
 
    public function delete(User $user, Season $model): bool
    {
        return $user->hasPermission('season', 'delete');
    }
}
