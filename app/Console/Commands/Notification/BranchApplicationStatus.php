<?php

namespace App\Console\Commands\Notification;

use Illuminate\Console\Command;
use App\Models\Branch;
use App\Notifications\Application\BranchExpiring;
use App\Notifications\Application\BranchExpired;

class BranchApplicationStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    // protected $signature = 'notify:branch {--status1=expiring} {--status2=expired}';
    protected $signature = 'notify:branch {status*}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to admin/stakehoders if application is near to expire or has been expired.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $status = $this->argument('status');
        foreach($status as $s){
            $this->notify(strtolower($s));
        }
    }

    private function notify($status){
        switch($status){
            case 'expiring':
                return $this->notifyExpiringApplications();
            case 'expired':
                return $this->notifyExpiredApplications();
        }
        $this->error("\nStatus '". $status ."' is not supported.\n");
        return false;
    }

    private function notifyExpiringApplications(){
        $this->info('Processing near to expire applicatins...');
        $branches = Branch::get();//whereRaw("date_add(str_to_date(concat('1', '/', start_month, '/', start_year), '%d/%m/%Y'), interval permission_period year) = date_add(utc_date(), interval ". Branch::EXPIRES_AFTER_MONTH ." month)")->get();
        $branches->each(function($branch){
            $users = \super_admins();
            $users->push($branch->company->owner);
            $users = $users->merge($branch->stakeHolders);
            \Notification::send($users, (new BranchExpiring($branch))->onConnection('cron'));
        });
        $this->info('Processed near to expire applicatins...');
        $this->info('Email notifications are added to queue for '. $branches->count() .' near to expire applicatin(s)...');
        $this->info("\n");
    }
    
    private function notifyExpiredApplications(){
        $this->info('Processing expired applicatins...');
        $branches = Branch::whereRaw("date_add(date_add(str_to_date(concat('1', '/', start_month, '/', start_year), '%d/%m/%Y'), interval permission_period year), interval 1 month) = utc_date()")->get();
        $branches->each(function($branch){
            $users = \super_admins();
            $users->push($branch->company->owner);
            $users = $users->merge($branch->stakeHolders);
            \Notification::send($users, (new BranchExpired($branch))->onConnection('cron'));
        });
        $this->info('Processed expired applicatins...');
        $this->info('Email notifications are added to queue for '. $branches->count() .' expired applicatin(s)...');
        $this->info("\n");
    }
}
