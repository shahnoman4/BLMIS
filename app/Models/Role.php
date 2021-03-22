<?php


namespace App\Models;

class Role extends Model{
    
    protected $table = 'role';

    protected $fillable = ['name', 'group_id', 'status_id', 'authorization_id'];

    public function group(){
        return $this->belongsTo(UserGroup::class);
    }

    public static function add($data){
        $model = new static($data);
        $model->save();
        foreach($data['bits'] as &$item){
            $item['role_id'] = $model->id;
        }
        \DB::table('role_permission')->insert($data['bits']);

        return $model;
    }

    public function getPermissionsAttribute(){
        if(!isset($this->attributes['permissions'])){
            $this->attributes['permissions'] = \DB::table('role_permission')->where('role_id', $this->id)->get();
        }

        return $this->attributes['permissions'];
    }
}
