<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * NewOrderAlert Mailable
 *
 * Purpose:
 * Sends an email notification to the pharmacy staff/administrator whenever
 * a customer completes checkout. This alerts the pharmacy team to prepare
 * and dispatch the ordered medicines.
 *
 * Why ShouldQueue?
 * By implementing ShouldQueue, email sending runs in the background
 * via the database queue, preventing the checkout page from hanging
 * while waiting for the remote SMTP server.
 */
class NewOrderAlert extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * The order details payload passed from the checkout controller.
     *
     * @param array{
     *     order_number: string,
     *     customer_name: string,
     *     customer_email: string,
     *     total: string,
     *     items_count: int,
     *     courier_name?: string,
     *     delivery_type?: string,
     * } $order
     */
    public function __construct(public readonly array $order) {}

    /**
     * Get the message envelope (recipient & subject line).
     *
     * - 'to': Uses the admin address from config/mail.php (falls back to MAIL_FROM_ADDRESS).
     * - 'subject': Dynamically inserts the order number and customer name for quick identification.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            to: [config('mail.admin_address', config('mail.from.address'))],
            subject: '🛒 New Order #'.$this->order['order_number'].' from '.$this->order['customer_name'],
        );
    }

    /**
     * Get the message content definition (Markdown view & variables).
     *
     * Points to resources/views/emails/orders/admin-alert.blade.php
     * and injects the $order array so the blade template can render the table.
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
