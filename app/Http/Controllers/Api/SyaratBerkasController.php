<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SyaratBerkas;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class SyaratBerkasController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $syarat = SyaratBerkas::where('status', 'aktif')->orderBy('id')->get();
        return $this->success($syarat);
    }
}
