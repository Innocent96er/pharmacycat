<?php

namespace App\Http\Controllers;

use App\Mail\ContactEnquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * ContactController
 *
 * Handles the public "Contact Us" inquiries:
 * 1. Displays the contact interface via Inertia.
 * 2. Enforces IP-based rate limiting (max 3 submissions per 5 minutes) to defeat spam bots.
 * 3. Validates sender name, email, subject, and enquiry text.
 * 4. Queues and delivers the ContactEnquiry email to the pharmacy administration mailbox.
 */
class ContactController extends Controller
{
    /**
     * Show the contact form page.
     * Renders resources/js/pages/contact.tsx with any session flash message.
     */
    public function show(Request $request): Response
    {
        return Inertia::render('contact', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle the contact form submission.
     */
    public function send(Request $request): RedirectResponse
    {
        // STEP 1: Rate limiting security check (prevents mailbox flooding)
        $throttleKey = 'contact.'.$request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, maxAttempts: 3)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            throw ValidationException::withMessages([
                'message' => "Too many submissions. Please wait {$seconds} seconds before trying again.",
            ]);
        }

        // STEP 2: Validate sender information and message length
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        // Record attempt against the throttle key for 5 minutes (300 seconds)
        RateLimiter::hit($throttleKey, decaySeconds: 300);

        // STEP 3: Dispatch the enquiry email via SMTP to the pharmacy manager
        Mail::send(new ContactEnquiry([
            'sender_name' => $validated['name'],
            'sender_email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
        ]));

        // STEP 4: Redirect back with success message displayed via toast/banner
        return back()->with('status', 'Your message has been sent! We\'ll get back to you shortly.');
    }
}
