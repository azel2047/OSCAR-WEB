<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSeasonRequest;
use App\Http\Resources\SeasonResource;
use App\Models\GaleriSeason;
use App\Models\PemenangSeason;
use App\Models\Season;
use App\Services\SupabaseStorageService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminRoadmapController extends Controller
{
    use ApiResponse;

    protected SupabaseStorageService $storage;

    public function __construct(SupabaseStorageService $storage)
    {
        $this->storage = $storage;
    }

    public function index()
    {
        $seasons = Season::with(['galeri', 'pemenang'])->orderBy('urutan')->get();
        return $this->success(SeasonResource::collection($seasons));
    }

    public function show(int $id)
    {
        $season = Season::with(['galeri', 'pemenang'])->findOrFail($id);
        return $this->success(new SeasonResource($season));
    }

    public function store(StoreSeasonRequest $request)
    {
        $data = $request->validated();
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');

        if ($request->hasFile('foto_utama')) {
            $data['foto_utama'] = $this->storage->upload(
                $bucket, 'season/foto_utama', $request->file('foto_utama')
            );
        }

        $season = Season::create($data);

        // Upload gallery files if sent
        if ($request->hasFile('galeri')) {
            foreach ($request->file('galeri') as $i => $foto) {
                $path = $this->storage->upload($bucket, "season/galeri/{$season->id}", $foto);
                GaleriSeason::create([
                    'season_id' => $season->id,
                    'path'      => $path,
                    'caption'   => $request->galeri_caption[$i] ?? null,
                    'urutan'    => $i + 1,
                ]);
            }
        }

        // Save winners if sent
        if ($request->has('pemenang')) {
            foreach ($request->pemenang as $i => $p) {
                PemenangSeason::create([
                    'season_id' => $season->id,
                    'nama_lomba'=> $p['nama_lomba'],
                    'juara_1'   => $p['juara_1'],
                    'juara_2'   => $p['juara_2'] ?? null,
                    'juara_3'   => $p['juara_3'] ?? null,
                    'urutan'    => $i + 1,
                ]);
            }
        }

        return $this->success(
            new SeasonResource($season->load(['galeri', 'pemenang'])),
            'Season berhasil dibuat', 201
        );
    }

    public function update(StoreSeasonRequest $request, int $id)
    {
        $season = Season::findOrFail($id);
        $data   = $request->validated();
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');

        if ($request->hasFile('foto_utama')) {
            if ($season->foto_utama) {
                $this->storage->delete($bucket, $season->foto_utama);
            }
            $data['foto_utama'] = $this->storage->upload(
                $bucket, 'season/foto_utama', $request->file('foto_utama')
            );
        }

        $season->update($data);

        return $this->success(
            new SeasonResource($season->fresh()->load(['galeri', 'pemenang'])),
            'Season berhasil diupdate'
        );
    }

    public function destroy(int $id)
    {
        $season = Season::with('galeri')->findOrFail($id);
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');

        DB::transaction(function () use ($season, $bucket) {
            foreach ($season->galeri as $g) {
                $this->storage->delete($bucket, $g->path);
            }
            if ($season->foto_utama) {
                $this->storage->delete($bucket, $season->foto_utama);
            }
            $season->delete();
        });

        return $this->success(null, 'Season berhasil dihapus');
    }

    // ── Galeri ──────────────────────────────────────────────────

    public function addGaleri(Request $request, int $id)
    {
        $season = Season::findOrFail($id);
        $request->validate([
            'foto'    => 'required|array|min:1',
            'foto.*'  => 'file|mimes:jpg,jpeg,png,webp|max:3072',
            'caption' => 'nullable|array',
        ]);

        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');
        $added = [];

        foreach ($request->file('foto') as $i => $foto) {
            $path = $this->storage->upload($bucket, "season/galeri/{$season->id}", $foto);
            $g    = GaleriSeason::create([
                'season_id' => $season->id,
                'path'      => $path,
                'caption'   => $request->caption[$i] ?? null,
                'urutan'    => $season->galeri()->max('urutan') + $i + 1,
            ]);
            $added[] = ['id' => $g->id, 'url' => $g->url, 'caption' => $g->caption];
        }

        return $this->success($added, count($added) . ' foto berhasil ditambahkan', 201);
    }

    public function deleteGaleri(int $id, int $galeriId)
    {
        $galeri = GaleriSeason::where('season_id', $id)->findOrFail($galeriId);
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');

        $this->storage->delete($bucket, $galeri->path);
        $galeri->delete();

        return $this->success(null, 'Foto galeri berhasil dihapus');
    }

    // ── Pemenang ────────────────────────────────────────────────

    public function storePemenang(Request $request, int $id)
    {
        $season = Season::findOrFail($id);
        $request->validate([
            'nama_lomba' => 'required|string|max:80',
            'juara_1'    => 'required|string|max:150',
            'juara_2'    => 'nullable|string|max:150',
            'juara_3'    => 'nullable|string|max:150',
            'urutan'     => 'nullable|integer',
        ]);

        $pemenang = PemenangSeason::create([
            'season_id'  => $season->id,
            'nama_lomba' => $request->nama_lomba,
            'juara_1'    => $request->juara_1,
            'juara_2'    => $request->juara_2,
            'juara_3'    => $request->juara_3,
            'urutan'     => $request->urutan ?? ($season->pemenang()->max('urutan') + 1),
        ]);

        return $this->success($pemenang, 'Data pemenang berhasil ditambahkan', 201);
    }

    public function updatePemenang(Request $request, int $id, int $pId)
    {
        $pemenang = PemenangSeason::where('season_id', $id)->findOrFail($pId);
        $request->validate([
            'nama_lomba' => 'sometimes|string|max:80',
            'juara_1'    => 'sometimes|string|max:150',
            'juara_2'    => 'nullable|string|max:150',
            'juara_3'    => 'nullable|string|max:150',
            'urutan'     => 'nullable|integer',
        ]);
        $pemenang->update($request->only('nama_lomba', 'juara_1', 'juara_2', 'juara_3', 'urutan'));
        return $this->success($pemenang, 'Data pemenang berhasil diupdate');
    }

    public function destroyPemenang(int $id, int $pId)
    {
        PemenangSeason::where('season_id', $id)->findOrFail($pId)->delete();
        return $this->success(null, 'Data pemenang berhasil dihapus');
    }

    public function allGaleri()
    {
        $galeri = GaleriSeason::with('season')->orderBy('created_at', 'desc')->get();
        return $this->success($galeri);
    }

    public function addGaleriFromGlobal(Request $request)
    {
        $request->validate([
            'season_id' => 'required|exists:seasons,id',
            'foto'      => 'required|array|min:1',
            'foto.*'    => 'file|mimes:jpg,jpeg,png,webp|max:3072',
            'caption'   => 'nullable|array',
        ]);

        return $this->addGaleri($request, $request->season_id);
    }

    public function deleteGaleriGlobal(int $id)
    {
        $galeri = GaleriSeason::findOrFail($id);
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');

        $this->storage->delete($bucket, $galeri->path);
        $galeri->delete();

        return $this->success(null, 'Foto galeri berhasil dihapus');
    }
}
