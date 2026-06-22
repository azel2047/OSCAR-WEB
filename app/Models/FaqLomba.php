<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FaqLomba extends Model
{
    protected $table = 'faq_lomba';

    protected $fillable = [
        'lomba_id',
        'pertanyaan',
        'jawaban',
        'urutan',
    ];

    public function lomba(): BelongsTo
    {
        return $this->belongsTo(Lomba::class);
    }
}
