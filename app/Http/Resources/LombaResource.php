<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LombaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'nama'        => $this->nama,
            'slug'        => $this->slug,
            'kategori'    => $this->kategori,
            'deskripsi'   => $this->deskripsi,
            'persyaratan' => $this->persyaratan,
            'ketentuan'   => $this->ketentuan,
            'hadiah_1'    => $this->hadiah_1,
            'hadiah_2'    => $this->hadiah_2,
            'hadiah_3'    => $this->hadiah_3,
            'benefit'     => $this->benefit,
            'deadline'    => $this->deadline?->toISOString(),
            'kuota'       => $this->kuota,
            'terdaftar'   => $this->terdaftar,
            'status'      => $this->status,
            'booklet_url' => $this->booklet_url,
            'banner_url'  => $this->banner_url,
            'mitra'       => MitraResource::collection($this->whenLoaded('mitra')),
        ];
    }
}
