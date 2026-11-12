<?php

return [
    'new_token' => 'New Token',
    'last_used_at' => 'Last Used At',
    'create_modal' => [
        'title' => 'Create a Token',
    ],
    'created_modal' => [
        'title' => 'Token Created',
        'description' => 'Here is your newly created API token. Please take note of the token\'s value as this is the only and last time you will see it.',
        'button' => 'Okay, I got it',
    ],
    'delete_modal' => [
        'title' => 'Delete :name?',
        'description' => 'Are you sure you want to delete this token? Subsequent requests to the API relying on this token will immediately fail.',
    ],
    'validation' => [
        'name_max' => 'Do not exceed :max characters',
        'name_required' => 'A name is required.',
    ],
];
