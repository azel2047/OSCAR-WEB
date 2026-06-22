<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeasonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'nama'          => $this->nama,
            'slug'          => $this->slug,
            'tema'          => $this->tema,
            'tahun'         => $this->tahun,
            'deskripsi'     => $this->deskripsi,
            'cerita'        => $this->cerita,
            'foto_utama_url'=> $this->foto_utama_url,
            'video_url'     => $this->video_url,
            'jml_peserta'   => $this->jml_peserta,
            'jml_lomba'     => $this->jml_lomba,
            'jml_mitra'     => $this->jml_mitra,
            'galeri'        => GaleriResource::collection($this->whenLoaded('galeri')),
            'pemenang'      => PemenangResource::collection($this->whenLoaded('pemenang')),
        ];
    }
}
