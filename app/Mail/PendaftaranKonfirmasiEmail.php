<?php

namespace App\Mail;

use App\Models\Pendaftaran;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PendaftaranKonfirmasiEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Pendaftaran $pendaftaran) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[OSCAR 3.0] Konfirmasi Pendaftaran Lomba',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.pendaftaran.konfirmasi',
            with: [
                'pendaftaran' => $this->pendaftaran,
                'lomba'       => $this->pendaftaran->lomba,
                'user'        => $this->pendaftaran->user,
            ]
        );
    }
}
