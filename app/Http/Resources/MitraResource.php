<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MitraResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'nama'        => $this->nama,
            'logo_url'    => $this->logo_url,
            'website_url' => $this->website_url,
            'urutan'      => $this->urutan,
        ];
    }
}
