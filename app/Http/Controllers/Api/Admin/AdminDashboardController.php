<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lomba;
use App\Models\Pendaftaran;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    use ApiResponse;

    public function overview()
    {
        // Collapse multiple pendaftaran status/date counts into a single highly optimized database query
        $stats = Pendaftaran::leftJoin('lomba', 'pendaftaran.lomba_id', '=', 'lomba.id')
            ->selectRaw("
                COUNT(CASE WHEN pendaftaran.status IN ('pending', 'diverifikasi') THEN 1 END) as total_peserta,
                COUNT(CASE WHEN pendaftaran.status = 'pending' THEN 1 END) as pending_verif,
                COUNT(CASE WHEN DATE(pendaftaran.created_at) = CURRENT_DATE THEN 1 END) as daftar_hari_ini,
                COUNT(CASE WHEN DATE(pendaftaran.created_at) = CURRENT_DATE - INTERVAL '1 day' THEN 1 END) as daftar_kemarin,
                COUNT(CASE WHEN lomba.kategori = 'siswa' THEN 1 END) as siswa,
                COUNT(CASE WHEN lomba.kategori = 'mahasiswa' THEN 1 END) as mahasiswa
            ")
            ->first();

        // 2. Fetch active lomba count (1 fast query)
        $lombaAktif = Lomba::where('status', 'buka')->count();

        // 3. Fetch participants per lomba using optimized join + groupBy
        $pesertaPerLomba = Lomba::leftJoin('pendaftaran', function($join) {
                $join->on('lomba.id', '=', 'pendaftaran.lomba_id')
                     ->whereIn('pendaftaran.status', ['pending', 'diverifikasi']);
            })
            ->select('lomba.nama', DB::raw('COUNT(pendaftaran.id) as total'))
            ->groupBy('lomba.id', 'lomba.nama')
            ->get()
            ->map(fn($l) => ['nama' => $l->nama, 'total' => (int)$l->total]);

        // 4. Fetch latest registrations (1 fast query with eager loading)
        $pendaftaranTerbaru = Pendaftaran::with(['user', 'lomba'])->latest()->limit(10)->get();

        $today = (int)($stats->daftar_hari_ini ?? 0);
        $yesterday = (int)($stats->daftar_kemarin ?? 0);

        return $this->success([
            'total_peserta'      => (int)($stats->total_peserta ?? 0),
            'pending_verif'      => (int)($stats->pending_verif ?? 0),
            'lomba_aktif'        => $lombaAktif,
            'daftar_hari_ini'    => $today,
            'delta_kemarin'      => [
                'today'     => $today,
                'yesterday' => $yesterday,
                'delta'     => $today - $yesterday
            ],
            'peserta_per_lomba'  => $pesertaPerLomba,
            'distribusi_kategori' => [
                'siswa'     => (int)($stats->siswa ?? 0),
                'mahasiswa' => (int)($stats->mahasiswa ?? 0),
            ],
            'pendaftaran_terbaru' => $pendaftaranTerbaru,
        ]);
    }

    public function pertumbuhan(Request $request)
    {
        $days = min((int)($request->days ?? 7), 30);

        $data = Pendaftaran::selectRaw('DATE(created_at) as tanggal, COUNT(*) as total')
            ->where('created_at', '>=', now()->subDays($days))
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get()
            ->keyBy('tanggal');

        $result = collect();
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $result->push(['tanggal' => $date, 'total' => $data->get($date)?->total ?? 0]);
        }

        return $this->success($result);
    }
}
