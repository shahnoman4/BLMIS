<?php


namespace App\Models;

class UserGroup extends Model{
    
    protected $table = 'user_group';

    protected $fillable = ['name', 'status_id'];
}
