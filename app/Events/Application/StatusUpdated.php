<?php

namespace App\Events\Application;

use App\Models\Company;
use App\Models\Branch;
use Illuminate\Queue\SerializesModels;

class StatusUpdated
{
    use SerializesModels;

    public $type;
    public $model;
    public $statusId;
    public $statuses;
    public $comments;
    
    public function __construct($model, $oldStatusId, $newStatusId, $comments)
    {
        if($model instanceof Company){
            $this->type = 'signup';
        }
        else if($model instanceof Branch){
            $this->type = 'branch';
        }
        $this->statuses = new \stdClass();
        $this->statusId = $newStatusId;
        $this->statuses->new = $newStatusId;
        $this->statuses->old = $oldStatusId;
        $this->comments = $comments;
        $this->model = $model;
    }
}