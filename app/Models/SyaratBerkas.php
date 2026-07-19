<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyaratBerkas extends Model
{
    use HasFactory;

    protected $table = 'syarat_berkas';

    protected $fillable = [
        'key',
        'nama',
        'deskripsi',
        'url_target',
        'file_template',
        'is_required',
        'status',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    protected $appends = [
        'file_template_url',
    ];

    public function getFileTemplateUrlAttribute(): ?string
    {
        if (empty($this->file_template)) {
            return null;
        }
        if (str_starts_with($this->file_template, 'http://') || str_starts_with($this->file_template, 'https://')) {
            return $this->file_template;
        }
        if (file_exists(public_path('storage/' . $this->file_template))) {
            return asset('storage/' . $this->file_template);
        }
        $supabaseUrl = rtrim(env('SUPABASE_URL'), '/');
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');
        return "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$this->file_template}";
    }
}
