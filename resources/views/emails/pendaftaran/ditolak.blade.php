<x-mail::message>
# Update Status Pendaftaran

Halo **{{ $user->nama }}**,

Mohon maaf, pendaftaran Anda untuk lomba **{{ $lomba->nama }}** belum dapat kami terima saat ini.

**Nomor Pendaftaran:** {{ $pendaftaran->nomor }}

**Alasan:**
{{ $catatan }}

Anda dapat mengunggah ulang berkas yang diperlukan dan mengirimkan revisi melalui dashboard.

<x-mail::button :url="config('app.frontend_url') . '/status'">
Kirim Revisi
</x-mail::button>

Jika ada pertanyaan, hubungi kami melalui WhatsApp atau Instagram.

Salam,
Tim OSCAR 3.0
</x-mail::message>
