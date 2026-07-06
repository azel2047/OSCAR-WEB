<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Mitra extends Model
{
    protected $table = 'mitra';

    protected $fillable = [
        'nama',
        'logo_path',
        'website_url',
        'urutan',
        'logo_upload',
    ];

    protected $appends = ['logo_url'];

    public function lomba(): BelongsToMany
    {
        return $this->belongsToMany(Lomba::class, 'lomba_mitra');
    }

    public function getLogoUrlAttribute(): ?string
    {
        if (empty($this->logo_path)) {
            return null;
        }
        if (str_starts_with($this->logo_path, 'http://') || str_starts_with($this->logo_path, 'https://')) {
            if (preg_match('/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/', $this->logo_path, $matches)) {
                return "https://lh3.googleusercontent.com/d/" . $matches[1];
            }
            if (preg_match('/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/', $this->logo_path, $matches)) {
                return "https://lh3.googleusercontent.com/d/" . $matches[1];
            }
            return $this->logo_path;
        }
        if (file_exists(public_path('storage/' . $this->logo_path))) {
            return asset('storage/' . $this->logo_path);
        }
        $supabaseUrl = rtrim(env('SUPABASE_URL'), '/');
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');
        return "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$this->logo_path}";
    }

    public function setLogoUploadAttribute($value)
    {
        if ($value) {
            $this->attributes['logo_path'] = is_array($value) ? array_values($value)[0] : $value;
        }
    }
}

