<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TimelineResource;
use App\Models\Timeline;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminTimelineController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $timeline = Timeline::orderBy('urutan')->get();
        return $this->success(TimelineResource::collection($timeline));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama'       => 'required|string|max:100',
            'tanggal'    => 'required|date',
            'waktu'      => 'nullable|date_format:H:i',
            'keterangan' => 'nullable|string',
            'urutan'     => 'nullable|integer',
        ]);

        $tl = Timeline::create([
            'nama'       => $request->nama,
            'tanggal'    => $request->tanggal,
            'waktu'      => $request->waktu,
            'keterangan' => $request->keterangan,
            'is_active'  => false,
            'urutan'     => $request->urutan ?? (Timeline::max('urutan') + 1),
        ]);

        return $this->success(new TimelineResource($tl), 'Timeline berhasil ditambahkan', 201);
    }

    public function update(Request $request, int $id)
    {
        $tl = Timeline::findOrFail($id);
        $request->validate([
            'nama'       => 'sometimes|string|max:100',
            'tanggal'    => 'sometimes|date',
            'waktu'      => 'nullable|date_format:H:i',
            'keterangan' => 'nullable|string',
            'urutan'     => 'nullable|integer',
        ]);
        $tl->update($request->only('nama', 'tanggal', 'waktu', 'keterangan', 'urutan'));
        return $this->success(new TimelineResource($tl), 'Timeline berhasil diupdate');
    }

    public function destroy(int $id)
    {
        Timeline::findOrFail($id)->delete();
        return $this->success(null, 'Timeline berhasil dihapus');
    }

    public function setAktif(int $id)
    {
        DB::transaction(function () use ($id) {
            Timeline::query()->update(['is_active' => false]);
            Timeline::findOrFail($id)->update(['is_active' => true]);
        });
        return $this->success(null, 'Stage aktif berhasil diupdate');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items'         => 'required|array',
            'items.*.id'    => 'required|exists:timeline,id',
            'items.*.urutan'=> 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->items as $item) {
                Timeline::where('id', $item['id'])->update(['urutan' => $item['urutan']]);
            }
        });

        return $this->success(null, 'Urutan timeline berhasil disimpan');
    }
}
