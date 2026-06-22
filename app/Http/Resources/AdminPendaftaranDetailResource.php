<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminPendaftaranDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'nomor'         => $this->nomor,
            'user'          => new UserResource($this->whenLoaded('user')),
            'lomba'         => new LombaResource($this->whenLoaded('lomba')),
            'status'        => $this->status,
            'catatan_admin' => $this->catatan_admin,
            'data_peserta'  => $this->data_peserta,
            'berkas'        => BerkasResource::collection($this->whenLoaded('berkas')),
            'status_history'=> StatusHistoryResource::collection($this->whenLoaded('statusHistory')),
            'verified_by'   => new UserResource($this->whenLoaded('verifiedBy')),
            'submitted_at'  => $this->submitted_at?->toISOString(),
            'verified_at'   => $this->verified_at?->toISOString(),
            'created_at'    => $this->created_at?->toISOString(),
        ];
    }
}
