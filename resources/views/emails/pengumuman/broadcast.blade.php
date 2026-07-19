<x-mail::message>
# {{ $pengumuman->judul }}

Halo **{{ $user->nama }}**,

{!! $pengumuman->isi !!}

<x-mail::button :url="config('app.frontend_url') . '/pengumuman'">
Lihat Selengkapnya
</x-mail::button>

Salam,
Tim OSCAR 3.0
</x-mail::message>
