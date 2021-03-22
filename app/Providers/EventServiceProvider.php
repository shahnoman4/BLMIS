<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'App\Events\Event' => [
            'App\Listeners\EventListener',
        ],
    ];

    protected $subscribe = [
        'App\Listeners\BranchEventSubscriber',
        'App\Listeners\CompanyEventSubscriber',
        'App\Listeners\UserEventSubscriber',
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        Event::listen('Illuminate\Auth\Events\PasswordReset', function ($event) {
            $user = $event->user;
            if($user->status_id === \App\Lookups\ApplicationStatus::NEW){
                $user->status_id = \App\Lookups\ApplicationStatus::UPDATED;
                $user->save();
            }
        });
    }
}
