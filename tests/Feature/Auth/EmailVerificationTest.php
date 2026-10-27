<?php

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::emailVerification());
});

test('email verification screen can be rendered', function () {
    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)->get(route('verification.notice'));

    $response->assertOk();
});

test('email can be verified', function () {
    Event::fake([Verified::class]);

    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
        [
            'id' => $user->getKey(),
            'hash' => sha1($user->getEmailForVerification()),
        ]
    );

    $response = $this->actingAs($user)->get($verificationUrl);

    Event::assertDispatched(Verified::class);
    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
    $response->assertRedirect(route('home', absolute: false).'?verified=1');
});

test('email cannot be verified with invalid hash', function () {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
        [
            'id' => $user->getKey(),
            'hash' => sha1('wrong-email@example.com'),
        ]
    );

    $this->actingAs($user)->get($verificationUrl);

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

test('verification email can be resent', function () {
    Notification::fake();

    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)->post(route('verification.send'));

    $response->assertRedirect();
    Notification::assertSentTo($user, VerifyEmail::class);
});
