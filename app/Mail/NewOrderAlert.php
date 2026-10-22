<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewOrderAlert extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * @param array{
     *     order_number: string,
     *     customer_name: string,
     *     customer_email: string,
     *     total: string,
     *     items_count: int,
     * } $order
     */
    public function __construct(public readonly array $order) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            to: [config('mail.admin_address', config('mail.from.address'))],
            subject: '🛒 New Order #'.$this->order['order_number'].' from '.$this->order['customer_name'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.orders.admin-alert',
            with: [
                'order' => $this->order,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
