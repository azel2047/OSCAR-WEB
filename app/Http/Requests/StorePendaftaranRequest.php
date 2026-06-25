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
        $rules = [
            'lomba_id'       => 'required|exists:lomba,id',
            'no_wa'          => ['required', 'regex:/^(\+62|62|0)8[0-9]{8,11}$/'],
            'email'          => 'required|email',
            'tema'           => 'required|string|max:100',
            'bukti_transfer' => 'required|file|mimes:jpg,jpeg,png,pdf|max:500',
            'bukti_sosmed'   => 'required|file|mimes:jpg,jpeg,png|max:500',
            'bukti_sosmed_hima' => 'nullable|file|mimes:jpg,jpeg,png|max:500',
            'bukti_twibbon'  => 'nullable|file|mimes:jpg,jpeg,png|max:500',
            'bukti_follow_medpart' => 'nullable|file|mimes:jpg,jpeg,png|max:500',
            'bukti_follow_sponsor' => 'nullable|file|mimes:jpg,jpeg,png|max:500',
        ];

        $lomba = Lomba::find($this->lomba_id);
        if ($lomba) {
            if (in_array($lomba->slug, ['web-development'])) {
                $rules['asal_sekolah']     = 'required|string|min:3|max:150';
                $rules['nama_peserta_1']   = 'required|string|min:3|max:100';
                $rules['nama_peserta_2']   = 'required|string|min:3|max:100';
                $rules['nama_pendamping']  = 'required|string|min:3|max:100';
            } elseif (in_array($lomba->slug, ['desain-poster', 'desain-infografis'])) {
                $rules['asal_sekolah']     = 'required|string|min:3|max:150';
                $rules['nama_peserta_1']   = 'required|string|min:3|max:100';
            } elseif ($lomba->slug === 'ctf') {
                $rules['asal_universitas'] = 'required|string|min:3|max:150';
                $rules['nama_peserta_1']   = 'required|string|min:3|max:100';
                $rules['nama_peserta_2']   = 'nullable|string|max:100';
                $rules['nama_peserta_3']   = 'nullable|string|max:100';
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
            'bukti_transfer.max'    => 'Ukuran file bukti transfer maksimal 500KB.',
        ];
    }

    public function getData(): array
    {
        return $this->except([
            'bukti_transfer', 'bukti_sosmed', 'bukti_sosmed_hima', 
            'bukti_twibbon', 'bukti_follow_medpart', 'bukti_follow_sponsor', 
            '_token'
        ]);
    }
}
