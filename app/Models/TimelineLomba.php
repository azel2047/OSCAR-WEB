<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimelineLomba extends Model
{
    protected $table = 'timeline_lomba';

    protected $fillable = [
        'lomba_id',
        'stage',
        'tanggal',
        'keterangan',
        'urutan',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function lomba(): BelongsTo
    {
        return $this->belongsTo(Lomba::class);
    }
}
