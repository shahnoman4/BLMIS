<?php
use App\Lookups\Authorization;
use App\Lookups\ApplicationStatus;
use Illuminate\Support\Facades\Log;
use App\Lookups\ServiceType;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

function react_config(){
    $data = [
        "LOOKUP" => lookup(),
        "baseURL" => request()->getBaseUrl(),
        "routeBaseURL" => request()->getBaseUrl(),
        "authorized" =>Auth::guard()->check(),
        "lang" => ["en" => ["action" => trans('action')]]
    ];
    if(Auth::guard()->check()){
        $user = Auth::user();
        if($user->isSuperAdmin() || $user->isStakeholder()){
            $user->is_admin = $user->isSuperAdmin();
            $data['permissions'] = getPermissions();
            $data['components'] = getComponents();
            $data["menus"] = config("react.menus.admin");
            $data["routes"] = config("react.routes.admin");
            $data["_theme"] = "admin";
            $data ["routeBaseURL"] = request()->getBaseUrl() . '/admin';
            $permissions = null;
            if($user->role_id){
                $permissions = $user->role->permissions;
            }

            function cleanup($data, $type, $permissions) {
                foreach($data[$type] as $key => &$item){
                    if(isset($item['authorization_id']) && $item['authorization_id'] != Auth::user()->authorization_id){
                        unset($data[$type][$key]);
                    }
                    else if($permissions && isset($item['id'])){
                        $perm = $permissions->firstWhere('component_id', $item['id']);
                        if(!$perm){
                            unset($data[$type][$key]);
                        }
                        else if(isset($item[$type])){
                            $item[$type] = cleanup($item, $type, $permissions);
                        }
                    }
                }
                return array_values($data[$type]);
            }
            $data["menus"] = cleanup($data, 'menus', $permissions);
            $data["routes"] = cleanup($data, 'routes', $permissions);

            if(!empty($data["menus"])){
                $data['redirectTo'] = $data["menus"][0]['to'];
                if(isset($data["menus"][0]['menus']) && !empty($data["menus"][0]['menus'])){
                    $data['redirectTo'] = $data["menus"][0]['menus'][0]['to'];
                }
            }
        }
        else if($user->isCompanyOwner()){
            $data["menus"] = config("react.menus.company");
            $data["routes"] = config("react.routes.company");
            $data["_theme"] = "company";
            foreach($data["menus"] as $key => &$item){
                if(isset($item['active'])){
                    if($item['active'] != $user->company->status_id){
                        $item['active'] = false;
                    }
                    else{
                        unset($item['active']);
                    }
                }
            }
            foreach($data["routes"] as $key => &$item){
                if(isset($item['active'])){
                    if(is_callable($item['active'])){
                        if(!$item['active']($user->company)){
                            $item['content'] = "HttpError";
                        }   
                    }
                    else if($item['active'] != $user->company->status_id){
                        $item['content'] = "HttpError";
                    }
                    unset($item['active']);
                }
            }
        }
        $data["user"] = $user->toArray();
    }
    else if(request()->is("admin*")){
        $data["menus"] = [];
        $data["routes"] = config("react.routes.adminPublic");
        $data["_theme"] = "public";
        $data ["routeBaseURL"] = request()->getBaseUrl() . '/admin';
    }
    else{
        $data["menus"] = config("react.menus.public");
        $data["routes"] = config("react.routes.public");
        $data["_theme"] = "public";
    }

    if($data["_theme"] == "public"){
        $data['G_CAPTCHA'] = config('auth.G_CAPTCHA') === 'ON';
        $data['G_CAPTCHA_KEY'] = config('auth.G_CAPTCHA_KEY');
        $data['MENU_BAR'] = config('auth.MENU_BAR') === 'ON';
        $data['DISCLAIMER'] = config('auth.DISCLAIMER') === 'ON';
    }

    return $data;
}

function lookup($path = null){
    $lookups = require app_path('Lookups/all.php');
    // noman code
    $Count =  \App\Lookups\Country::DATA;
    
    $keys = array_column($Count, 'text');
    array_multisort($keys, SORT_ASC, $Count);
    $Count[] = ['value'=>'Other','text'=>'Other'];
    $lookups["Country"] = ["data" => $Count];

    $City =  \App\Lookups\City::DATA;
    $keys = array_column($City, 'text');
    array_multisort($keys, SORT_ASC, $City);
    $City[] = ['value'=>'Other','text'=>'Other','cc'=>'Other'];
    $lookups["City"] = ["data" => $City];
    // noman code
    //$lookups["City"] = ["data" => \App\Lookups\City::DATA];
    $lookups["Month"] = ["data" => \App\Lookups\Month::DATA];
    if(!$path)
        return $lookups;
    return \Arr::get($lookups, $path);
}

function application_status_id($statusName){
    switch(strtolower($statusName)){
        case 'new' : return ApplicationStatus::NEW;
        case 'circulated' : return ApplicationStatus::CIRCULATED;
        case 'approved' : return ApplicationStatus::APPROVED;
        case 'rejected' : return ApplicationStatus::REJECTED;
        case 'reject' : return ApplicationStatus::REJECTED;
        case 'reverted' : return ApplicationStatus::REVERTED;
        case 'reviewable' : return ApplicationStatus::REJECTED;
        case 'hold' : return ApplicationStatus::HELD;
    }
    return null;
}

function getPermissions(){
    return \DB::table('permission')->get();
}

function getComponents(){
    $data = \DB::table('component')->get();
    $topNodes = $data->filter(function($item){return !$item->parent_id;});
    $nestedNodes = $data->whereNotIn('id', $topNodes->pluck('id')->values());
    $groups = $nestedNodes->groupBy('parent_id');
    $topNodes->each(function($item) use($groups){
        if(isset($groups[$item->id])){
            $item->components = $groups[$item->id];
        }
    });
    return $topNodes->values();
}

function usd_to_pkr($usd){
    return $usd * pkr_rate();
}

function pkr_rate(){
    return config('payment.rate.usd');
}

//returns time based unique id
function uid(){
    return preg_replace('/[\s.]/', '', microtime());
}

function is_main_branch($model){
    return $model->service_type_id == ServiceType::BRANCH || $model->service_type_id == ServiceType::LIAISON;
}

function is_branch($model){
    return $model->service_type_id == ServiceType::BRANCH;
}

function is_sub_branch($model, $orIsSubLiaison = false){
    return $model->service_type_id == ServiceType::SUB_BRANCH || ($orIsSubLiaison && is_sub_liaison($model));
}

function is_liaison($model){
    return $model->service_type_id == ServiceType::LIAISON;
}

function is_sub_liaison($model, $orIsSubBranch = false){
    return $model->service_type_id == ServiceType::SUB_LIAISON || ($orIsSubBranch && is_sub_branch($model));
}

function super_admins(){
    return \App\Models\User::where('authorization_id', Authorization::SUPER_ADMIN)->get();
}

function c_decrypt($val){
    try{
        return $val ? decrypt($val) : $val;
    }
    catch(DecryptException $e){
        return $val;
    }
}

function uploads_path($path = ""){
    return \Storage::disk('uploads')->getDriver()->getAdapter()->applyPathPrefix($path);
}