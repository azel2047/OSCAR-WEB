<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PemenangResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'season_id'  => $this->season_id,
            'nama_lomba' => $this->nama_lomba,
            'juara_1'    => $this->juara_1,
            'juara_2'    => $this->juara_2,
            'juara_3'    => $this->juara_3,
            'urutan'     => $this->urutan,
        ];
    }
}
