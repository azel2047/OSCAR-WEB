<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TimelineResource;
use App\Models\Timeline;
use App\Traits\ApiResponse;

class TimelineController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $timeline = Timeline::orderBy('urutan')->get();
        return $this->success(TimelineResource::collection($timeline));
    }
}
