<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BerkasPendaftaran extends Model
{
    protected $table = 'berkas_pendaftaran';

    protected $fillable = [
        'pendaftaran_id',
        'jenis',
        'path',
        'nama_asli',
        'mime_type',
        'ukuran',
    ];

    protected $appends = ['url'];

    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    public function getUrlAttribute(): ?string
    {
        if (empty($this->path)) {
            return null;
        }
        if (str_starts_with($this->path, 'http://') || str_starts_with($this->path, 'https://')) {
            return $this->path;
        }
        $supabaseUrl = rtrim(env('SUPABASE_URL'), '/');
        $bucket = env('SUPABASE_BUCKET_BERKAS', 'berkas-pendaftaran');
        return "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$this->path}";
    }
}
