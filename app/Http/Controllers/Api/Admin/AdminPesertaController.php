<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lomba;
use App\Models\Pendaftaran;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminPesertaController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Pendaftaran::with(['user', 'lomba'])
            ->when($request->lomba_id, fn($q, $v) => $q->where('lomba_id', $v))
            ->when($request->status,   fn($q, $v) => $q->where('status', $v))
            ->when($request->search,   fn($q, $v) =>
                $q->where('nomor', 'like', "%$v%")
                  ->orWhereJsonContains('data_peserta->nama_peserta_1', $v)
            )
            ->latest();

        return $this->paginated($query->paginate(50));
    }

    public function export(Request $request)
    {
        $request->validate(['lomba_id' => 'required|exists:lomba,id']);
        $lomba = Lomba::findOrFail($request->lomba_id);

        $pendaftaran = Pendaftaran::with(['user'])
            ->where('lomba_id', $lomba->id)
            ->where('status', 'diverifikasi')
            ->get();

        $filename = "peserta_{$lomba->slug}_" . now()->format('Ymd') . ".csv";
        $headers  = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($pendaftaran, $lomba) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF"); // BOM for Excel

            $header = $lomba->kategori === 'siswa'
                ? ['No','Nomor','Peserta 1','Peserta 2','Pendamping','Sekolah','No WA','Email','Tema','Tanggal Daftar']
                : ['No','Nomor','Peserta 1','Peserta 2','Peserta 3','Universitas','No WA','Email','Tema','Tanggal Daftar'];
            fputcsv($file, $header);

            foreach ($pendaftaran as $i => $p) {
                $d   = $p->data_peserta;
                $row = $lomba->kategori === 'siswa'
                    ? [$i+1, $p->nomor, $d['nama_peserta_1']??'', $d['nama_peserta_2']??'',
                       $d['nama_pendamping']??'', $d['asal_sekolah']??'',
                       $d['no_wa']??'', $d['email']??'', $d['tema']??'',
                       $p->created_at->format('d/m/Y H:i')]
                    : [$i+1, $p->nomor, $d['nama_peserta_1']??'', $d['nama_peserta_2']??'',
                       $d['nama_peserta_3']??'', $d['asal_universitas']??'',
                       $d['no_wa']??'', $d['email']??'', $d['tema']??'',
                       $p->created_at->format('d/m/Y H:i')];
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
