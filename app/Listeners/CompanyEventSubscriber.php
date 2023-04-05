<?php

namespace App\Listeners;

use App\Events\Application\CompanyRegistered as RegEvent;
use App\Events\Application\StatusUpdated as StatusEvent;
use App\Notifications\Application\StatusUpdated as AppNotification;
use App\Notifications\Application\CompanyRegistered as NewCompanyNotification;
use App\Models\User;
use App\Lookups\Authorization;
use App\Lookups\ApplicationStatus;

class CompanyEventSubscriber
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function onRegister(RegEvent $event)
    {
        \Notification::send(\super_admins(), new NewCompanyNotification($event));
        \Notification::send([$event->user], new NewCompanyNotification($event, ['mail']));
    }

    public function onStatusUpdate(StatusEvent $event)
    {
        if($event->type == 'signup'){
            if($event->statusId == ApplicationStatus::APPROVED){
                $users = User::where('authorization_id', Authorization::SUPER_ADMIN)->get();
                $users->push($event->model->owner);
                \Notification::send($users, new AppNotification($event));
            }
            else if($event->statusId == ApplicationStatus::COMMENTED && !auth()->user()->isCompanyOwner()){
                \Notification::send([$event->model->owner], new AppNotification($event));
            }
        }
    }

    public function subscribe($events)
    {
        $events->listen(
            'App\Events\Application\CompanyRegistered',
            'App\Listeners\CompanyEventSubscriber@onRegister'
        );

        $events->listen(
            'App\Events\Application\StatusUpdated',
            'App\Listeners\CompanyEventSubscriber@onStatusUpdate'
        );
    }
}
