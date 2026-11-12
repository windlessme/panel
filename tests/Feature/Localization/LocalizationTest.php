<?php

use Convoy\Models\User;

it('serves the zh_TW catalog to the front-end', function () {
    $response = $this->getJson('/locales/locale.json?locale=zh_TW&namespace=strings');

    $response->assertOk();
    expect($response->json('zh_TW.strings.cancel'))->toBe('取消');
});

it('serves zh_TW together with the en_US fallback', function () {
    $response = $this->getJson('/locales/locale.json?locale=zh_TW%20en_US&namespace=auth');

    $response->assertOk();
    expect($response->json('zh_TW.auth.sign_out'))->toBe('登出')
        ->and($response->json('en_US.auth.sign_out'))->toBe('Sign out');
});

it('rejects locales that have no catalog', function () {
    $this->getJson('/locales/locale.json?locale=../../etc&namespace=strings')
        ->assertUnprocessable();
});

it('answers validation errors in the Accept-Language locale', function () {
    $response = $this->withHeader('Accept-Language', 'zh-TW,zh;q=0.9,en;q=0.8')
        ->postJson('/login', []);

    $response->assertUnprocessable();
    expect($response->json('errors.email.0'))->toContain('請填寫');
});

it('answers failed sign-ins in the Accept-Language locale', function () {
    $user = User::factory()->create();

    $response = $this->withHeader('Accept-Language', 'zh-TW')
        ->postJson('/login', ['email' => $user->email, 'password' => 'not-the-password']);

    $response->assertUnprocessable();
    expect($response->json('errors.email.0'))->toBe(trans('auth.failed', [], 'zh_TW'))
        ->and(trans('auth.failed', [], 'zh_TW'))->not->toBe(trans('auth.failed', [], 'en_US'));
});

it('keeps English when the browser asks for a language without a catalog', function () {
    $response = $this->withHeader('Accept-Language', 'fr-FR,fr;q=0.9')
        ->postJson('/login', []);

    $response->assertUnprocessable();
    expect($response->json('errors.email.0'))->toBe('The email field is required.');
});

it('hands the panel name from APP_NAME to the front-end', function () {
    config(['app.name' => 'My Cloud']);

    $this->get('/auth/login')
        ->assertOk()
        ->assertSee('"name":"My Cloud"', false);
});
