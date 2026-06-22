<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StatusHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'status'     => $this->status,
            'keterangan' => $this->keterangan,
            'changed_by' => $this->changedBy?->nama ?? 'Sistem',
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
