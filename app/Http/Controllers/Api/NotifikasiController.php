<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotifikasiResource;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $user = $request->user();

        $query = $user->notifikasi()
            ->when($request->unread_only, fn($q) => $q->where('is_read', false))
            ->latest();

        $paginated   = $query->paginate(20);
        $unreadCount = $user->notifikasi()->where('is_read', false)->count();

        return response()->json([
            'success'      => true,
            'message'      => 'Berhasil',
            'data'         => NotifikasiResource::collection($paginated->items()),
            'unread_count' => $unreadCount,
            'meta'         => [
                'current_page' => $paginated->currentPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
                'last_page'    => $paginated->lastPage(),
            ],
        ]);
    }

    public function markRead(Request $request, int $id)
    {
        $notif = $request->user()->notifikasi()->findOrFail($id);
        $notif->update(['is_read' => true]);
        return $this->success(null, 'Notifikasi ditandai sudah dibaca');
    }

    public function markAllRead(Request $request)
    {
        $request->user()->notifikasi()->where('is_read', false)->update(['is_read' => true]);
        return $this->success(null, 'Semua notifikasi ditandai sudah dibaca');
    }
}
