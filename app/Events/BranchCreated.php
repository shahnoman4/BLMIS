<?php

namespace App\Events;

use App\Models\Company;
use App\Models\Branch;
use Illuminate\Queue\SerializesModels;

class BranchCreated
{
    use SerializesModels;

    public $type;
    public $model;
    public $statusId;
    public $statuses;
    
    public function __construct(Branch $model)
    {
        $this->model = $model;
    }
}