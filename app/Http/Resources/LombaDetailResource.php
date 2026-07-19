<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LombaDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge((new LombaResource($this->resource))->toArray($request), [
            'faq'      => FaqResource::collection($this->whenLoaded('faq')),
            'timeline' => TimelineLombaResource::collection($this->whenLoaded('timelineLomba')),
        ]);
    }
}
