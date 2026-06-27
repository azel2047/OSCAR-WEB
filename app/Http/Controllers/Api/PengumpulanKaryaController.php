<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\Lomba;
use App\Models\PengumpulanKarya;
use App\Services\SupabaseStorageService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PengumpulanKaryaController extends Controller
{
    use ApiResponse;

    protected SupabaseStorageService $storage;

    public function __construct(SupabaseStorageService $storage)
    {
        $this->storage = $storage;
    }

    /**
     * Get user's active verified registration and work submission (if any).
     */
    public function saya(Request $request)
    {
        $user = $request->user();
        $pendaftaranId = $request->query('pendaftaran_id');

        $query = Pendaftaran::where('user_id', $user->id)
            ->where('status', 'diverifikasi');

        if ($pendaftaranId) {
            $pendaftaran = $query->where('id', $pendaftaranId)->first();
        } else {
            // Default to the latest verified registration
            $pendaftaran = $query->with('lomba')->latest()->first();
        }

        if (!$pendaftaran) {
            return $this->success([
                'pendaftaran' => null,
                'pengumpulan' => null
            ], 'Belum ada pendaftaran yang diverifikasi.');
        }

        $pengumpulan = PengumpulanKarya::where('pendaftaran_id', $pendaftaran->id)->first();

        return $this->success([
            'pendaftaran' => $pendaftaran->load('lomba'),
            'pengumpulan' => $pengumpulan
        ]);
    }

    /**
     * Submit or update work submission.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // 1. Validate registration ownership and status
        $pendaftaran = Pendaftaran::where('user_id', $user->id)
            ->where('status', 'diverifikasi')
            ->where('id', $request->input('pendaftaran_id'))
            ->first();

        if (!$pendaftaran) {
            return $this->error('Pendaftaran tidak ditemukan atau belum diverifikasi.', 404);
        }

        $lomba = $pendaftaran->lomba;
        if (!$lomba) {
            return $this->error('Detail lomba tidak ditemukan.', 404);
        }

        $isWebDev = $lomba->slug === 'web-development' || str_contains(strtolower($lomba->nama), 'web');
        $isPosterOrInfo = in_array($lomba->slug, ['desain-poster', 'desain-infografis']) || 
                          str_contains(strtolower($lomba->nama), 'poster') || 
                          str_contains(strtolower($lomba->nama), 'infografis');

        if (!$isWebDev && !$isPosterOrInfo) {
            return $this->error('Cabang lomba ini tidak memerlukan pengumpulan karya di sistem.', 422);
        }

        $existing = PengumpulanKarya::where('pendaftaran_id', $pendaftaran->id)->first();
        $isUpdate = $existing !== null;

        // 2. Define validation rules dynamically based on category
        $rules = [
            'pendaftaran_id' => 'required|exists:pendaftaran,id',
            'email'          => 'required|email|max:100',
            'no_hp'          => ['required', 'regex:/^(\+62|62|0)8[0-9]{8,11}$/'],
            'tema_lomba'     => 'required|string|max:150',
        ];

        if ($isWebDev) {
            $rules['nama_kelompok']   = 'required|string|max:100';
            $rules['nama_pendamping'] = 'required|string|max:100';
            $rules['nama_peserta_1']  = 'required|string|max:100';
            $rules['nama_peserta_2']  = 'nullable|string|max:100';
            $rules['nama_peserta_3']  = 'nullable|string|max:100';
            $rules['nama_peserta_4']  = 'nullable|string|max:100';
            $rules['link_github']     = 'required|url|max:255';
            $rules['folder_proposal'] = 'required|string|max:255';
        } elseif ($isPosterOrInfo) {
            $rules['nama_peserta']       = 'required|string|max:100';
            $rules['nama_sekolah']       = 'required|string|max:150';
            $rules['link_karya_gdrive']  = 'required|url|max:255';
            $rules['bukti_instagram']    = ($isUpdate ? 'nullable' : 'required') . '|file|image|mimes:jpeg,jpg,png|max:500';
        }

        // Custom validation messages
        $messages = [
            'no_hp.regex'             => 'Format nomor HP tidak valid. Gunakan format 08xx atau +628xx.',
            'bukti_instagram.max'     => 'Ukuran bukti screenshot Instagram maksimal 500 KB.',
            'bukti_instagram.image'   => 'Bukti postingan Instagram harus berupa berkas gambar.',
            'bukti_instagram.mimes'   => 'Format gambar harus JPEG, JPG, atau PNG.',
            'link_github.url'         => 'Format link GitHub harus berupa URL yang valid.',
            'link_karya_gdrive.url'   => 'Format link Google Drive harus berupa URL yang valid.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422, $validator->errors());
        }

        // 3. Process uploads and database saving
        $dataKarya = [];
        $fileScreenshotPath = $existing ? $existing->file_screenshot : null;

        if ($isWebDev) {
            $dataKarya = [
                'nama_kelompok'   => $request->input('nama_kelompok'),
                'nama_pendamping' => $request->input('nama_pendamping'),
                'nama_peserta_1'  => $request->input('nama_peserta_1'),
                'nama_peserta_2'  => $request->input('nama_peserta_2'),
                'nama_peserta_3'  => $request->input('nama_peserta_3'),
                'nama_peserta_4'  => $request->input('nama_peserta_4'),
                'link_github'     => $request->input('link_github'),
                'folder_proposal' => $request->input('folder_proposal'),
            ];
        } elseif ($isPosterOrInfo) {
            $dataKarya = [
                'nama_peserta'      => $request->input('nama_peserta'),
                'nama_sekolah'      => $request->input('nama_sekolah'),
                'link_karya_gdrive' => $request->input('link_karya_gdrive'),
            ];

            if ($request->hasFile('bukti_instagram')) {
                // If update, delete old file first
                $bucket = env('SUPABASE_BUCKET_BERKAS', 'berkas-pendaftaran');
                if ($isUpdate && $existing->file_screenshot) {
                    $this->storage->delete($bucket, $existing->file_screenshot);
                }

                // Upload new screenshot
                $file = $request->file('bukti_instagram');
                $fileScreenshotPath = $this->storage->upload($bucket, "pengumpulan/{$pendaftaran->id}", $file);
            }
        }

        $submission = null;

        DB::transaction(function () use ($user, $lomba, $pendaftaran, $request, $dataKarya, $fileScreenshotPath, $existing, &$submission) {
            $submission = PengumpulanKarya::updateOrCreate(
                ['pendaftaran_id' => $pendaftaran->id],
                [
                    'user_id'         => $user->id,
                    'lomba_id'        => $lomba->id,
                    'email'           => $request->input('email'),
                    'tema_lomba'      => $request->input('tema_lomba'),
                    'no_hp'           => $request->input('no_hp'),
                    'data_karya'      => $dataKarya,
                    'file_screenshot' => $fileScreenshotPath,
                ]
            );
        });

        return $this->success(
            $submission,
            $isUpdate ? 'Karya berhasil diperbarui!' : 'Karya berhasil dikumpulkan!',
            $isUpdate ? 200 : 201
        );
    }
}
