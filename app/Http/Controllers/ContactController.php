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

class ContactController extends Controller
{
    /**
     * Show the contact form page.
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
        $throttleKey = 'contact.'.$request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, maxAttempts: 3)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            throw ValidationException::withMessages([
                'message' => "Too many submissions. Please wait {$seconds} seconds before trying again.",
            ]);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        RateLimiter::hit($throttleKey, decaySeconds: 300);

        Mail::send(new ContactEnquiry([
            'sender_name' => $validated['name'],
            'sender_email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
        ]));

        return back()->with('status', 'Your message has been sent! We\'ll get back to you shortly.');
    }
}
