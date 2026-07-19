<?php

namespace App\Mail;

use App\Models\Pengumuman;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PengumumanEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Pengumuman $pengumuman,
        public User $user
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[OSCAR 3.0] ' . $this->pengumuman->judul,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.pengumuman.broadcast',
            with: [
                'pengumuman' => $this->pengumuman,
                'user'       => $this->user,
            ]
        );
    }
}
