<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimelineResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'nama'       => $this->nama,
            'tanggal'    => $this->tanggal?->format('Y-m-d'),
            'waktu'      => $this->waktu,
            'keterangan' => $this->keterangan,
            'is_active'  => $this->is_active,
            'urutan'     => $this->urutan,
        ];
    }
}
