<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MitraResource;
use App\Models\Mitra;
use App\Traits\ApiResponse;

class MitraController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $mitra = Mitra::orderBy('urutan')->get();
        return $this->success(MitraResource::collection($mitra));
    }
}
