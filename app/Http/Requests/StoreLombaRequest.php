<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLombaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id       = $this->route('id');
        $slugRule = $id
            ? "nullable|string|max:100|unique:lomba,slug,{$id}"
            : 'nullable|string|max:100|unique:lomba,slug';

        return [
            'nama'        => 'required|string|max:80',
            'slug'        => $slugRule,
            'kategori'    => 'required|in:siswa,mahasiswa',
            'deskripsi'   => 'nullable|string',
            'persyaratan' => 'nullable|string',
            'ketentuan'   => 'nullable|string',
            'hadiah_1'    => 'nullable|string|max:255',
            'hadiah_2'    => 'nullable|string|max:255',
            'hadiah_3'    => 'nullable|string|max:255',
            'benefit'     => 'nullable|string',
            'deadline'    => 'required|date|after:today',
            'kuota'       => 'required|integer|min:0',
            'status'      => 'required|in:draft,buka,tutup',
            'banner'      => 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072',
            'booklet'     => 'nullable|file|mimes:pdf|max:10240',
            'mitra_ids'   => 'nullable|array',
            'mitra_ids.*' => 'exists:mitra,id',
        ];
    }
}
