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
 * ContactEnquiry Mailable
 *
 * Purpose:
 * Sends an email to the pharmacy's support/admin inbox whenever a user
 * submits the "Contact Us" form on the website.
 *
 * Why ShouldQueue?
 * Background queueing ensures the user gets an instant response on the
 * website without waiting for external SMTP network latency.
 */
class ContactEnquiry extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * @param array{
     *     sender_name: string,
     *     sender_email: string,
     *     subject: string,
     *     message: string,
     * } $enquiry
     */
    public function __construct(public readonly array $enquiry) {}

    /**
     * Get the message envelope (recipient, reply-to, and subject).
     *
     * - 'to': Pharmacy administrative address.
     * - 'replyTo': Sets the sender's email so the admin can simply hit "Reply"
     *   in their email client to respond directly to the customer.
     * - 'subject': Includes the user's enquiry subject.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            to: [config('mail.admin_address', config('mail.from.address'))],
            replyTo: [$this->enquiry['sender_email']],
            subject: 'Contact Enquiry: '.$this->enquiry['subject'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.contact.enquiry',
            with: [
                'enquiry' => $this->enquiry,
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
