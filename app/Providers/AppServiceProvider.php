<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        if(config('app.https') === 'ON'){
            \URL::forceScheme('https');
        }
        \View::composer("*", function($view){
            /**
             * Pass @attribute $layout to view to extend it
             * @attribute $layout is defined in controller class
             */
            if(($route = app()->request->route()) && $route->controller instanceof \App\Http\Controllers\Controller){
                $view->with("layout", $route->controller->layout());
            }
        });
        \Schema::defaultStringLength(191);

        if(config('app.debug')) {
            \DB::listen(function($query) {
                \File::append(
                    storage_path('/logs/query.log'),
                    $query->sql . ' [' . implode(', ', $query->bindings) . ']' . PHP_EOL
                );
            });
        }

        Relation::morphMap([
            'user' => \App\Models\User::class,
            'contact' => \App\Models\Contact::class,
            'signup' => \App\Models\Company::class,
            'branch' => \App\Models\Branch::class,
            'security' => \App\Models\SecurityAgency::class,
            'contract' => \App\Models\Contract::class,
            'investment' => \App\Models\Investment::class,
            'renewal' => \App\Models\Renewal::class,
            'log' => \App\Models\ApplicationActivity::class,
            'payment' => \App\Models\Payment::class,
        ]);

        \Queue::failing(function ($event) {
            \File::append(
                storage_path('/logs/queue.log'),
                $event->exception
            );
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
