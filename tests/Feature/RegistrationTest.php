<?php

use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;

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
    $response->assertRedirect(route('home', absolute: false));
});
