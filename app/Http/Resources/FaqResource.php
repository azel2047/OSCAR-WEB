<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FaqResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'lomba_id'   => $this->lomba_id,
            'pertanyaan' => $this->pertanyaan,
            'jawaban'    => $this->jawaban,
            'urutan'     => $this->urutan,
        ];
    }
}
