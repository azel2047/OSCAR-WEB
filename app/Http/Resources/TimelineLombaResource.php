<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimelineLombaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'lomba_id'   => $this->lomba_id,
            'stage'      => $this->stage,
            'tanggal'    => $this->tanggal?->format('Y-m-d'),
            'keterangan' => $this->keterangan,
            'urutan'     => $this->urutan,
        ];
    }
}
