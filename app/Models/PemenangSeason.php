<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PemenangSeason extends Model
{
    protected $table = 'pemenang_season';

    protected $fillable = [
        'season_id',
        'nama_lomba',
        'juara_1',
        'juara_2',
        'juara_3',
        'urutan',
    ];

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
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
