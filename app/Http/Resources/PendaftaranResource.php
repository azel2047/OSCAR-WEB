<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PendaftaranResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'nomor'         => $this->nomor,
            'lomba'         => new LombaResource($this->whenLoaded('lomba')),
            'status'        => $this->status,
            'catatan_admin' => $this->catatan_admin,
            'data_peserta'  => $this->data_peserta,
            'berkas'        => [
                'transfer' => $this->berkasTransfer() ? $this->berkasTransfer()->url : null,
                'sosmed'   => $this->berkasSosmed() ? $this->berkasSosmed()->url : null,
            ],
            'status_history'=> StatusHistoryResource::collection($this->whenLoaded('statusHistory')),
            'submitted_at'  => $this->submitted_at?->toISOString(),
            'verified_at'   => $this->verified_at?->toISOString(),
            'created_at'    => $this->created_at?->toISOString(),
        ];
    }
}
