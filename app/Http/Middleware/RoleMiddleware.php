<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses tidak diizinkan',
            ], 403);
        }

        // Jika super admin, bebaskan semua akses
        if ($user->role === 'admin') {
            return $next($request);
        }

        // Aturan hak akses granular dinamis berdasarkan database
        $resource = null;
        if ($request->is('api/admin/lomba*')) {
            $resource = 'lomba';
        } elseif ($request->is('api/admin/timeline*')) {
            $resource = 'timeline';
        } elseif ($request->is('api/admin/pendaftaran*')) {
            $resource = 'pendaftaran';
        } elseif ($request->is('api/admin/mitra*')) {
            $resource = 'mitra';
        } elseif ($request->is('api/admin/roadmap*') || $request->is('api/admin/galeri*') || $request->is('api/admin/seasons*')) {
            $resource = 'season';
        } elseif ($request->is('api/admin/pengumuman*')) {
            $resource = 'pengumuman';
        } elseif ($request->is('api/admin/peserta*')) {
            $resource = 'pengguna';
        } elseif ($request->is('api/admin/config*')) {
            // Hanya Admin yang boleh akses konfigurasi
            if ($user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Hanya Admin yang dapat mengakses setelan sistem'], 403);
            }
            return $next($request);
        }

        if ($resource) {
            $action = 'view';
            if ($request->isMethod('POST')) {
                $action = 'create';
            } elseif ($request->isMethod('PUT') || $request->isMethod('PATCH')) {
                $action = 'update';
            } elseif ($request->isMethod('DELETE')) {
                $action = 'delete';
            }

            if (!$user->hasPermission($resource, $action)) {
                return response()->json([
                    'success' => false,
                    'message' => "Akses ditolak: Divisi Anda tidak memiliki hak untuk {$action} data {$resource}",
                ], 403);
            }
        }

        return $next($request);
    }
}
