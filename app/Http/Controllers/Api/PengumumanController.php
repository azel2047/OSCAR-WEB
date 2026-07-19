<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengumuman;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PengumumanController extends Controller
{
    use ApiResponse;

    public function indexPeserta(Request $request)
    {
        $user = $request->user();

        $lombaIds = $user->pendaftaran()
            ->where('status', 'diverifikasi')
            ->pluck('lomba_id');

        $query = Pengumuman::where(function ($q) use ($lombaIds, $user) {
            $q->where('target', 'semua')
              ->orWhere('target', $user->kategori)
              ->orWhere(fn($sub) =>
                $sub->where('target', 'per_lomba')
                    ->whereIn('lomba_id', $lombaIds)
              );
        })
        ->where(fn($q) =>
            $q->whereNull('publish_at')->orWhere('publish_at', '<=', now())
        )
        ->with('lomba')
        ->latest();

        return $this->paginated($query->paginate(10));
    }

    public function showPeserta(Request $request, int $id)
    {
        $user  = $request->user();
        $lombaIds = $user->pendaftaran()->where('status', 'diverifikasi')->pluck('lomba_id');

        $pengumuman = Pengumuman::where(function ($q) use ($lombaIds, $user) {
            $q->where('target', 'semua')
              ->orWhere('target', $user->kategori)
              ->orWhere(fn($sub) =>
                $sub->where('target', 'per_lomba')->whereIn('lomba_id', $lombaIds)
              );
        })
        ->where(fn($q) => $q->whereNull('publish_at')->orWhere('publish_at', '<=', now()))
        ->findOrFail($id);

        return $this->success($pengumuman->load('lomba'));
    }
}
