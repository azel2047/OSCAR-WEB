<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BerkasResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'jenis'     => $this->jenis,
            'url'       => $this->url,
            'nama_asli' => $this->nama_asli,
            'mime_type' => $this->mime_type,
            'ukuran'    => $this->ukuran,
        ];
    }
}
