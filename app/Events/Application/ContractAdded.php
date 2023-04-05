<?php

namespace App\Events\Application;

use Illuminate\Queue\SerializesModels;

class ContractAdded
{
    use SerializesModels;

    public $model;
    
    public function __construct( $model)
    {
        $this->model = $model;
    }
}