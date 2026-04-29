<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GlobalLibraMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subjectText;
    public $viewName;
    public $data;

    // Kita terima subject, nama file blade, dan datanya di sini
    public function __construct($subjectText, $viewName, $data = [])
    {
        $this->subjectText = $subjectText;
        $this->viewName = $viewName;
        $this->data = $data;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subjectText,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: $this->viewName, // File blade yang akan dipakai
            with: $this->data,     // Data yang dilempar ke blade
        );
    }
}