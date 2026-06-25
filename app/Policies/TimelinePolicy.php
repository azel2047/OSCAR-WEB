<?php
 
namespace App\Policies;
 
use App\Models\User;
use App\Models\Timeline;
 
class TimelinePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('timeline', 'view');
    }
 
    public function view(User $user, Timeline $model): bool
    {
        return $user->hasPermission('timeline', 'view');
    }
 
    public function create(User $user): bool
    {
        return $user->hasPermission('timeline', 'create');
    }
 
    public function update(User $user, Timeline $model): bool
    {
        return $user->hasPermission('timeline', 'update');
    }
 
    public function delete(User $user, Timeline $model): bool
    {
        return $user->hasPermission('timeline', 'delete');
    }
}
