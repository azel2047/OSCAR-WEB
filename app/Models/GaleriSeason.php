<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GaleriSeason extends Model
{
    protected $table = 'galeri_season';

    protected $fillable = [
        'season_id',
        'path',
        'caption',
        'urutan',
    ];

    protected $appends = ['url'];

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }

    public function getUrlAttribute(): ?string
    {
        if (empty($this->path)) {
            return null;
        }
        if (str_starts_with($this->path, 'http://') || str_starts_with($this->path, 'https://')) {
            if (preg_match('/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/', $this->path, $matches)) {
                return "https://lh3.googleusercontent.com/d/" . $matches[1];
            }
            if (preg_match('/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/', $this->path, $matches)) {
                return "https://lh3.googleusercontent.com/d/" . $matches[1];
            }
            return $this->path;
        }
        if (file_exists(public_path('storage/' . $this->path))) {
            return asset('storage/' . $this->path);
        }
        $supabaseUrl = rtrim(env('SUPABASE_URL'), '/');
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');
        return "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$this->path}";
    }

    protected static function boot()
    {
        parent::boot();
        static::saved(function ($model) {
            cache()->forget('roadmap_seasons');
        });
        static::deleted(function ($model) {
            cache()->forget('roadmap_seasons');
        });
    }
}
