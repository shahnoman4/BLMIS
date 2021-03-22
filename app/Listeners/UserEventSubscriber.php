<?php

namespace App\Listeners;

use App\Notifications\TwoFAPinIssued as PINNotification;

class UserEventSubscriber
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(){
        //
    }

    public function on2FAPinIssued($event){
        \Notification::send(\Auth::user(), new PINNotification($event));
    }

    public function subscribe($events){
        $events->listen(
            'App\Events\TwoFATokenCreated',
            'App\Listeners\UserEventSubscriber@on2FAPinIssued'
        );
    }
}
