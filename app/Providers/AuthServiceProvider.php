<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Services\Auth\BasicAuthGuard;
use App\Services\Auth\NBPUserProvider;


class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        \Auth::extend('nbp_basic', function ($app, $name, array $config) {
			$userProvider = app(NBPUserProvider::class);
			return new BasicAuthGuard($name, $userProvider, $app->request, $config);
		});
    }
}
