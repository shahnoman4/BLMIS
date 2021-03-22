<?php
namespace App\Http\Controllers;
use \App\Lookups\ApplicationStatus;
use \App\Lookups\ProfileStatus;
use Illuminate\Http\Request;
use \App\Models\User;
use \App\Models\Role;
use \App\Models\SiteConfig;
use \App\Models\SliderImage;
use \App\Lookups\Authorization;
use Illuminate\Support\Facades\Storage;


class UserController extends Controller{

    public function getUsers(Request $request){
        $query = User::with('role')
        ->whereIn('authorization_id', [Authorization::SUPER_ADMIN, Authorization::ADMIN])
        ->where('id', '!=', \Auth::user()->id)
        ->whereNotNull('role_id');
        $status = request()->status;
        if(!empty($status)){
            $status = \strtolower($status);
            if($status != 'all'){
                $query->where('status_id', $status == 'active' ? ProfileStatus::ACTIVE : ProfileStatus::BLOCKED);
            }
        }
        $search = request()->search;
        if(!empty($search)){
            $query->where('user_name','LIKE', '%' . $search . '%');
            $query->orwhere('email','LIKE', '%' . $search . '%');
                //$query->where('status_id', $status == 'active' ? ProfileStatus::ACTIVE : ProfileStatus::BLOCKED);   
        }
        return $query->get()->each(function($item){
            $item->makeVisible('authorization_id');
        });
    }

    public function createUser(Request $request){
        $data = $this->validateRequest($request);
        $role = Role::findOrFail($data['role_id']);
        $model = new User($data);
        $model->status_id = $data['status_id'];
        $model->role_id = $role->id;
        $model->authorization_id = $role->authorization_id;
        $model->password = \Hash::make($data['password']);
        $model->save();
        return \Response::json(['success' => true, 'data' => $model]);
    }

    public function updateUser(Request $request, $id){
        $data = $this->validateRequest($request, $id);
        $role = Role::findOrFail($data['role_id']);
        $model = User::findOrFail($id);
        $model->fill($data);
        $model->status_id = $data['status_id'];
        $model->role_id = $role->id;
        $model->authorization_id = $role->authorization_id;
        if(!empty(trim(\Arr::get($data, 'password')))){
            $model->password = \Hash::make($data['password']);
        }
        $dirty = $model->isDirty();
        $model->save();
        return \Response::json(['success' => true, 'data' => $model, 'updated' => $dirty]);
    }

    private function validateRequest($request, $id = null){
        return $request->validate([
            'full_name' => 'required|string',
            'user_name' => 'required|string|not_email|unique:user,user_name' . ($id ? ','. $id .',id' : ''),
            'email' => 'required|email|business_email|unique:user,email' . ($id ? ','. $id .',id' : ''),
            'password' => ($id ? 'nullable|' : 'required|') . 'string|strong_password:8',
            'status_id' => 'required|numeric',
            'role_id' => 'required|numeric',
        ]);
    }

    public function updatePassword(Request $request){
        $data = $this->validate($request, [
            'current_password' => 'required|string',
            'password' => 'required|string|different:current_password|strong_password:8|confirmed',
            // 'password' => 'required|string|confirmed',
        ], [
            'password.different' => 'The current password and new password must be different.'
        ]);

        $user = \Auth::user();

        if (\Hash::check($data['current_password'], $user->password)) {
            $user->password = \Hash::make($data['password']);
            $user->save();
            return \Response::json(["success"=> true]);
        }

        return \Response::json(["success"=> false, 'errors' => ['current_password' => ['Password does not match our records.']]], 422);
    }


    public function updateCompanyPassword(Request $request){
        $data = $this->validate($request, [
            'password' => 'required|string|strong_password:8|confirmed',
            // 'password' => 'required|string|confirmed',
        ]);

        $user = User::where('organization_id',$request->id)->first();

        if ($user) {
            $user->password = \Hash::make($data['password']);
            $user->save();
            return \Response::json(["success"=> true]);
        }

        return \Response::json(["success"=> false, 'errors' => ['user' => ['User not found.']]], 422);
    }

    public function getSiteConfig()
    {
        $data = SiteConfig::findOrFail(1);
        return response()->json($data);
    }

    public function siteConfig(Request $request){
        $data = $this->validate($request, [
            'description' => 'required|string',
            'title_1' => 'required|string',
            'notes' => 'required|string',
            'video_link' => 'required|string',
        ]);
        //dd($request->all());
        $user = \Auth::user();

        
        $data = SiteConfig::findOrFail(1);
        if($data){
            $data->description = $request->description;
            $data->title_1 = $request->title_1;
            $data->notes = $request->notes;
            $data->video_link = $request->video_link;
            $data->user_id = $user->id;
            $data->save();
          return \Response::json(["success"=> true,'data'=>$data]);  
        }
        
        return \Response::json(["success"=> false, 'errors' => ['slider' => ['Something went worng!']]], 422);
    }

    public function createSlider(Request $request){
         //dd($request->all());
        $data = $request->validate([
            'title_1' => 'required',
            'title_2' => 'required',
            'title_3' => 'required',
            //'uploads' => 'required',
            'status_id' => 'required|integer'
        ], [
            'title_1.required' => 'Title 1 name is required',
            'title_2.required' => 'Title 2 name is required',
            'title_3.required' => 'Title 3 name is required',
            //'uploads.unique' => 'Image name is required',
            'status_id.required' => 'Status is required'
        ]);
        //dd($request['attachments']['0']['path']);
        $file = $request['uploads']['filename'];
        $media = new \App\Models\Media;
        $media->fillFromPath($request['uploads']['path'], $file, $type=null);
        $filename =  time() . "{$file}";
        $newPath = "slider/{$file}";
        
        
        
        $model = new \App\Models\SliderImage;
        $model->title_1 = $request->title_1;
        $model->title_2 = $request->title_2;
        $model->title_3 = $request->title_3;
        $model->status_id = $request->status_id;

        if(Storage::disk('uploads')->put($newPath, Storage::get($media->path))){
            Storage::delete($media->path);
            $model->uploads = $file; //client orginal name
            $model->path = $newPath;
            $model->url = Storage::disk('uploads')->url($newPath);
        }
        $model->save();
        return ['success' => true, 'data' => $model];
    }

    public function updateSlider(Request $request, $id){
        //dd($request->all());
        $data = $this->validate($request, [
            'title_1' => 'required',
            'title_2' => 'required',
            'title_3' => 'required',
            //'uploads' => 'required',
            'status_id' => 'required|integer'
        ], [
            'title_1.required' => 'Title 1 name is required',
            'title_2.required' => 'Title 2 name is required',
            'title_3.required' => 'Title 3 name is required',
            //'uploads.unique' => 'Image name is required',
            'status_id.required' => 'Status is required'
        ]);
        
        $model = \App\Models\SliderImage::findOrFail($id);
        $model->title_1 = $request->title_1;
        $model->title_2 = $request->title_2;
        $model->title_3 = $request->title_3;
        $model->status_id = $request->status_id;
        
        if(isset($request['uploads']['filename']) && $request['uploads']['filename']!=""){
        $file = $request['uploads']['filename'];
        $media = new \App\Models\Media;
        $media->fillFromPath($request['uploads']['path'], $file, $type=null);
        $filename =  time() . "{$file}";
        $newPath = "slider/{$file}";
        
            if(Storage::disk('uploads')->put($newPath, Storage::get($media->path))){
                Storage::delete($media->path);
                $model->uploads = $file; //client orginal name
                $model->path = $newPath;
                $model->url = Storage::disk('uploads')->url($newPath);
            }
        }
        $model->save();
        return ['success' => true, 'data' => $model];
    }

    public function getSliders(){
        $query = \DB::table('slider_images');
        
        $status = request()->status;
        if(!empty($status)){
            $status = \strtolower($status);
            if($status != 'all'){
                $query->where('status_id', $status == 'active' ? ProfileStatus::ACTIVE : ProfileStatus::BLOCKED);
            }
        }
        return $query->get();
    }

}