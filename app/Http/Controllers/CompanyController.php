<?php
namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\EntityMedia;
use App\Models\Contact;
use App\Models\Media;
use App\Models\ApplicationActivity;
use App\Http\Requests\CompanySignupRequest;
use App\Lookups\Authorization;
use App\Lookups\ContactType;
use App\Lookups\ApplicationStatus;
use App\Lookups\MediaType;
use Illuminate\Http\Request;

class CompanyController extends Controller{

    
    public function validateNewCompany(CompanySignupRequest $request){
        return \Response::json(["success"=> true]);
    }

    public function registerNewCompany(CompanySignupRequest $request){
        $data = $request->all();
        //dd($data);
        $account = Company::register($data);
        if(isset($account['organization_id']) && $account['organization_id']!=""){
            $uid = Company::findOrFail($account['organization_id']);
        }else{
            $uid = ""; 
        }
        return \Response::json(["success"=> $account !== null,'data'=>$uid]);
    }

    public function updateProfile(CompanySignupRequest $request){
        $company = Company::find(\Auth::user()->organization_id);
        $request->postProfileValidation($company);
        $data = $request->all();
        $log = $company->updateProfile($data);
        return \Response::json(["success"=> true, "data" => ["log" => $log]]);
    }

    public function profile(){
        $company = Company::withAll()->find(\Auth::user()->organization_id)->appendAll();
        if($company->branch){
            $company->branch->appendAll();
            // dd($company->branch->contacts);
            if($company->branch->contract){
                $company->branch->contract->appendAll();
            }
            if($company->branch->investment){
                $company->branch->investment->appendAll();
            }
            if($company->branch->securityAgency){
                $company->branch->securityAgency->appendAll();
            }
            if($company->branch->payment){
                $company->branch->Payment();
            }
        }
        return $company;
    }

    public function logs(){
        return Company::getlogs(\Auth::user()->organization_id);
    }

    public function getApplications($status = null){
        $query = Company::with(['contacts', 'contacts.location'])->orderBy('updated_at', 'desc');
        $type = request()->app_type;
        if(!empty($type)){
            $status = $type;
        }
        if($status && strtolower($status) !== "all"){
            $statusId = application_status_id($status);
            if(!$statusId){
                return \Response::json(["message" => "Invalid application status {$status}"], 422);
            }
            $query->where('status_id', $statusId);
        }
        
        $searchItem = request()->search_item;

        if(isset($searchItem) && $searchItem!=""){
            
            $query->where('name', 'LIKE', '%' . $searchItem . '%')->where(function($query){
                $query->where('status_id', '!=', ApplicationStatus::REJECTED)->orWhere('updated_at', '>', now()->endOfDay()->subDays(7));
            });
           
        }else{

            $query->where(function($query){
                    $query->where('status_id', '!=', ApplicationStatus::REJECTED)->orWhere('updated_at', '>', now()->endOfDay()->subDays(7));
                });
        }
        $pageSize = request()->per_page;
        $data = $query->paginate($pageSize ? (int)$pageSize : 10);
        $data->each(function($item){
            $item->append('contact');
        });
        return $data;
    }

    public function getApplicationDetail($id){
        $data = Company::with(['contacts', 'contacts.location'])->find($id);
        if($data){
            $data->append(['contact', 'principal_officer', 'directors']);
            return $data;
        }
        return \Response::json(["message" => "Rsource not found"], 404);
    }
    
    public function getApplicationLogs($id){
        return Company::getlogs($id);
    }

    public function getApplicationsStats(){
        return Company::select(\DB::raw('status_id, count(*) as count'))->groupBy('status_id')->get();
    }

    public function pdfBranch($id){
        $signup = $this->getApplicationDetail($id);
        $contact = Contact::select('id')->where('owner_id',$signup->id)->where('owner_type','signup')->where('contact_type_id',ContactType::PRINCIPAL_OFFICER)->first();
        $entity = EntityMedia::where('entity_id',$contact->id)->pluck('media_id');
        //dd($entity);
        $imag = [];
        foreach ($entity as  $value) {
            $media = Media::where('id',$value)->where('media_type',MediaType::DP)->first();
            if($media){
                
               $imag[] =  $media;

            }
        }
        //dd($imag[0]->path);
        return \PDF::loadView('pdf.signup-pdf', ['signup' => $signup,'imag' =>$imag])->download('company-profile.pdf');
    }

    public function pdfdummy($id){
        $signup = $this->getApplicationDetail($id);
        $contact = Contact::select('id')->where('owner_id',$signup->id)->where('owner_type','signup')->where('contact_type_id',ContactType::PRINCIPAL_OFFICER)->first();
        $entity = EntityMedia::where('entity_id',$contact->id)->pluck('media_id');
        //dd($entity);
        $imag = [];
        foreach ($entity as  $value) {
            $media = Media::where('id',$value)->where('media_type',MediaType::DP)->first();
            if($media){
                
               $imag[] =  $media;

            }
        }
        
        return view('pdf.dummy')->with('img',$imag);
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
            if($user->status_id === ApplicationStatus::NEW){
                $user->status_id = ApplicationStatus::UPDATED;
            }
            $user->save();
            return \Response::json(["success"=> true]);
        }

        return \Response::json(["success"=> false, 'errors' => ['current_password' => ['Password does not match our records.']]], 422);
    }

    public function addComments(){
        $this->validate(request(), [
            "comments" => "required|string"
        ]);
        $company = Company::find(\Auth::user()->organization_id);
        $data = \App\Models\ApplicationActivity::logStatus(\Auth::user(), 'signup', $company->id, ApplicationStatus::COMMENTED, request()->all());
        return \Response::json(["success"=> true, "data" => $data]);
    }
}