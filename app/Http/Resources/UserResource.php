<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'nama'           => $this->nama,
            'email'          => $this->email,
            'role'           => $this->role,
            'kategori'       => $this->kategori,
            'provinsi'       => $this->provinsi,
            'no_hp'          => $this->no_hp,
            'institusi'      => $this->institusi,
            'unread_notif'   => $this->when(
                $request->routeIs('auth.me') || $request->is('api/auth/me'),
                fn() => $this->unreadNotifCount()
            ),
        ];
    }
}
