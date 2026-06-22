<x-mail::message>
# Selamat, Pendaftaran Anda Diterima! 🎉

Halo **{{ $user->nama }}**,

Pendaftaran Anda untuk lomba **{{ $lomba->nama }}** pada **OSCAR 3.0 — Season Rainforest** telah **diverifikasi**.

**Detail Pendaftaran:**

| Field | Info |
|-------|------|
| Nomor | {{ $pendaftaran->nomor }} |
| Lomba | {{ $lomba->nama }} |
| Status | ✅ Diverifikasi |
| Tanggal | {{ $pendaftaran->verified_at->format('d M Y H:i') }} |

Pantau informasi selanjutnya melalui dashboard Anda.

<x-mail::button :url="config('app.frontend_url') . '/status'">
Lihat Dashboard
</x-mail::button>

Sampai jumpa di OSCAR 3.0!

Salam,
Tim OSCAR 3.0
</x-mail::message>
