<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    use ApiResponse;

    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'nama'     => $request->nama,
            'email'    => $request->email,
            'password' => $request->password,
            'role'     => 'peserta',
            'kategori' => $request->kategori,
        ]);
        $token = $user->createToken('oscar-token')->plainTextToken;

        return $this->success([
            'user'  => new UserResource($user),
            'token' => $token,
        ], 'Akun berhasil dibuat', 201);
    }

    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->error('Email atau password salah', 401);
        }

        $user  = Auth::user();
        $expiry = $request->boolean('remember')
            ? now()->addDays(30)
            : now()->addDays(1);

        $token = $user->createToken('oscar-token', ['*'], $expiry)->plainTextToken;

        return $this->success([
            'user'  => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'Berhasil logout');
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('notifikasi');
        return $this->success(new UserResource($user));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'      => 'sometimes|string|max:100',
            'nama'      => 'sometimes|string|max:100',
            'no_hp'     => 'nullable|string|max:20',
            'institusi' => 'nullable|string|max:150',
        ]);

        $user->update([
            'nama'      => $request->input('name') ?? $request->input('nama') ?? $user->nama,
            'no_hp'     => $request->input('no_hp', $user->no_hp),
            'institusi' => $request->input('institusi', $user->institusi),
        ]);

        return $this->success(new UserResource($user), 'Profil berhasil diperbarui');
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        Password::sendResetLink($request->only('email'));
        return $this->success(null, 'Jika email terdaftar, link reset akan dikirim');
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => $password])->save();
                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->success(null, 'Password berhasil direset');
        }

        return $this->error(match($status) {
            Password::INVALID_TOKEN => 'Link sudah kedaluwarsa atau sudah digunakan',
            Password::INVALID_USER  => 'Email tidak ditemukan',
            default                 => 'Gagal mereset password',
        }, 400);
    }
}
