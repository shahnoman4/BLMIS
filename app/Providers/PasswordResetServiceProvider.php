<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Auth\Passwords\PasswordBrokerManager;

class PasswordResetServiceProvider extends ServiceProvider {

    protected $defer = true;

    public function register() {
        $this->app->singleton('auth.password', function ($app) {
            return new PasswordBrokerManager($app);
        });
    }

    public function provides() {
        return ['auth.password'];
    }

}