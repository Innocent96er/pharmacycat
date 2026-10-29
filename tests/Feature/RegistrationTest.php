<?php

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    Event::fake([Registered::class]);

    $response = $this->post(route('register.store'), [
        'name' => 'Jane Smith',
        'email' => 'jane@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', [
        'name' => 'Jane Smith',
        'email' => 'jane@example.com',
    ]);

    Event::assertDispatched(Registered::class);
    $response->assertRedirect(route('verification.notice', absolute: false));
});

test('registration dispatches email verification notification to new user', function () {
    Notification::fake();

    $response = $this->post(route('register.store'), [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertRedirect(route('verification.notice', absolute: false));

    $user = User::where('email', 'john@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->hasVerifiedEmail())->toBeFalse();

    Notification::assertSentTo(
        $user,
        VerifyEmail::class
    );
});
