<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePendaftaranRequest;
use App\Http\Resources\PendaftaranResource;
use App\Mail\PendaftaranKonfirmasiEmail;
use App\Models\BerkasPendaftaran;
use App\Models\Lomba;
use App\Models\Notifikasi;
use App\Models\Pendaftaran;
use App\Models\StatusHistory;
use App\Services\SupabaseStorageService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class PendaftaranController extends Controller
{
    use ApiResponse;

    protected SupabaseStorageService $storage;

    public function __construct(SupabaseStorageService $storage)
    {
        $this->storage = $storage;
    }

    public function saya(Request $request)
    {
        $data = $request->user()->pendaftaran()
            ->with(['lomba', 'berkas', 'statusHistory'])
            ->latest()->get();
        return $this->success(PendaftaranResource::collection($data));
    }

    public function detail(Request $request, int $id)
    {
        $pendaftaran = $request->user()->pendaftaran()
            ->with(['lomba', 'berkas', 'statusHistory.changedBy'])
            ->findOrFail($id);
        return $this->success(new PendaftaranResource($pendaftaran));
    }

    public function store(StorePendaftaranRequest $request)
    {
        $user  = $request->user();
        $lomba = Lomba::findOrFail($request->lomba_id);

        if ($lomba->status !== 'buka') {
            return $this->error('Pendaftaran lomba ini sudah ditutup', 422);
        }
        if ($lomba->isDeadlineLewat()) {
            return $this->error('Deadline pendaftaran sudah lewat', 422);
        }
        if ($lomba->isKuotaPenuh()) {
            return $this->error('Kuota pendaftaran sudah penuh', 422);
        }
        if ($user->pendaftaran()->where('lomba_id', $lomba->id)->exists()) {
            return $this->error('Anda sudah mendaftar lomba ini', 409);
        }

        $pendaftaran = null;
        $bucket = env('SUPABASE_BUCKET_BERKAS', 'berkas-pendaftaran');

        DB::transaction(function () use ($request, $user, $lomba, $bucket, &$pendaftaran) {
            $pendaftaran = Pendaftaran::create([
                'user_id'      => $user->id,
                'lomba_id'     => $lomba->id,
                'status'       => 'pending',
                'data_peserta' => $request->getData(),
                'submitted_at' => now(),
            ]);

            foreach ($request->allFiles() as $key => $file) {
                if (str_starts_with($key, 'bukti_')) {
                    $jenis = str_replace('bukti_', '', $key);
                    
                    // Upload to Supabase Storage via service
                    $path = $this->storage->upload($bucket, "berkas/{$pendaftaran->id}", $file);

                    BerkasPendaftaran::create([
                        'pendaftaran_id' => $pendaftaran->id,
                        'jenis'          => $jenis,
                        'path'           => $path,
                        'nama_asli'      => $file->getClientOriginalName(),
                        'mime_type'      => $file->getMimeType(),
                        'ukuran'         => $file->getSize(),
                    ]);
                }
            }

            StatusHistory::create([
                'pendaftaran_id' => $pendaftaran->id,
                'status'         => 'pending',
                'keterangan'     => 'Pendaftaran dikirim oleh peserta',
                'changed_by'     => null,
            ]);

            Notifikasi::create([
                'user_id'      => $user->id,
                'judul'        => 'Pendaftaran Berhasil Dikirim',
                'pesan'        => "Pendaftaran Anda untuk lomba {$lomba->nama} dengan nomor {$pendaftaran->nomor} sedang diproses.",
                'tipe'         => 'info',
                'related_type' => 'pendaftaran',
                'related_id'   => $pendaftaran->id,
            ]);
        });

        Mail::to($user->email)->queue(new PendaftaranKonfirmasiEmail($pendaftaran));

        return $this->success(
            new PendaftaranResource($pendaftaran->load(['lomba', 'berkas'])),
            'Pendaftaran berhasil dikirim', 201
        );
    }

    public function revisi(Request $request, int $id)
    {
        $pendaftaran = $request->user()->pendaftaran()
            ->where('id', $id)->where('status', 'ditolak')->firstOrFail();

        $request->validate([
            'bukti_transfer' => 'sometimes|file|mimes:jpg,jpeg,png,pdf|max:500',
            'bukti_sosmed'   => 'sometimes|file|mimes:jpg,jpeg,png|max:500',
            'bukti_follow_medpart' => 'sometimes|file|mimes:jpg,jpeg,png|max:500',
            'bukti_follow_sponsor' => 'sometimes|file|mimes:jpg,jpeg,png|max:500',
        ]);

        $bucket = env('SUPABASE_BUCKET_BERKAS', 'berkas-pendaftaran');

        DB::transaction(function () use ($request, $pendaftaran, $bucket) {
            foreach ($request->allFiles() as $key => $file) {
                if (str_starts_with($key, 'bukti_')) {
                    $jenis = str_replace('bukti_', '', $key);
                    
                    // Delete old file
                    $old = $pendaftaran->berkas()->where('jenis', $jenis)->latest()->first();
                    if ($old) {
                        $this->storage->delete($bucket, $old->path);
                        $old->delete();
                    }

                    $path = $this->storage->upload($bucket, "berkas/{$pendaftaran->id}", $file);

                    BerkasPendaftaran::create([
                        'pendaftaran_id' => $pendaftaran->id,
                        'jenis'          => $jenis,
                        'path'           => $path,
                        'nama_asli'      => $file->getClientOriginalName(),
                        'mime_type'      => $file->getMimeType(),
                        'ukuran'         => $file->getSize(),
                    ]);
                }
            }

            $pendaftaran->update(['status' => 'pending', 'catatan_admin' => null]);

            StatusHistory::create([
                'pendaftaran_id' => $pendaftaran->id,
                'status'         => 'pending',
                'keterangan'     => 'Revisi dikirim oleh peserta',
                'changed_by'     => $request->user()->id,
            ]);
        });

        return $this->success(
            new PendaftaranResource($pendaftaran->fresh()->load(['lomba', 'berkas'])),
            'Revisi berhasil dikirim'
        );
    }
}
