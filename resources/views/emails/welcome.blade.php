<x-mail::message>
# Selamat Datang di OSCAR 3.0! 🌟

Halo **{{ $user->nama }}**,

Terima kasih telah mendaftar di **OSCAR 3.0 — Season Rainforest** sebagai **{{ ucfirst($user->kategori ?? 'peserta') }}**.

Akun Anda telah berhasil dibuat. Silakan login ke dashboard Anda menggunakan email ini untuk melengkapi berkas pendaftaran dan memilih lomba yang ingin Anda ikuti.

<x-mail::button :url="config('app.frontend_url') . '/login'">
Masuk ke Dashboard
</x-mail::button>

Jika ada hal yang ingin ditanyakan, jangan ragu untuk menghubungi kami melalui media sosial resmi kami.

Salam,
Tim OSCAR 3.0
</x-mail::message>
