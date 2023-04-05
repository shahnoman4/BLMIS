<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Arr;
use Request;
use Response;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    
    protected $layout = "default";
    
    public function __construct() {
        
    }
    
    /**
     * Set or Get @attribute $layout value
     * @return mixed
     */
    public function layout(){
        if(func_num_args() === 0){
            return $this->layout;
        }
        $this->layout = func_get_arg(0);
        return $this;
    }
}
