<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePengumumanRequest;
use App\Jobs\SendPengumumanEmail;
use App\Models\Notifikasi;
use App\Models\Pengumuman;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminPengumumanController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Pengumuman::with(['lomba', 'createdBy'])
            ->when($request->target,   fn($q, $v) => $q->where('target', $v))
            ->when($request->lomba_id, fn($q, $v) => $q->where('lomba_id', $v))
            ->when($request->search,   fn($q, $v) => $q->where('judul', 'like', "%$v%"))
            ->latest();

        return $this->paginated($query->paginate(15));
    }

    public function show(int $id)
    {
        $p = Pengumuman::with(['lomba', 'createdBy'])->findOrFail($id);
        return $this->success($p);
    }

    public function store(StorePengumumanRequest $request)
    {
        $pengumuman = Pengumuman::create([
            'judul'       => $request->judul,
            'isi'         => $request->isi,
            'target'      => $request->target,
            'lomba_id'    => $request->target === 'per_lomba' ? $request->lomba_id : null,
            'publish_at'  => $request->publish_at ?? null,
            'kirim_email' => $request->boolean('kirim_email'),
            'created_by'  => $request->user()->id,
        ]);

        if ($request->boolean('kirim_email') && $pengumuman->isPublished()) {
            SendPengumumanEmail::dispatch($pengumuman);
        }

        $this->broadcastNotifikasi($pengumuman);

        return $this->success($pengumuman->load('lomba'), 'Pengumuman berhasil dibuat', 201);
    }

    public function update(StorePengumumanRequest $request, int $id)
    {
        $pengumuman = Pengumuman::findOrFail($id);

        if ($pengumuman->email_sent) {
            return $this->error('Pengumuman yang sudah dikirim email tidak bisa diedit', 422);
        }

        $pengumuman->update([
            'judul'       => $request->judul,
            'isi'         => $request->isi,
            'target'      => $request->target,
            'lomba_id'    => $request->target === 'per_lomba' ? $request->lomba_id : null,
            'publish_at'  => $request->publish_at ?? null,
            'kirim_email' => $request->boolean('kirim_email'),
        ]);

        return $this->success($pengumuman->fresh()->load('lomba'), 'Pengumuman berhasil diupdate');
    }

    public function destroy(int $id)
    {
        $pengumuman = Pengumuman::findOrFail($id);
        $pengumuman->delete();
        return $this->success(null, 'Pengumuman berhasil dihapus');
    }

    public function kirimEmail(int $id)
    {
        $pengumuman = Pengumuman::findOrFail($id);

        if ($pengumuman->email_sent) {
            return $this->error('Email untuk pengumuman ini sudah pernah dikirim', 422);
        }

        if (!$pengumuman->isPublished()) {
            return $this->error('Pengumuman belum dipublikasikan (publish_at belum tercapai)', 422);
        }

        SendPengumumanEmail::dispatch($pengumuman);

        return $this->success(null, 'Email sedang diproses dan akan dikirim ke semua peserta');
    }

    private function broadcastNotifikasi(Pengumuman $pengumuman): void
    {
        $query = User::where('role', 'peserta');

        if ($pengumuman->target === 'per_lomba') {
            $query->whereHas('pendaftaran', fn($q) =>
                $q->where('lomba_id', $pengumuman->lomba_id)
                  ->where('status', 'diverifikasi')
            );
        } elseif (in_array($pengumuman->target, ['siswa', 'mahasiswa'])) {
            $query->where('kategori', $pengumuman->target);
        }

        $users = $query->pluck('id');

        $notifikasi = $users->map(fn($uid) => [
            'user_id'      => $uid,
            'judul'        => '[Pengumuman] ' . $pengumuman->judul,
            'pesan'        => strip_tags($pengumuman->isi),
            'tipe'         => 'info',
            'related_type' => 'pengumuman',
            'related_id'   => $pengumuman->id,
            'created_at'   => now(),
            'updated_at'   => now(),
        ])->toArray();

        foreach (array_chunk($notifikasi, 500) as $chunk) {
            Notifikasi::insert($chunk);
        }
    }
}
