<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pendaftaran extends Model
{
    use HasFactory;
    protected $table = 'pendaftaran';

    protected $fillable = [
        'nomor',
        'user_id',
        'lomba_id',
        'status',
        'catatan_admin',
        'data_peserta',
        'submitted_at',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'data_peserta' => 'array',
        'submitted_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lomba(): BelongsTo
    {
        return $this->belongsTo(Lomba::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function berkas(): HasMany
    {
        return $this->hasMany(BerkasPendaftaran::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(StatusHistory::class)->orderBy('created_at');
    }

    public function berkasTransfer(): ?BerkasPendaftaran
    {
        return $this->berkas->where('jenis', 'transfer')->first();
    }

    public function berkasSosmed(): ?BerkasPendaftaran
    {
        return $this->berkas->where('jenis', 'sosmed')->first();
    }

    public function berkasSosmedHima(): ?BerkasPendaftaran
    {
        return $this->berkas->where('jenis', 'sosmed_hima')->first();
    }

    public function berkasTwibbon(): ?BerkasPendaftaran
    {
        return $this->berkas->where('jenis', 'twibbon')->first();
    }

    public function berkasFollowMedpart(): ?BerkasPendaftaran
    {
        return $this->berkas->where('jenis', 'follow_medpart')->first();
    }

    public function berkasFollowSponsor(): ?BerkasPendaftaran
    {
        return $this->berkas->where('jenis', 'follow_sponsor')->first();
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->nomor)) {
                $model->nomor = static::generateNomor();
            }
        });
    }

    protected static function generateNomor(): string
    {
        $tahun = now()->year;
        $lastId = static::whereYear('created_at', $tahun)->max('id') ?? 0;
        return sprintf('OSC-%d-%04d', $tahun, $lastId + 1);
    }
}
