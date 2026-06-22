<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pengumuman extends Model
{
    protected $table = 'pengumuman';

    protected $fillable = [
        'judul',
        'isi',
        'target',
        'lomba_id',
        'publish_at',
        'kirim_email',
        'email_sent',
        'created_by',
    ];

    protected $casts = [
        'publish_at' => 'datetime',
        'kirim_email' => 'boolean',
        'email_sent' => 'boolean',
    ];

    public function lomba(): BelongsTo
    {
        return $this->belongsTo(Lomba::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isPublished(): bool
    {
        return is_null($this->publish_at) || $this->publish_at->isPast();
    }

    public function setKirimEmailAttribute($value)
    {
        $this->attributes['kirim_email'] = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 't' : 'f';
    }

    public function setEmailSentAttribute($value)
    {
        $this->attributes['email_sent'] = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 't' : 'f';
    }
}
