<?php


namespace App\Models;

class LiaisonTopTenNoOfEmp extends Model{
    
    protected $table = 'rpt_liaison_top_ten_no_of_employee';
   
    protected $fillable = ['company_name','total_employee','created_at'];


    public function setNameAttribute($value){
        $this->attributes['company_name'] = encrypt($value);
    }
    
    public function getNameAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'company_name'));
    }

}
