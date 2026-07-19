<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasName;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser, HasName
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nama',
        'email',
        'password',
        'role',
        'kategori',
        'provinsi',
        'no_hp',
        'institusi',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function pendaftaran(): HasMany
    {
        return $this->hasMany(Pendaftaran::class);
    }

    public function notifikasi(): HasMany
    {
        return $this->hasMany(Notifikasi::class);
    }

    public function scopePeserta($query)
    {
        return $query->where('role', 'peserta');
    }

    public function scopeAdmin($query)
    {
        return $query->where('role', 'admin');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return in_array($this->role, ['admin', 'po', 'sc', 'event', 'humas', 'bendahara', 'sekretaris']);
    }

    public function getFilamentName(): string
    {
        return $this->nama ?? '';
    }

    public function isPeserta(): bool
    {
        return $this->role === 'peserta';
    }

    public function unreadNotifCount(): int
    {
        return $this->notifikasi()->where('is_read', false)->count();
    }

    public function hasPermission(string $resource, string $action): bool
    {
        if ($this->role === 'admin') {
            return true;
        }

        $permissions = cache()->rememberForever('role_permissions', function() {
            $config = \App\Models\Config::where('key', 'role_permissions')->first();
            if (!$config) {
                $default = [
                    'po' => [
                        'lomba' => ['view', 'create', 'update'],
                        'pendaftaran' => ['view', 'update'],
                        'mitra' => ['view', 'create', 'update'],
                        'timeline' => ['view', 'create', 'update'],
                        'season' => ['view', 'create', 'update'],
                        'pengumuman' => ['view', 'create', 'update'],
                        'pengguna' => ['view']
                    ],
                    'sc' => [
                        'lomba' => ['view', 'create', 'update'],
                        'pendaftaran' => ['view', 'update'],
                        'mitra' => ['view', 'create', 'update'],
                        'timeline' => ['view', 'create', 'update'],
                        'season' => ['view', 'create', 'update'],
                        'pengumuman' => ['view', 'create', 'update'],
                        'pengguna' => ['view']
                    ],
                    'event' => [
                        'lomba' => ['view', 'create', 'update'],
                        'pendaftaran' => ['view'],
                        'timeline' => ['view', 'create', 'update']
                    ],
                    'humas' => [
                        'lomba' => ['view'],
                        'mitra' => ['view', 'create', 'update'],
                        'season' => ['view', 'create', 'update'],
                        'pengumuman' => ['view', 'create', 'update']
                    ],
                    'bendahara' => [
                        'pendaftaran' => ['view', 'update'],
                        'pengguna' => ['view']
                    ],
                    'sekretaris' => [
                        'pendaftaran' => ['view', 'update'],
                        'timeline' => ['view', 'create', 'update'],
                        'pengumuman' => ['view', 'create', 'update'],
                        'pengguna' => ['view']
                    ]
                ];
                $config = \App\Models\Config::create([
                    'key' => 'role_permissions',
                    'value' => json_encode($default),
                    'keterangan' => 'Pengaturan Hak Akses Divisi (Permissions)',
                ]);
            }
            return json_decode($config->value, true) ?: [];
        });

        return isset($permissions[$this->role][$resource]) && in_array($action, $permissions[$this->role][$resource]);
    }
}
