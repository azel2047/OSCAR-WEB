<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Config extends Model
{
    protected $table = 'config';

    protected $primaryKey = 'key';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'key',
        'value',
        'keterangan',
        'booklet_upload',
    ];

    public static function get(string $key, mixed $default = null): mixed
    {
        return static::find($key)?->value ?? $default;
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'updated_at' => now(),
            ]
        );
    }

    public function setBookletUploadAttribute($value)
    {
        \Illuminate\Support\Facades\Log::info('setBookletUploadAttribute called', ['value' => $value]);
        if ($value) {
            $this->attributes['value'] = is_array($value) ? array_values($value)[0] : $value;
        }
    }
}

