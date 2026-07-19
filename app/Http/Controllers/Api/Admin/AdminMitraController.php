<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\MitraResource;
use App\Models\Mitra;
use App\Services\SupabaseStorageService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminMitraController extends Controller
{
    use ApiResponse;

    protected SupabaseStorageService $storage;

    public function __construct(SupabaseStorageService $storage)
    {
        $this->storage = $storage;
    }

    public function index()
    {
        $mitra = Mitra::orderBy('urutan')->get();
        return $this->success(MitraResource::collection($mitra));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama'        => 'required|string|max:100',
            'logo'        => 'required|file|mimes:jpg,jpeg,png,webp,svg|max:2048',
            'website_url' => 'nullable|url|max:255',
            'urutan'      => 'nullable|integer|min:0',
        ]);

        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');
        $logoPath = $this->storage->upload($bucket, 'mitra/logo', $request->file('logo'));

        $mitra = Mitra::create([
            'nama'        => $request->nama,
            'logo_path'   => $logoPath,
            'website_url' => $request->website_url,
            'urutan'      => $request->urutan ?? 0,
        ]);

        return $this->success(new MitraResource($mitra), 'Mitra berhasil ditambahkan', 201);
    }

    public function show(int $id)
    {
        $mitra = Mitra::findOrFail($id);
        return $this->success(new MitraResource($mitra));
    }

    public function update(Request $request, int $id)
    {
        $mitra = Mitra::findOrFail($id);
        $request->validate([
            'nama'        => 'sometimes|string|max:100',
            'logo'        => 'nullable|file|mimes:jpg,jpeg,png,webp,svg|max:2048',
            'website_url' => 'nullable|url|max:255',
            'urutan'      => 'nullable|integer|min:0',
        ]);

        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');
        $data = $request->only('nama', 'website_url', 'urutan');

        if ($request->hasFile('logo')) {
            if ($mitra->logo_path) {
                $this->storage->delete($bucket, $mitra->logo_path);
            }
            $data['logo_path'] = $this->storage->upload($bucket, 'mitra/logo', $request->file('logo'));
        }

        $mitra->update($data);

        return $this->success(new MitraResource($mitra->fresh()), 'Mitra berhasil diupdate');
    }

    public function destroy(int $id)
    {
        $mitra = Mitra::findOrFail($id);
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');

        if ($mitra->logo_path) {
            $this->storage->delete($bucket, $mitra->logo_path);
        }
        $mitra->delete();

        return $this->success(null, 'Mitra berhasil dihapus');
    }
}
