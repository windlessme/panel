<?php

it('returns validation messages in Traditional Chinese for zh-TW', function () {
    $this->postJson('/api/auth/login', [], ['Accept-Language' => 'zh-TW'])
        ->assertUnprocessable()
        ->assertJsonPath('errors.email.0', 'email 為必填。');

    expect(app()->getLocale())->toBe('zh_TW');
});

it('returns validation messages in English for en', function () {
    $this->postJson('/api/auth/login', [], ['Accept-Language' => 'en'])
        ->assertUnprocessable()
        ->assertJsonPath('errors.email.0', 'The email field is required.');
});

it('falls back to English without a supported language', function (?string $header) {
    $headers = $header === null ? [] : ['Accept-Language' => $header];

    $this->postJson('/api/auth/login', [], $headers)
        ->assertJsonPath('errors.email.0', 'The email field is required.');
})->with([
    'no header' => null,
    'unsupported language' => 'fr-FR',
]);

it('maps every Chinese variant to zh_TW', function (string $header) {
    $this->postJson('/api/auth/login', [], ['Accept-Language' => $header])
        ->assertJsonPath('errors.email.0', 'email 為必填。');
})->with(['zh', 'zh-CN', 'zh-Hant-TW', 'fr;q=0.5, zh-HK']);

it('prefers the higher-weighted language', function () {
    $this->postJson('/api/auth/login', [], ['Accept-Language' => 'en, zh-TW;q=0.8'])
        ->assertJsonPath('errors.email.0', 'The email field is required.');
});

it('localizes exception messages from the JSON catalog', function () {
    $this->getJson('/api/auth/invite/not-a-real-token', ['Accept-Language' => 'zh-TW'])
        ->assertNotFound()
        ->assertJsonPath('message', '這個邀請已失效。');

    $this->getJson('/api/auth/invite/not-a-real-token', ['Accept-Language' => 'en'])
        ->assertNotFound()
        ->assertJsonPath('message', 'This invitation is no longer valid.');
});
