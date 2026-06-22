<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSeasonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id       = $this->route('id');
        $slugRule = $id
            ? "nullable|string|max:60|unique:season,slug,{$id}"
            : 'nullable|string|max:60|unique:season,slug';

        return [
            'nama'        => 'required|string|max:50',
            'slug'        => $slugRule,
            'tema'        => 'required|string|max:100',
            'tahun'       => 'required|integer|min:2020|max:2099',
            'deskripsi'   => 'nullable|string',
            'cerita'      => 'nullable|string',
            'foto_utama'  => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
            'video_url'   => 'nullable|url|max:255',
            'jml_peserta' => 'nullable|integer|min:0',
            'jml_lomba'   => 'nullable|integer|min:0',
            'jml_mitra'   => 'nullable|integer|min:0',
            'urutan'      => 'nullable|integer|min:0',
            'galeri'      => 'nullable|array',
            'galeri.*'    => 'file|mimes:jpg,jpeg,png,webp|max:3072',
            'galeri_caption'   => 'nullable|array',
            'galeri_caption.*' => 'nullable|string|max:255',
        ];
    }
}
