<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Config as ConfigModel;
use App\Traits\ApiResponse;

class ConfigController extends Controller
{
    use ApiResponse;

    private array $publicKeys = [
        'booklet_url',
        'wa_humas',
        'ig_handle',
        'email_kontak',
        'pendaftaran_open',
        'hero_tagline',
        'hero_subtagline',
        'sponsor_text',
    ];

    public function show(string $key)
    {
        if (!in_array($key, $this->publicKeys)) {
            return $this->error('Config tidak tersedia', 404);
        }

        $config = ConfigModel::find($key);
        return $this->success([
            'key'   => $key,
            'value' => $config?->value ?? null,
        ]);
    }
}
