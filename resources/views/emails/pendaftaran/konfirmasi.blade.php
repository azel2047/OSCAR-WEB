<x-mail::message>
# Pendaftaran Anda Telah Dikirim! 📝

Halo **{{ $user->nama }}**,

Pendaftaran Anda untuk lomba **{{ $lomba->nama }}** pada **OSCAR 3.0 — Season Rainforest** telah berhasil dikirim.

**Detail Pendaftaran:**
- **Nomor Pendaftaran:** {{ $pendaftaran->nomor }}
- **Lomba:** {{ $lomba->nama }}
- **Status:** ⏳ Menunggu Verifikasi Admin

Kami sedang melakukan verifikasi terhadap berkas pendaftaran dan bukti pembayaran Anda. Proses ini memerlukan waktu maksimal 2x24 jam kerja. Kami akan mengirimkan notifikasi email kembali setelah berkas Anda diverifikasi.

<x-mail::button :url="config('app.frontend_url') . '/status'">
Lihat Status Pendaftaran
</x-mail::button>

Salam,
Tim OSCAR 3.0
</x-mail::message>
