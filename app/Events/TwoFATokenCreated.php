<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Queue\SerializesModels;

class TwoFATokenCreated
{
    use SerializesModels;

    public $user;
    public $emailPin;
    
    public function __construct(User $user, $emailPin)
    {
        $this->user = $user;
        $this->emailPin = $emailPin;
    }
}