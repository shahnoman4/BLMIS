<?php

namespace App\Listeners;

use App\Notifications\Application\StatusUpdated as AppStatusNotification;
use App\Notifications\Application\BranchCreated as BranchAppNotification;
use App\Notifications\Application\ContractAdded as NewContractNotification;
use App\Events\Application\StatusUpdated as StatusEvent;
use App\Lookups\ApplicationStatus;
use App\Models\User;
use App\Models\Branch;
use App\Lookups\Authorization;
use App\Lookups\ServiceType;

class BranchEventSubscriber
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(){
        //
    }

    /**
     * Handle the event.
     *
     * @param  Event  $event
     * @return void
     */
    public function onStatusUpdate(StatusEvent $event){
        if($event->type == 'branch'){
            if($event->statusId == ApplicationStatus::REJECTED && $event->model->converted_from){
                $this->restoreSubBranchesReference($event->model);
            }
            if($event->statusId == ApplicationStatus::APPROVED || $event->statusId == ApplicationStatus::REJECTED || $event->statusId == ApplicationStatus::CIRCULATED){
                $users = \super_admins();
                $users->push($event->model->company->owner);
                if($event->statusId != ApplicationStatus::CIRCULATED){
                    $users = $users->merge($event->model->stakeHolders);
                }
                \Notification::send($users, new AppStatusNotification($event));            
            }
            else if($event->statusId == ApplicationStatus::COMMENTED && !auth()->user()->isCompanyOwner()){
                \Notification::send([$event->model->company->owner], new AppStatusNotification($event));
            }
        }
    }

    public function onBranchCreate($event){
        $users = \super_admins();
        $users->push(\Auth::user());
        if($event->model->converted_from){
            $this->updateSubBranchesReference($event->model);
        }
        \Notification::send($users, new BranchAppNotification($event));
    }

    private function updateSubBranchesReference($mainBranch){
        \DB::table(Branch::table())->where('parent_id', $mainBranch->converted_from)
        ->update([
            'parent_id' => $mainBranch->id,
            'service_type_id' => \is_branch($mainBranch) ? ServiceType::SUB_BRANCH : ServiceType::SUB_LIAISON,
            'updated_at' => now()
        ]);
    }

    private function restoreSubBranchesReference($mainBranch){
        \DB::table(Branch::table())->where('parent_id', $mainBranch->id)
        ->update([
            'parent_id' => $mainBranch->converted_from,
            'service_type_id' => \is_branch($mainBranch) ? ServiceType::SUB_LIAISON : ServiceType::SUB_BRANCH,
            'updated_at' => now()
        ]);
    }

    public function onContractCreate($event){
        $contract = $event->model;
        $branch = $contract->branch;
        $users = \super_admins();
        // $users->push(\Auth::user());
        // $users = $users->merge($branch->stakeHolders);
        \Notification::send($users, new NewContractNotification($event));      
    }

    public function subscribe($events){
        $events->listen(
            'App\Events\Application\StatusUpdated',
            'App\Listeners\BranchEventSubscriber@onStatusUpdate'
        );
        $events->listen(
            'App\Events\Application\BranchCreated',
            'App\Listeners\BranchEventSubscriber@onBranchCreate'
        );
        $events->listen(
            'App\Events\Application\ContractAdded',
            'App\Listeners\BranchEventSubscriber@onContractCreate'
        );
    }
}
