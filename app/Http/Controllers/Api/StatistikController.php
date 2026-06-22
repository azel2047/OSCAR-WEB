<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class StatistikController extends Controller
{
    use ApiResponse;

    public function peta(Request $request)
    {
        $lombaId = $request->lomba_id;

        $query = Pendaftaran::whereIn('status', ['pending', 'diverifikasi'])
            ->when($lombaId, fn($q, $v) => $q->where('lomba_id', $v));

        $pendaftaran = $query->get(['data_peserta', 'lomba_id']);

        $sebaran = [];
        foreach ($pendaftaran as $p) {
            $asal = $p->data_peserta['asal_sekolah']
                 ?? $p->data_peserta['asal_universitas']
                 ?? '';
            $provinsi = $this->resolveProvinsi($asal);

            if (!isset($sebaran[$provinsi])) {
                $sebaran[$provinsi] = ['provinsi' => $provinsi, 'total' => 0];
            }
            $sebaran[$provinsi]['total']++;
        }

        $result = collect(array_values($sebaran))->sortByDesc('total')->values();

        return $this->success([
            'total'   => $pendaftaran->count(),
            'sebaran' => $result,
        ]);
    }

    private function resolveProvinsi(string $asal): string
    {
        $asal = strtolower($asal);

        $mapping = [
            'Jawa Timur'       => ['surabaya','malang','sidoarjo','gresik','mojokerto','kediri','blitar','madiun','jember','banyuwangi','pasuruan','probolinggo','lumajang','jombang','nganjuk','tuban','lamongan','bojonegoro'],
            'Jawa Barat'       => ['bandung','bekasi','depok','bogor','cimahi','tasikmalaya','cirebon','sukabumi','karawang','purwakarta','cianjur','garut','subang','indramayu','majalengka','sumedang','kuningan'],
            'Jawa Tengah'      => ['semarang','solo','surakarta','yogyakarta','magelang','salatiga','klaten','boyolali','kudus','jepara','demak','kendal','batang','pekalongan','tegal','brebes','purwokerto','cilacap','purworejo'],
            'DKI Jakarta'      => ['jakarta','tangerang','kepulauan seribu'],
            'Banten'           => ['serang','cilegon','pandeglang','lebak'],
            'Sumatera Utara'   => ['medan','binjai','tebing tinggi','pematangsiantar','sibolga','tanjungbalai','padangsidempuan','gunungsitoli','deli serdang','langkat'],
            'Sumatera Barat'   => ['padang','bukittinggi','payakumbuh','pariaman','sawahlunto','solok'],
            'Sumatera Selatan' => ['palembang','prabumulih','pagar alam','lubuklinggau'],
            'Riau'             => ['pekanbaru','dumai','bengkalis','siak','kampar'],
            'Kepulauan Riau'   => ['batam','tanjungpinang','bintan','karimun'],
            'Lampung'          => ['bandar lampung','metro','lampung'],
            'Kalimantan Timur' => ['samarinda','balikpapan','bontang','kutai'],
            'Kalimantan Selatan'=> ['banjarmasin','banjarbaru','martapura'],
            'Kalimantan Barat' => ['pontianak','singkawang'],
            'Sulawesi Selatan' => ['makassar','parepare','palopo','gowa','maros','bone'],
            'Sulawesi Utara'   => ['manado','bitung','tomohon','kotamobagu'],
            'Bali'             => ['denpasar','badung','gianyar','tabanan','singaraja','klungkung'],
            'Nusa Tenggara Barat' => ['mataram','bima','sumbawa','lombok'],
            'Papua'            => ['jayapura','sorong','manokwari','timika'],
            'Maluku'           => ['ambon','ternate','tidore'],
            'Aceh'             => ['banda aceh','lhokseumawe','langsa','sabang','aceh'],
            'Bengkulu'         => ['bengkulu'],
            'Jambi'            => ['jambi'],
            'Bangka Belitung'  => ['pangkalpinang','bangka','belitung'],
            'Gorontalo'        => ['gorontalo'],
            'Sulawesi Tengah'  => ['palu','poso','luwuk'],
            'Sulawesi Tenggara'=> ['kendari','baubau'],
            'Sulawesi Barat'   => ['mamuju'],
            'Nusa Tenggara Timur' => ['kupang','ende','flores','ntt'],
            'Kalimantan Tengah'=> ['palangkaraya','sampit'],
            'Kalimantan Utara' => ['tarakan','nunukan','tanjung selor'],
            'DI Yogyakarta'    => ['yogyakarta','sleman','bantul','kulonprogo','gunungkidul','jogja'],
        ];

        foreach ($mapping as $provinsi => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($asal, $keyword)) {
                    return $provinsi;
                }
            }
        }

        return 'Lainnya';
    }
}
