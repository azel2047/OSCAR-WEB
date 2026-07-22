<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama'      => 'required|string|min:3|max:100',
            'email'     => 'required|email|unique:users,email',
            'password'  => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            'kategori'  => 'required|in:siswa,mahasiswa',
            'no_hp'     => 'required|string|max:20',
            'institusi' => 'required|string|max:150',
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required'      => 'Nama lengkap wajib diisi.',
            'email.unique'       => 'Email sudah terdaftar.',
            'password.min'       => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'kategori.required'  => 'Pilih kategori peserta.',
            'no_hp.required'     => 'Nomor HP / WhatsApp wajib diisi.',
            'institusi.required' => 'Nama institusi wajib diisi.',
        ];
    }
}
