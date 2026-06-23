<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Season extends Model
{
    protected $table = 'seasons';

    protected $fillable = [
        'nama',
        'slug',
        'tema',
        'tahun',
        'deskripsi',
        'cerita',
        'foto_utama',
        'video_url',
        'jml_peserta',
        'jml_lomba',
        'jml_mitra',
        'urutan',
    ];

    protected $appends = ['foto_utama_url'];

    public function galeri(): HasMany
    {
        return $this->hasMany(GaleriSeason::class)->orderBy('urutan');
    }

    public function pemenang(): HasMany
    {
        return $this->hasMany(PemenangSeason::class)->orderBy('urutan');
    }

    public function getFotoUtamaUrlAttribute(): ?string
    {
        if (empty($this->foto_utama)) {
            return null;
        }
        if (str_starts_with($this->foto_utama, 'http://') || str_starts_with($this->foto_utama, 'https://')) {
            if (preg_match('/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/', $this->foto_utama, $matches)) {
                return "https://lh3.googleusercontent.com/d/" . $matches[1];
            }
            if (preg_match('/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/', $this->foto_utama, $matches)) {
                return "https://lh3.googleusercontent.com/d/" . $matches[1];
            }
            return $this->foto_utama;
        }
        if (file_exists(public_path('storage/' . $this->foto_utama))) {
            return asset('storage/' . $this->foto_utama);
        }
        $supabaseUrl = rtrim(env('SUPABASE_URL'), '/');
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');
        return "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$this->foto_utama}";
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->nama);
            }
            cache()->forget('roadmap_seasons');
        });
        static::saved(function ($model) {
            cache()->forget('roadmap_seasons');
        });
        static::deleted(function ($model) {
            cache()->forget('roadmap_seasons');
        });
    }
}
