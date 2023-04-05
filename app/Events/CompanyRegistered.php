<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Queue\SerializesModels;

class CompanyRegistered
{
    use SerializesModels;

    public $user;
    public $password;
    
    /**
     * A User will regerster a company
     */

    public function __construct(User $user, $newPassword)
    {
        $this->user = $user;
        $this->password = $newPassword;
    }
}