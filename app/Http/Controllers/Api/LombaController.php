<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FaqResource;
use App\Http\Resources\LombaDetailResource;
use App\Http\Resources\LombaResource;
use App\Models\Lomba;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class LombaController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Lomba::with(['mitra'])
            ->where('status', '!=', 'draft')
            ->when($request->kategori, fn($q, $v) => $q->where('kategori', $v))
            ->when($request->status,   fn($q, $v) => $q->where('status', $v))
            ->when($request->search,   fn($q, $v) => $q->where('nama', 'like', "%$v%"));

        $query = match($request->sort) {
            'deadline' => $query->orderBy('deadline', 'asc'),
            default    => $query->latest(),
        };

        return $this->success(LombaResource::collection($query->get()));
    }

    public function show(string $slug)
    {
        $lomba = Lomba::with(['mitra', 'faq', 'timelineLomba'])
            ->where('slug', $slug)
            ->where('status', '!=', 'draft')
            ->firstOrFail();

        return $this->success(new LombaDetailResource($lomba));
    }

    public function faq(string $slug)
    {
        $lomba = Lomba::where('slug', $slug)->firstOrFail();
        return $this->success(FaqResource::collection($lomba->faq));
    }
}
