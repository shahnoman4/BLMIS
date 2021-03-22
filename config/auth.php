<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Defaults
    |--------------------------------------------------------------------------
    |
    | This option controls the default authentication "guard" and password
    | reset options for your application. You may change these defaults
    | as required, but they're a perfect start for most applications.
    |
    */

    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    |
    | Next, you may define every authentication guard for your application.
    | Of course, a great default configuration has been defined for you
    | here which uses session storage and the Eloquent user provider.
    |
    | All authentication drivers have a user provider. This defines how the
    | users are actually retrieved out of your database or other storage
    | mechanisms used by this application to persist your user's data.
    |
    | Supported: "session", "token"
    |
    */

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],

        'api' => [
            'driver' => 'token',
            'provider' => 'users',
            'hash' => true
        ],

        'nbp' => [
            'driver' => 'nbp_basic'
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers
    |--------------------------------------------------------------------------
    |
    | All authentication drivers have a user provider. This defines how the
    | users are actually retrieved out of your database or other storage
    | mechanisms used by this application to persist your user's data.
    |
    | If you have multiple user tables or models you may configure multiple
    | sources which represent each model / table. These sources may then
    | be assigned to any extra authentication guards you have defined.
    |
    | Supported: "database", "eloquent"
    |
    */

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Resetting Passwords
    |--------------------------------------------------------------------------
    |
    | You may specify multiple password reset configurations if you have more
    | than one user table or model in the application and you want to have
    | separate password reset settings based on the specific user types.
    |
    | The expire time is the number of minutes that the reset token should be
    | considered valid. This security feature keeps tokens short-lived so
    | they have less time to be guessed. You may change this as needed.
    |
    */

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_reset_token',
            'expire' => 60,
        ],
    ],

    'G_CAPTCHA' => strtoupper(env('G_CAPTCHA', 'ON')),
    'G_CAPTCHA_KEY' => env('G_CAPTCHA_KEY'),
    'G_CAPTCHA_SECRET' => env('G_CAPTCHA_SECRET'),
    
    'JAZZ_MERCHANT_ID' => env('JAZZ_MERCHANT_ID'),
    'JAZZ_PASSWORD' => env('JAZZ_PASSWORD'),
    'JAZZ_HASH' => env('JAZZ_HASH'),
    'JAZZ_ENV' => env('JAZZ_ENV'),

    'TWO_FA' => strtoupper(env('TWO_FA', 'ON')),
    'TWO_FA_MAX_ATTEMPTS' => env('TWO_FA_MAX_ATTEMPTS'),
    'TWO_FA_PIN_LIFETIME' => env('TWO_FA_PIN_LIFETIME'),

    'nbp' => [
        'active' => env('NBP_ACTIVE') === true,
        'on' => strtoupper(env('NBP_AUTH')) === 'ON',
        'username' => strtolower(env('NBP_USERNAME')),
        'password' => env('NBP_PASSWORD'),
        'ip' => explode(',', env('NBP_IP')),
    ],

    'MENU_BAR' => strtoupper(env('MENU_BAR', 'ON')),
    'DISCLAIMER' => strtoupper(env('DISCLAIMER', 'ON')),
];
