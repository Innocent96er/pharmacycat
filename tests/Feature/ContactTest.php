<?php

use App\Mail\ContactEnquiry;
use Illuminate\Support\Facades\Mail;

test('contact page can be viewed', function () {
    $response = $this->get(route('contact'));

    $response->assertOk();
});

test('visitors can submit contact enquiry and deliver to business email', function () {
    Mail::fake();

    $response = $this->post(route('contact.send'), [
        'name' => 'Jane Customer',
        'email' => 'jane@example.com',
        'subject' => 'Medicine Availability',
        'message' => 'Do you have Amoxicillin 500mg in stock for dispatch?',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('status');

    Mail::assertQueued(ContactEnquiry::class, function ($mail) {
        return $mail->hasTo('pharmarcycat@gmail.com')
            && $mail->enquiry['sender_name'] === 'Jane Customer';
    });
});

test('contact form requires all mandatory fields', function () {
    $response = $this->post(route('contact.send'), []);

    $response->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
});
