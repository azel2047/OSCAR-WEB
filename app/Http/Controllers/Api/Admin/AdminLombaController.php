<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLombaRequest;
use App\Http\Resources\LombaDetailResource;
use App\Models\FaqLomba;
use App\Models\Lomba;
use App\Models\TimelineLomba;
use App\Services\SupabaseStorageService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AdminLombaController extends Controller
{
    use ApiResponse;

    protected SupabaseStorageService $storage;

    public function __construct(SupabaseStorageService $storage)
    {
        $this->storage = $storage;
    }

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Lomba::class);
        $query = Lomba::withCount([
            'pendaftaran as total_daftar',
            'pendaftaran as pending_count' => fn($q) => $q->where('status', 'pending'),
        ])
            ->when($request->status,   fn($q, $v) => $q->where('status', $v))
            ->when($request->kategori, fn($q, $v) => $q->where('kategori', $v))
            ->when($request->search,   fn($q, $v) => $q->where('nama', 'like', "%$v%"))
            ->latest();

        return $this->paginated($query->paginate(15));
    }

    public function show(int $id)
    {
        $lomba = Lomba::with(['mitra', 'faq', 'timelineLomba'])->findOrFail($id);
        Gate::authorize('view', $lomba);
        return $this->success(new LombaDetailResource($lomba));
    }

    public function store(StoreLombaRequest $request)
    {
        Gate::authorize('create', Lomba::class);
        $data = $request->validated();
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');

        if ($request->hasFile('banner')) {
            $data['banner_path'] = $this->storage->upload(
                $bucket, 'lomba/banner', $request->file('banner')
            );
        }
        if ($request->hasFile('booklet')) {
            $data['booklet_path'] = $this->storage->upload(
                $bucket, 'lomba/booklet', $request->file('booklet')
            );
        }

        $lomba = Lomba::create($data);

        if ($request->has('mitra_ids')) {
            $lomba->mitra()->sync($request->mitra_ids);
        }

        if ($request->has('faq')) {
            foreach ($request->faq as $i => $f) {
                FaqLomba::create([
                    'lomba_id'   => $lomba->id,
                    'pertanyaan' => $f['pertanyaan'],
                    'jawaban'    => $f['jawaban'],
                    'urutan'     => $i + 1,
                ]);
            }
        }

        if ($request->has('timeline')) {
            foreach ($request->timeline as $i => $t) {
                TimelineLomba::create([
                    'lomba_id'   => $lomba->id,
                    'stage'      => $t['stage'],
                    'tanggal'    => $t['tanggal'],
                    'keterangan' => $t['keterangan'] ?? null,
                    'urutan'     => $i + 1,
                ]);
            }
        }

        return $this->success(
            new LombaDetailResource($lomba->load(['mitra', 'faq', 'timelineLomba'])),
            'Lomba berhasil dibuat', 201
        );
    }

    public function update(StoreLombaRequest $request, int $id)
    {
        $lomba = Lomba::findOrFail($id);
        Gate::authorize('update', $lomba);
        $data  = $request->validated();
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');

        if ($request->hasFile('banner')) {
            if ($lomba->banner_path) {
                $this->storage->delete($bucket, $lomba->banner_path);
            }
            $data['banner_path'] = $this->storage->upload(
                $bucket, 'lomba/banner', $request->file('banner')
            );
        }

        if ($request->hasFile('booklet')) {
            if ($lomba->booklet_path) {
                $this->storage->delete($bucket, $lomba->booklet_path);
            }
            $data['booklet_path'] = $this->storage->upload(
                $bucket, 'lomba/booklet', $request->file('booklet')
            );
        }

        $lomba->update($data);

        if ($request->has('mitra_ids')) {
            $lomba->mitra()->sync($request->mitra_ids);
        }

        return $this->success(
            new LombaDetailResource($lomba->fresh()->load(['mitra', 'faq', 'timelineLomba'])),
            'Lomba berhasil diupdate'
        );
    }

    public function destroy(int $id)
    {
        $lomba = Lomba::findOrFail($id);
        Gate::authorize('delete', $lomba);
        $bucket = env('SUPABASE_BUCKET_GALERI', 'galeri-season');

        if ($lomba->pendaftaran()->exists()) {
            return $this->error('Lomba tidak bisa dihapus karena sudah ada pendaftaran masuk', 422);
        }

        if ($lomba->banner_path) {
            $this->storage->delete($bucket, $lomba->banner_path);
        }
        if ($lomba->booklet_path) {
            $this->storage->delete($bucket, $lomba->booklet_path);
        }
        $lomba->delete();

        return $this->success(null, 'Lomba berhasil dihapus');
    }

    public function toggleStatus(Request $request, int $id)
    {
        $request->validate(['status' => 'required|in:draft,buka,tutup']);
        $lomba = Lomba::findOrFail($id);
        Gate::authorize('update', $lomba);
        $lomba->update(['status' => $request->status]);

        return $this->success(
            ['status' => $lomba->status],
            'Status lomba diupdate'
        );
    }

    // ── FAQ ──────────────────────────────────────────────────────

    public function storeFaq(Request $request, int $id)
    {
        $lomba = Lomba::findOrFail($id);
        Gate::authorize('update', $lomba);
        $request->validate([
            'pertanyaan' => 'required|string',
            'jawaban'    => 'required|string',
            'urutan'     => 'nullable|integer',
        ]);

        $faq = FaqLomba::create([
            'lomba_id'   => $lomba->id,
            'pertanyaan' => $request->pertanyaan,
            'jawaban'    => $request->jawaban,
            'urutan'     => $request->urutan ?? ($lomba->faq()->max('urutan') + 1),
        ]);

        return $this->success($faq, 'FAQ berhasil ditambahkan', 201);
    }

    public function updateFaq(Request $request, int $id, int $faqId)
    {
        $faq = FaqLomba::where('lomba_id', $id)->findOrFail($faqId);
        Gate::authorize('update', $faq->lomba);
        $request->validate([
            'pertanyaan' => 'sometimes|string',
            'jawaban'    => 'sometimes|string',
            'urutan'     => 'nullable|integer',
        ]);
        $faq->update($request->only('pertanyaan', 'jawaban', 'urutan'));
        return $this->success($faq, 'FAQ berhasil diupdate');
    }

    public function destroyFaq(int $id, int $faqId)
    {
        $faq = FaqLomba::where('lomba_id', $id)->findOrFail($faqId);
        Gate::authorize('update', $faq->lomba);
        $faq->delete();
        return $this->success(null, 'FAQ berhasil dihapus');
    }

    // ── Timeline per Lomba ───────────────────────────────────────

    public function storeTimeline(Request $request, int $id)
    {
        $lomba = Lomba::findOrFail($id);
        Gate::authorize('update', $lomba);
        $request->validate([
            'stage'      => 'required|string|max:100',
            'tanggal'    => 'required|date',
            'keterangan' => 'nullable|string',
            'urutan'     => 'nullable|integer',
        ]);

        $tl = TimelineLomba::create([
            'lomba_id'   => $lomba->id,
            'stage'      => $request->stage,
            'tanggal'    => $request->tanggal,
            'keterangan' => $request->keterangan,
            'urutan'     => $request->urutan ?? ($lomba->timelineLomba()->max('urutan') + 1),
        ]);

        return $this->success($tl, 'Timeline berhasil ditambahkan', 201);
    }

    public function updateTimeline(Request $request, int $id, int $tlId)
    {
        $tl = TimelineLomba::where('lomba_id', $id)->findOrFail($tlId);
        Gate::authorize('update', $tl->lomba);
        $request->validate([
            'stage'      => 'sometimes|string|max:100',
            'tanggal'    => 'sometimes|date',
            'keterangan' => 'nullable|string',
            'urutan'     => 'nullable|integer',
        ]);
        $tl->update($request->only('stage', 'tanggal', 'keterangan', 'urutan'));
        return $this->success($tl, 'Timeline berhasil diupdate');
    }

    public function destroyTimeline(int $id, int $tlId)
    {
        $tl = TimelineLomba::where('lomba_id', $id)->findOrFail($tlId);
        Gate::authorize('update', $tl->lomba);
        $tl->delete();
        return $this->success(null, 'Timeline berhasil dihapus');
    }
}
