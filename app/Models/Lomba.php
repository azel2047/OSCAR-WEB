<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Lomba extends Model
{
    protected $table = 'lomba';

    protected $fillable = [
        'nama',
        'slug',
        'kategori',
        'deskripsi',
        'persyaratan',
        'ketentuan',
        'hadiah_1',
        'hadiah_2',
        'hadiah_3',
        'benefit',
        'deadline',
        'kuota',
        'status',
        'booklet_path',
        'banner_path',
        'surat_izin_path',
        'tema_list',
        'booklet_upload',
        'banner_upload',
    ];

    protected $casts = [
        'deadline'  => 'datetime',
        'tema_list' => 'array',
    ];

    protected $appends = [
        'terdaftar',
        'booklet_url',
        'banner_url',
        'surat_izin_url',
    ];

    public function mitra(): BelongsToMany
    {
        return $this->belongsToMany(Mitra::class, 'lomba_mitra');
    }

    public function faq(): HasMany
    {
        return $this->hasMany(FaqLomba::class)->orderBy('urutan');
    }

    public function timelineLomba(): HasMany
    {
        return $this->hasMany(TimelineLomba::class)->orderBy('urutan');
    }

    public function pendaftaran(): HasMany
    {
        return $this->hasMany(Pendaftaran::class);
    }

    public function getTerdaftarAttribute(): int
    {
        return $this->pendaftaran()->whereIn('status', ['pending', 'diverifikasi'])->count();
    }

    public function getBookletUrlAttribute(): ?string
    {
        if (empty($this->booklet_path)) {
            return null;
        }
        if (str_starts_with($this->booklet_path, 'http://') || str_starts_with($this->booklet_path, 'https://')) {
            return $this->booklet_path;
        }
        if (file_exists(public_path('storage/' . $this->booklet_path))) {
            return asset('storage/' . $this->booklet_path);
        }
        $supabaseUrl = rtrim(env('SUPABASE_URL'), '/');
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');
        return "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$this->booklet_path}";
    }

    public function getSuratIzinUrlAttribute(): ?string
    {
        if (empty($this->surat_izin_path)) {
            return null;
        }
        if (str_starts_with($this->surat_izin_path, 'http://') || str_starts_with($this->surat_izin_path, 'https://')) {
            return $this->surat_izin_path;
        }
        if (file_exists(public_path('storage/' . $this->surat_izin_path))) {
            return asset('storage/' . $this->surat_izin_path);
        }
        $supabaseUrl = rtrim(env('SUPABASE_URL'), '/');
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');
        return "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$this->surat_izin_path}";
    }

    public function getBannerUrlAttribute(): ?string
    {
        if (empty($this->banner_path)) {
            return null;
        }
        if (str_starts_with($this->banner_path, 'http://') || str_starts_with($this->banner_path, 'https://')) {
            if (preg_match('/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/', $this->banner_path, $matches)) {
                return "https://lh3.googleusercontent.com/d/" . $matches[1];
            }
            if (preg_match('/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/', $this->banner_path, $matches)) {
                return "https://lh3.googleusercontent.com/d/" . $matches[1];
            }
            return $this->banner_path;
        }
        if (file_exists(public_path('storage/' . $this->banner_path))) {
            return asset('storage/' . $this->banner_path);
        }
        $supabaseUrl = rtrim(env('SUPABASE_URL'), '/');
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');
        return "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$this->banner_path}";
    }

    public function isKuotaPenuh(): bool
    {
        return $this->kuota > 0 && $this->terdaftar >= $this->kuota;
    }

    public function isDeadlineLewat(): bool
    {
        return now()->isAfter($this->deadline);
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->nama);
            }
        });
    }

    public function setBookletUploadAttribute($value)
    {
        if ($value) {
            $this->attributes['booklet_path'] = is_array($value) ? array_values($value)[0] : $value;
        }
    }

    public function setBannerUploadAttribute($value)
    {
        if ($value) {
            $this->attributes['banner_path'] = is_array($value) ? array_values($value)[0] : $value;
        }
    }
}

