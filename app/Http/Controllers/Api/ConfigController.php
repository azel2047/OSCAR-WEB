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
        $value = $config?->value ?? null;

        if ($key === 'booklet_url' && !empty($value)) {
            if (!str_starts_with($value, 'http://') && !str_starts_with($value, 'https://')) {
                // If it is stored as 'booklets/filename.pdf' or similar, check public storage path
                if (file_exists(public_path('storage/' . $value))) {
                    $value = asset('storage/' . $value);
                } else if (file_exists(public_path($value))) {
                    $value = asset($value);
                } else {
                    $supabaseUrl = env('SUPABASE_URL');
                    if (!empty($supabaseUrl)) {
                        $supabaseUrl = rtrim($supabaseUrl, '/');
                        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');
                        $value = "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$value}";
                    } else {
                        $value = asset('storage/' . $value);
                    }
                }
            }
        }

        return $this->success([
            'key'   => $key,
            'value' => $value,
        ]);
    }
}
