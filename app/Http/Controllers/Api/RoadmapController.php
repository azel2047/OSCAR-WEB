<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SeasonResource;
use App\Models\Season;
use App\Models\GaleriSeason;
use App\Traits\ApiResponse;

class RoadmapController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $seasons = Season::with(['galeri', 'pemenang'])->orderBy('urutan')->get();
        return $this->success(SeasonResource::collection($seasons));
    }

    public function show(string $slug)
    {
        $season = Season::with(['galeri', 'pemenang'])
            ->where('slug', $slug)
            ->firstOrFail();

        return $this->success(new SeasonResource($season));
    }

    public function allGaleriPublic()
    {
        $galeri = GaleriSeason::with('season')->orderBy('created_at', 'desc')->get();
        return $this->success($galeri);
    }

    public function seasonsOnly()
    {
        $seasons = Season::orderBy('urutan')->get();
        return $this->success($seasons);
    }
}
