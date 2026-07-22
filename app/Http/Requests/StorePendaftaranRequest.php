<?php

namespace App\Http\Requests;

use App\Models\Lomba;
use Illuminate\Foundation\Http\FormRequest;

class StorePendaftaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $lomba = Lomba::find($this->lomba_id);
        $isCTF = $lomba && ($lomba->slug === 'ctf' || str_contains(strtolower($lomba->nama), 'ctf'));

        $rules = [
            'lomba_id'       => 'required|exists:lomba,id',
            'no_wa'          => ['required', 'regex:/^(\+62|62|0)8[0-9]{8,11}$/'],
            'email'          => 'required|email',
            'tema'           => $isCTF ? 'nullable|string|max:100' : 'required|string|max:100',
            'bukti_transfer' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ];

        // Validasi dinamis untuk syarat berkas
        $syaratList = \App\Models\SyaratBerkas::where('status', 'aktif')->get();
        foreach ($syaratList as $syarat) {
            $rules['bukti_' . $syarat->key] = ($syarat->is_required ? 'required' : 'nullable') . '|file|mimes:jpg,jpeg,png,pdf|max:2048';
        }

        $lomba = Lomba::find($this->lomba_id);
        if ($lomba) {
            if (in_array($lomba->slug, ['web-development'])) {
                $rules['asal_sekolah']     = 'required|string|min:3|max:150';
                $rules['nama_peserta_1']   = 'required|string|min:3|max:100';
                $rules['nama_peserta_2']   = 'nullable|string|max:100';
                $rules['nama_peserta_3']   = 'nullable|string|max:100';
                $rules['nama_peserta_4']   = 'nullable|string|max:100';
                $rules['nama_pendamping']  = 'required|string|min:3|max:100';
            } elseif (in_array($lomba->slug, ['desain-poster', 'desain-infografis'])) {
                $rules['asal_sekolah']     = 'required|string|min:3|max:150';
                $rules['nama_peserta_1']   = 'required|string|min:3|max:100';
            } elseif ($lomba->slug === 'ctf') {
                $rules['asal_universitas'] = 'required|string|min:3|max:150';
                $rules['nama_peserta_1']   = 'required|string|min:3|max:100';
                $rules['nama_peserta_2']   = 'nullable|string|max:100';
                $rules['nama_peserta_3']   = 'nullable|string|max:100';
                $rules['nama_peserta_4']   = 'nullable|string|max:100';
            }
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'no_wa.regex'           => 'Format nomor WhatsApp tidak valid. Gunakan format 08xx atau +628xx.',
            'bukti_transfer.mimes'  => 'File bukti transfer harus berformat JPG, PNG, atau PDF.',
            'bukti_sosmed.mimes'    => 'File bukti sosmed harus berformat JPG atau PNG.',
            'bukti_transfer.max'    => 'Ukuran file bukti transfer maksimal 2MB.',
        ];
    }

    public function getData(): array
    {
        $exclude = [
            'bukti_transfer',

            '_token'
        ];

        $syaratKeys = \App\Models\SyaratBerkas::pluck('key')->toArray();
        foreach ($syaratKeys as $key) {
            $exclude[] = 'bukti_' . $key;
        }

        return $this->except($exclude);
    }
}
