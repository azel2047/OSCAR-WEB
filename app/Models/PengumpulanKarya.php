<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PengumpulanKarya extends Model
{
    use HasFactory;

    protected $table = 'pengumpulan_karya';

    protected $fillable = [
        'user_id',
        'lomba_id',
        'pendaftaran_id',
        'email',
        'tema_lomba',
        'no_hp',
        'data_karya',
        'file_screenshot',
        'file_proposal',
    ];

    protected $casts = [
        'data_karya' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lomba(): BelongsTo
    {
        return $this->belongsTo(Lomba::class);
    }

    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class);
    }
}
