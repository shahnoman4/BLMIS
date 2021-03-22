<?php
namespace App\Http\Controllers;

use App\Models\Query;
use Illuminate\Support\Facades\Validator;

class QueryController extends Controller{

    private $model;

    public function __construct(Query $model){
        $this->model = $model;
    }

    protected function validator($data)
    {
        return Validator::make($data, [
            'content' => 'required|string'
        ]);
    }
    public function basicSearch($term = null){
        if(!$term){
            $term = request()->q;
        }
        if($this->validator(["content" => $term])->passes()){
            return $this->model->search($term)->get();
        }
        return [];
    }

}