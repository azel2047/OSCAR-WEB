<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePengumumanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'judul'       => 'required|string|max:255',
            'isi'         => 'required|string',
            'target'      => 'required|in:semua,per_lomba,siswa,mahasiswa',
            'lomba_id'    => 'required_if:target,per_lomba|nullable|exists:lomba,id',
            'publish_at'  => 'nullable|date|after:now',
            'kirim_email' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'lomba_id.required_if' => 'Pilih lomba tujuan jika target adalah per lomba.',
            'publish_at.after'     => 'Waktu publish harus di masa depan.',
        ];
    }
}
