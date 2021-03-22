<?php
namespace App\Http\Controllers;

use \App\Lookups\ApplicationStatus;
use \App\Lookups\ProfileStatus;
use Illuminate\Http\Request;
use \App\Models\Role;

class RoleController extends Controller{

    public function createGroup(Request $request){
        $data = $request->validate([
            'name' => 'bail|required|string|unique:user_group,name',
            'status_id' => 'required|integer'
        ], [
            'name.required' => 'Group name is required',
            'name.unique' => 'The user group with this name already exists',
            'status_id.required' => 'Status is required'
        ]);
        
        $model = new \App\Models\UserGroup($data);
        $model->save();
        return ['success' => true, 'data' => $model];
    }

    public function updateGroup(Request $request, $id){
        $data = $this->validate($request, [
            'name' => 'bail|required|string|unique:user_group,name,'. $id .',id',
            'status_id' => 'required|numeric'
        ], [
            'name.required' => 'Group name is required',
            'name.unique' => 'The user group with this name already exists',
            'status_id.required' => 'Status is required'
        ]);
        
        $model = \App\Models\UserGroup::findOrFail($id);
        $model->fill($data);
        $model->save();
        return ['success' => true, 'data' => $model];
    }

    public function getGroups(){
        $query = \DB::table('user_group');
        
        $status = request()->status;
        if(!empty($status)){
            $status = \strtolower($status);
            if($status != 'all'){
                $query->where('status_id', $status == 'active' ? ProfileStatus::ACTIVE : ProfileStatus::BLOCKED);
            }
        }
        return $query->get();
    }

    public function createRole(Request $request){
        $data = $this->validateRoleRequest($request);

        $model = Role::add($data);
        return ['success' => true, 'data' => $model];
    }

    public function updateRole(Request $request, $id){
        $data = $this->validateRoleRequest($request, $id);
        $model = Role::findOrFail($id);
        foreach($data['bits'] as &$item){
            $item['role_id'] = $model->id;
        }

        $model->fill($data);
        $model->save();
        \DB::table('role_permission')->where('role_id', $model->id)->delete();
        \DB::table('role_permission')->insert($data['bits']);
        return ['success' => true, 'data' => $model];
    }

    private function validateRoleRequest($request, $id = null){
        return $request->validate([
            'name' => 'bail|required|string|unique:role,name'. ($id ? ','. $id .',id' : ''),
            'status_id' => 'required|integer',
            'authorization_id' => 'required|integer',
            'group_id' => 'required|integer',
            'bits' => 'required|array',
            'bits.*.component_id' => 'integer',
            'bits.*.permission_bit' => 'integer',
        ], [
            'name.required' => 'Role name is required',
            'name.unique' => 'The role with this name already exists',
            'status_id.required' => 'Status is required',
            'group_id.required' => 'Group is required',
            'bits.required' => 'Assign some modules and permissions to this role',
        ]);
    }

    public function getRoles(Request $request){
        $query = Role::with('group');
        
        $status = request()->status;
        if(!empty($status)){
            $status = \strtolower($status);
            if($status != 'all'){
                $query->where('status_id', $status == 'active' ? ProfileStatus::ACTIVE : ProfileStatus::BLOCKED);
            }
        }
        
        return $query->get();
    }

    
    public function getRolePermissions(Request $request, $id){
        return \DB::table('role_permission')->where('role_id', $id)->get();
    }
}