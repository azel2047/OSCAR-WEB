<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\VerifikasiRequest;
use App\Http\Resources\AdminPendaftaranDetailResource;
use App\Mail\PendaftaranDiverifikasiEmail;
use App\Mail\PendaftaranDitolakEmail;
use App\Models\Notifikasi;
use App\Models\Pendaftaran;
use App\Models\StatusHistory;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AdminPendaftaranController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Pendaftaran::with(['user', 'lomba', 'berkas'])
            ->when($request->status,        fn($q, $v) => $q->where('status', $v))
            ->when($request->lomba_id,      fn($q, $v) => $q->where('lomba_id', $v))
            ->when($request->tanggal_mulai, fn($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($request->tanggal_akhir, fn($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->when($request->search, fn($q, $v) =>
                $q->where('nomor', 'like', "%$v%")
                  ->orWhereHas('user', fn($u) => $u->where('nama', 'like', "%$v%"))
            )
            ->latest();

        return $this->paginated($query->paginate(20));
    }

    public function show(int $id)
    {
        $p = Pendaftaran::with(['user', 'lomba', 'berkas', 'statusHistory.changedBy'])->findOrFail($id);
        return $this->success(new AdminPendaftaranDetailResource($p));
    }

    public function verifikasi(VerifikasiRequest $request, int $id)
    {
        $pendaftaran = Pendaftaran::with(['user', 'lomba'])->findOrFail($id);

        if ($pendaftaran->status !== 'pending') {
            return $this->error('Hanya pendaftaran berstatus pending yang bisa diverifikasi', 422);
        }

        $action  = $request->action;
        $catatan = $request->catatan;
        $status  = $action === 'terima' ? 'diverifikasi' : 'ditolak';

        DB::transaction(function () use ($pendaftaran, $action, $catatan, $status, $request) {
            $pendaftaran->update([
                'status'        => $status,
                'catatan_admin' => $catatan,
                'verified_at'   => now(),
                'verified_by'   => $request->user()->id,
            ]);

            StatusHistory::create([
                'pendaftaran_id' => $pendaftaran->id,
                'status'         => $status,
                'keterangan'     => $catatan ?? ($action === 'terima' ? 'Diverifikasi oleh admin' : null),
                'changed_by'     => $request->user()->id,
            ]);

            Notifikasi::create([
                'user_id'      => $pendaftaran->user_id,
                'judul'        => $action === 'terima' ? 'Pendaftaran Diverifikasi' : 'Pendaftaran Ditolak',
                'pesan'        => $action === 'terima'
                    ? "Selamat! Pendaftaran Anda untuk {$pendaftaran->lomba->nama} telah diverifikasi."
                    : "Pendaftaran Anda untuk {$pendaftaran->lomba->nama} ditolak. Alasan: {$catatan}",
                'tipe'         => $action === 'terima' ? 'success' : 'error',
                'related_type' => 'pendaftaran',
                'related_id'   => $pendaftaran->id,
            ]);
        });

        $emailClass = $action === 'terima'
            ? PendaftaranDiverifikasiEmail::class
            : PendaftaranDitolakEmail::class;
            
        Mail::to($pendaftaran->user->email)->queue(new $emailClass($pendaftaran));

        return $this->success(
            new AdminPendaftaranDetailResource(
                $pendaftaran->fresh()->load(['user', 'lomba', 'statusHistory'])
            ),
            $action === 'terima' ? 'Pendaftaran diverifikasi' : 'Pendaftaran ditolak'
        );
    }
}
