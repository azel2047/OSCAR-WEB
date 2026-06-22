<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifikasiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action'  => 'required|in:terima,tolak',
            'catatan' => 'required_if:action,tolak|nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'catatan.required_if' => 'Catatan alasan wajib diisi saat menolak pendaftaran.',
        ];
    }
}
