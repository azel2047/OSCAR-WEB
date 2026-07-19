<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GaleriResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'season_id' => $this->season_id,
            'url'       => $this->url,
            'caption'   => $this->caption,
            'urutan'    => $this->urutan,
        ];
    }
}
