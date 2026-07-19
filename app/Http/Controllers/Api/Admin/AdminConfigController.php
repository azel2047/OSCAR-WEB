<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Config as ConfigModel;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminConfigController extends Controller
{
    use ApiResponse;

    private array $allowedKeys = [
        'booklet_url',
        'wa_humas',
        'ig_handle',
        'email_kontak',
        'pendaftaran_open',
        'pengumuman_banner',
        'hero_tagline',
        'hero_subtagline',
        'hero_bg_url',
        'sponsor_text',
        'role_permissions',
    ];

    public function index()
    {
        $configs = ConfigModel::whereIn('key', $this->allowedKeys)
            ->orderBy('key')
            ->get(['key', 'value', 'keterangan', 'updated_at']);

        return $this->success($configs);
    }

    public function update(Request $request, string $key)
    {
        if (!in_array($key, $this->allowedKeys)) {
            return $this->error('Config key tidak diizinkan untuk diubah', 403);
        }

        $request->validate([
            'value'     => 'nullable|string|max:10000',
            'keterangan'=> 'nullable|string|max:255',
        ]);

        ConfigModel::updateOrCreate(
            ['key' => $key],
            [
                'value'      => $request->value,
                'keterangan' => $request->keterangan,
                'updated_at' => now(),
            ]
        );

        if ($key === 'role_permissions') {
            cache()->forget('role_permissions');
        }

        return $this->success(
            ConfigModel::find($key),
            "Config '{$key}' berhasil diupdate"
        );
    }
}
