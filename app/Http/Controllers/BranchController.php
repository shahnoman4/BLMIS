<?php
namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\Company;
use App\Models\Branch;
use App\Models\Payment;
use App\Models\Contact;
use App\Models\Renewal;
use App\Models\Contract;
use App\Models\Role;
use App\Models\EntityMedia;
use App\Models\ApplicationActivity;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\BranchApplicationRequest;
use App\Http\Requests\BranchRenewalRequest;
use App\Lookups\Authorization;
use \App\Lookups\ApplicationStatus;
use \App\Lookups\ServiceType;
use \App\Lookups\ContactType;
use \App\Lookups\MediaType;
use Illuminate\Support\Facades\Storage;

class BranchController extends Controller{
    
    public function validateNewBranch(BranchApplicationRequest $request){
        if(\Arr::get($request->all(), 'Branch')){
            Storage::put('state/' . \Auth::user()->id . '/branch/state.json', json_encode($request->all()), 'private');
        }
        return \Response::json(["success"=> true]);
    }
    
    public function validateNewBranchBeforeSubmit(BranchApplicationRequest $request){
        $company = Company::with('branch')->findOrFail(\Auth::user()->organization_id);
        $data = $request->all();
        $branch = new Branch(\Arr::get($data, 'Branch'));
        $fee = $branch->calculateFee($company);
        if($request->step){
            Storage::put('state/' . \Auth::user()->id . '/branch/state.json', json_encode($data), 'private');
        }
        return \Response::json(["success"=> true, 'fee' => $fee]);
    }
    
    public function validateNewSubBranchBeforeSubmit(Request $request){
        //dd($request->all());
        $data = $request->all();
        $company = Company::with('branch')->findOrFail(\Auth::user()->organization_id);
        $datas = $request->validate([
            'Branch.desired_location' => 'required',
            'Branch.desired_places' => 'required',
            'Branch.business_info' => 'required',
            'Branch.business_info' => 'required',
        ], [
            "*.*.required" => 'This field is required'
        ]);
        //dd($data);
        $branch = $company->branch;
        if(!$branch){
            return \Response::json(["message" => "Invalid request."], 422);
        }
        $subBranch = new Branch(\Arr::get($data, 'Branch'));
        $subBranch->service_type_id = \is_branch($branch) ? ServiceType::SUB_BRANCH : ServiceType::SUB_LIAISON;
        $fee = $subBranch->calculateFee($company);
        Storage::put('state/' . \Auth::user()->id . '/sub-branch/state.json', json_encode($data), 'private');
        return \Response::json(["success"=> true, 'fee' => $fee, 'data' => $subBranch]);
    }

    public function getEditorState(){
        if(Storage::exists('state/' . \Auth::user()->id . '/branch/state.json')){
            return Storage::get('state/' . \Auth::user()->id . '/branch/state.json');
        }
        return [];
    }

    public function addNewBranch(BranchApplicationRequest $request){
        $company = Company::with('branch')->findOrFail(\Auth::user()->organization_id);

        if($company->status_id !== ApplicationStatus::APPROVED){
            return \Response::json(["message" => "Invalid request."], 422);
        }

        $branchType = \Arr::get($request->all(), 'Branch.service_type_id');
        /*if($company->branch && $company->branch->status_id != ApplicationStatus::APPROVED){
            return \Response::json(["message" => "An application for branch permission is already submitted."], 422);
        }
        else */if($company->branch && ($branchType == ServiceType::BRANCH || $branchType == ServiceType::LIAISON)){
            if(Storage::exists('state/' . \Auth::user()->id . '/branch/state.json')){
                Storage::delete('state/' . \Auth::user()->id . '/branch/state.json');
            }
            return \Response::json(["message" => "Multiple applications for branch/liaison office permission are not allowed."], 422);
        }
        else{
            $branch = Branch::register($company, $request->validated());
            
            if($branch){
                if(Storage::exists('state/' . \Auth::user()->id . '/branch/state.json')){
                    Storage::delete('state/' . \Auth::user()->id . '/branch/state.json');
                }
            }
            return \Response::json(["success"=> true, "data" => $branch]);
        }
    }

    public function addNewBranchAfterReview(Request $request){
        $company = Company::with('branch')->findOrFail(\Auth::user()->organization_id);

        if($company->status_id !== ApplicationStatus::APPROVED){
            return \Response::json(["message" => "Invalid request."], 422);
        }
        if(Storage::exists('state/' . \Auth::user()->id . '/branch/state.json')){
            $data = json_decode(Storage::get('state/' . \Auth::user()->id . '/branch/state.json'), true);
        }
        else{
            return \Response::json(["message" => "Invalid request."], 422);
        }
        $manualPayment = \Arr::get($request->all(), 'Payment');
        if($manualPayment){
            $data['Payment'] = $manualPayment;
        }
        $branchRequest = new \App\Http\Requests\BranchApplicationRequest($data);
        $validator = \Validator::make($branchRequest->all(), $branchRequest->rules(request()), $branchRequest->messages(request()));
        
        if ($validator->fails()) {
            return \Response::json(["message" => "Invalid request.", "errors" => $validator->messages()], 422);
        }
        $doRenew = false;
        if($company->was_permitted && !$company->branch){
            $renewalRequest = new \App\Http\Requests\BranchRenewalRequest(\Arr::get($data, 'Renewal'));
            $validator = \Validator::make($renewalRequest->all(), $renewalRequest->rules(request()), $renewalRequest->messages(request()));
            
            if ($validator->fails()) {
                return \Response::json(["message" => "Invalid request.", "errors" => $validator->messages()], 422);
            }
            $doRenew = true;
        }
        $branchType = \Arr::get($data, 'Branch.service_type_id');
        $doConvert = \Arr::get($data, 'convert');
        
        if($company->branch && $company->branch->status_id != ApplicationStatus::APPROVED){
            return \Response::json(["message" => "An application for branch permission is already submitted."], 422);
        }
        else  if($company->branch && $doConvert !== true && ($branchType == ServiceType::BRANCH || $branchType == ServiceType::LIAISON)){
            if(Storage::exists('state/' . \Auth::user()->id . '/branch/state.json')){
                Storage::delete('state/' . \Auth::user()->id . '/branch/state.json');
            }
            return \Response::json(["message" => "Multiple applications for branch/liaison office permission are not allowed."], 422);
        }
        else if($doConvert === true && $company->branch && $company->branch->status_id != ApplicationStatus::APPROVED){
            if(Storage::exists('state/' . \Auth::user()->id . '/branch/state.json')){
                Storage::delete('state/' . \Auth::user()->id . '/branch/state.json');
            }
            return \Response::json(["message" => "Applications for branch/liaison office permission cannot be applied for conversion unless approved."], 422);
        }
        else if($doConvert === true && $company->branch && (!\in_array((int)$branchType, [ServiceType::BRANCH, ServiceType::LIAISON]) || $branchType == $company->branch->service_type_id)){
            if(Storage::exists('state/' . \Auth::user()->id . '/branch/state.json')){
                Storage::delete('state/' . \Auth::user()->id . '/branch/state.json');
            }
            return \Response::json(["message" => "Unsupported conversion is applied."], 422);
        }
        else{
            $branch = Branch::register($company, $data, true, $doConvert);
                if($branch){
                    if(Storage::exists('state/' . \Auth::user()->id . '/branch/state.json')){
                        Storage::delete('state/' . \Auth::user()->id . '/branch/state.json');
                    }
                  $success = true;  
                }else{
                   $success = false; 
                }    
            if($doRenew){
                $renewal = Renewal::make($renewalRequest->all(), $branch);
            }
            if($manualPayment){
                //manual payment
                return ['success' => $success, 'data' => $branch];
            }
            else{
                return $this->showPaymentForm($branch->id);
            }
        }
    }

    public function addNewSubBranchAfterReview(Request $request){
        $company = Company::with('branch')->findOrFail(\Auth::user()->organization_id);
        if($company->status_id !== ApplicationStatus::APPROVED){
            
            return \Response::json(["message" => "Invalid request."], 422);
        }
        $branch = $company->branch;
        if(!$branch){
            return \Response::json(["message" => "Invalid request."], 422);
        }
        if(Storage::exists('state/' . \Auth::user()->id . '/sub-branch/state.json')){
            $data = json_decode(Storage::get('state/' . \Auth::user()->id . '/sub-branch/state.json'), true);
        }
        else{
            return \Response::json(["message" => "Invalid request."], 422);
        }
        $manualPayment = \Arr::get($request->all(), 'Payment');
        if($manualPayment){
            $data['Payment'] = $manualPayment;
        }

        $validator = \Validator::make($data, [
            'Branch.desired_location' => 'required',
            'Branch.desired_places' => 'required',
            'Branch.business_info' => 'required',
            'Payment.challanNo' => 'required_with:Payment',
            'Payment.challanCopy' => 'required_with:Payment|temp_file'
        ], [
            "*.*.required" => 'This field is required'
        ]);
        if($validator->fails()){
            return \Response::json(["message" => "Invalid request.", "errors" => $validator->messages()], 422);
        }

        $data['Branch']['service_type_id'] = \is_branch($branch) ? ServiceType::SUB_BRANCH : ServiceType::SUB_LIAISON;
        $subBranch = Branch::registerSubBranch($company, $data, true);
        if(Storage::exists('state/' . \Auth::user()->id . '/sub-branch/state.json')){
            // Storage::delete('state/' . \Auth::user()->id . '/sub-branch/state.json');
        }
        if($manualPayment){
            //manual payment
            return ['success' => true, 'data' => $subBranch];
        }
        else{
            return $this->showPaymentForm($subBranch->id);
        }
    }

    public function updateProfile(BranchApplicationRequest $request, $id){
        $query = Branch::withAll()->with('company')->where('organization_id', \Auth::user()->organization_id);
        $model = $query->findOrFail($id);
        $request->postProfileValidation($model);
        $data = $request->all();
        $log = $model->updateProfile($data);
        return \Response::json(["success"=> true, "data" => ["log" => $log]]);
    }

    public function getSubBranches(){
        return Branch::with(['contacts', 'contacts.location','payment'])
            ->where('organization_id', \Auth::user()->organization_id)
            ->whereNotIn('service_type_id', [ServiceType::BRANCH, ServiceType::LIAISON])
            ->select(['id', 'status_id', 'desired_location', 'desired_places', 'business_info'])->get();
    }

    public function getProfile($id){
        $branch = Branch::withAll()->where('organization_id', \Auth::user()->organization_id)->findOrFail($id);
        if(\is_main_branch($branch)){
            $branch->appendAll();
        }
        if($branch->contract){
            $branch->contract->appendAll();
        }
        if($branch->investment){
            $branch->investment->appendAll();
        }
        if($branch->securityAgency){
            $branch->securityAgency->appendAll();
        }

        return $branch;
    }

    public function logs($id = null){
        return Branch::getlogs(\Auth::user()->organization_id, $id);
    }


    public function getApplications($status = null){
        $query = Branch::with(['contacts', 'company'])->orderBy('branch.updated_at', 'desc');
        $query->select('branch.*');
        $converted = filter_var(request()->converted, FILTER_VALIDATE_BOOLEAN);
        $type = request()->app_type;
        if(!empty($type)){
            $status = $type;
        }
        if($status){
            $status = strtolower($status);
        }
        if($status == 'all'){
            $status = null;
        }

        if($converted){
            $query->whereNotNull('branch.converted_from');
        }
        else{
            if(!$status){
                $query->where(function($query){
                    $query->whereNull('branch.converted_from')->orWhereIn('branch.status_id', [ApplicationStatus::APPROVED, ApplicationStatus::REJECTED]);
                });
            }
            else if($status !== "reviewable" && $status !== "approved"){
                $query->whereNull('branch.converted_from');
            }
            $query->leftJoin(Branch::table('b2'), 'b2.converted_from', '=', 'branch.id');
            $query->where(function($query){
                $query->whereNull('b2.id')->orWhere('b2.status_id', '=', ApplicationStatus::REJECTED);
            });
            $query->groupBy('branch.id');
        }
       
        $searchItem = request()->search_item;
        $searchType = request()->search_type;
        
        if((isset($searchType) && $searchType!="") && (isset($searchItem) && $searchItem!="")){
            
            if($searchType=="company_name"){
               
               $query->whereHas('company',function($q) use ($searchItem) 
               {
                    $q->where('name', 'LIKE', '%' . $searchItem . '%');
                    $q->where('branch.status_id', '!=', ApplicationStatus::PAYMENT_PENDING);
                });
                
            }else if($searchType=="file_no"){
            
               $query->where('branch.file_no', 'LIKE', '%' . $searchItem . '%')->where('branch.status_id', '!=', ApplicationStatus::PAYMENT_PENDING);  
            }   
        }else{

          $query->where('branch.status_id', '!=', ApplicationStatus::PAYMENT_PENDING);

        }
        $serviceType = request()->service_type;
        if($serviceType == 'liaison'){
            $query->whereIn('branch.service_type_id', [ServiceType::LIAISON, ServiceType::SUB_LIAISON, ServiceType::LIAISON_CONVERSION]);
        }
        else if($serviceType == 'branch'){
            $query->whereIn('branch.service_type_id', [ServiceType::BRANCH, ServiceType::SUB_BRANCH, ServiceType::BRANCH_CONVERSION]);
        }
        if($status === "recent"){
            $query->where('branch.updated_at', '>=', now()->subWeeks(7));//->where('status_id', '!=', ApplicationStatus::CIRCULATED);
        }
        else if($status === "reviewable" && \Auth::user()->isSuperAdmin()){ // rejected but still can submit to review
            $query->where('branch.status_id', ApplicationStatus::REJECTED)->where('branch.attempts', '<', Branch::ALLOWED_ATTEMPTS);
        }
        else if($status === "reject" && \Auth::user()->isSuperAdmin()){ // rejected but still can submit to review
            $query->where('branch.status_id', ApplicationStatus::REJECTED)->where('branch.attempts', '<', Branch::ALLOWED_ATTEMPTS);
        }

        else if($status === "rejected"){ // completely rejected -- cannot submit for review
            $query->where('branch.status_id', ApplicationStatus::REJECTED)->where('branch.attempts', '>=', Branch::ALLOWED_ATTEMPTS);
        }
        else if($status === "expiring"){
            $query->whereRaw("date_add(str_to_date(concat('1', '/', branch.start_month, '/', branch.start_year), '%d/%m/%Y'), interval branch.permission_period year) between utc_date() and date_add(utc_date(), interval ". Branch::EXPIRES_AFTER_MONTH ." month)");
        }
        else if($status === "expired"){
            $query->whereRaw("date_add(str_to_date(concat('1', '/', branch.start_month, '/', branch.start_year), '%d/%m/%Y'), interval branch.permission_period year) < utc_date()");
        }
        else if($status === "matured"){

            $query->whereIn('branch.status_id', [ApplicationStatus::NEW, ApplicationStatus::CIRCULATED, ApplicationStatus::SUBMITTED]);
            $query->join('app_circular AS ac', 'ac.branch_id', '=', 'branch.id');
            $query->join('user AS u', 'u.role_id', '=', 'ac.role_id');
            $query->leftJoin('app_activity_log AS log', function($join){
                $join
                    ->on('log.user_id', '=', 'u.id')
                    ->where('log.entity_type', 'branch')
                    ->on('log.entity_id', '=', 'ac.branch_id')
                    ->whereIn('log.status_id', [ApplicationStatus::APPROVED, ApplicationStatus::REJECTED]);
            });
            $query->where(function($query){
                $query
                    ->whereNotNull('log.status_id')
                    ->orWhere('branch.updated_at', '<=', now()->endOfDay()->subWeeks(Branch::MATURE_AGE));
            });
            //dd($query->get());
        }
        else if($status){
            $statusId = application_status_id($status);
            if(!$statusId){
                return \Response::json(["message" => "Invalid application status {$status}"], 422);
            }
            if(\Auth::user()->isStakeholder()){
                $query->whereRaw('IFNULL(log.status_id, '. ApplicationStatus::NEW .') = ?', [$statusId]);
            }
            else{
                $query->where('branch.status_id', $statusId);
            }
        }

        if(\Auth::user()->isStakeholder()){
            $query->whereRaw('branch.id in (select `branch_id` from `app_circular` where `role_id` = ?)', [\Auth::user()->role_id]);
            $query->selectRaw(
                'branch.*, IFNULL(log.status_id, '. ApplicationStatus::NEW .') as status_id'
            );
            $query->leftJoin(
                \DB::raw("(SELECT alog.`status_id`, alog.entity_id FROM `app_activity_log` as alog LEFT JOIN `app_activity_log` as alog2 ON alog.entity_id = alog2.entity_id AND alog.entity_type = alog2.entity_type AND alog.user_id = alog2.user_id AND alog.performed_at < alog2.performed_at WHERE alog.`status_id` NOT IN (". implode(',', [ApplicationStatus::COMMENTED]) .") AND alog.user_id = '". \Auth::user()->id ."' AND alog.entity_type = 'branch' AND alog2.id IS NULL) as log"),
                'log.entity_id', '=', 'branch.id'
            );
        }
        // if(!empty($type)){
        //     $status = $type;
        // }
        $pageSize = request()->per_page;
        $data = $query->paginate($pageSize ? (int)$pageSize : 10);
        $parentBranchIDs = [];
        $data->each(function($item, $idx) use(&$parentBranchIDs){
            if(\Auth::user()->isSuperAdmin()){
              //if(isset($status) && $status === "matured"){
                  $item->append(['is_approvable', 'is_rejectable']);
               //}
            }
            if(\is_main_branch($item)){
                // $item->appendAll();
                $item->append('local_contact');
            }
            else{
                $parentBranchIDs[$idx] = $item->parent_id;
            }
        });
        
        if(!empty($parentBranchIDs)){
            $localContacts = Contact::where('contact_type_id', ContactType::LOCAL_CONTACT)
                ->where('owner_type', 'branch')->whereIn('owner_id', $parentBranchIDs)
                ->get()->groupBy('owner_id');
            foreach($parentBranchIDs as $idx => $parentId){
                $data[$idx]->setAttribute('local_contact', $localContacts[$parentId][0]);
            }
        }
        return $data;
    }


    public function getRenewalRequests(){
        $query = Branch::with('company');
        $query->join(Renewal::table('ren'), 'branch.id', 'ren.branch_id');
        $query->whereNotIn('status_id', [ApplicationStatus::APPROVED, ApplicationStatus::REJECTED,ApplicationStatus::PAYMENT_PENDING]);
        
        $type = request()->app_type;
        if(!empty($type)){
            $type = \strtolower($type);
            if($type != 'all'){
                $query->where('service_type_id', $type == 'branch' ? ServiceType::BRANCH : ServiceType::LIAISON);
            }
        }

        /**
         * Get latest renewal request of each branch
         */
        $query->leftJoin(Renewal::table('ren2'), function($join){
            $join->on('branch.id', '=', 'ren2.branch_id')
            ->whereRaw('ren.renewed_at < ren2.renewed_at');
        });
        $query->whereNull('ren2.branch_id');

        $query->select('branch.*', 'ren.renewal_period', 'ren.id as ren_id');
        
        $pageSize = request()->per_page;
        $data = $query->paginate($pageSize ? (int)$pageSize : 10);
        $data->each(function($item){
            // $item->appendAll();
            $item->append('local_contact');
        });
        return $data;
    }

    public function getContractRequests(){
        $query = Contract::with(['branch', 'branch.company']);
        $query->join(Branch::table('branch'), 'branch.id', 'contract.branch_id');

        $branchId = \request()->application_id;
        if($branchId){
            $query->where('contract.branch_id', $branchId);
        }
        else{
            $query->where('branch.status_id', ApplicationStatus::APPROVED);
            $query->where('contract.status_id', ApplicationStatus::NEW);
        }
        
        if(\Auth::user()->isStakeholder()){
            $query->whereNotNull('contract.shared_at');
            $query->whereRaw('contract.branch_id in (select `branch_id` from `app_circular` where `role_id` = ?)', [\Auth::user()->role_id]);
        }

        /**
         * Get latest contract of each branch
         */
        // $query->leftJoin(Contract::table('c2'), function($join){
        //     $join->on('contract.branch_id', '=', 'c2.branch_id')
        //     ->whereRaw('contract.created_at < c2.created_at');
        // });
        // $query->whereNull('c2.branch_id');

        $query->select('contract.*');
        
        $pageSize = request()->per_page;
        $data = $query->paginate($pageSize ? (int)$pageSize : 10);
        $data->each(function($item){
            $item->branch->append('local_contact');
        });
        return $data;
    }
    public function getContractDetail($id){
        $model = Contract::withAll()->findOrFail($id);
        $model->appendAll();
        // $model->branch->append('local_contact');
        return $model;
    }
    public function getContractLogs($id){
        $contract = Contract::with(['branch', 'branch.company'])->findOrFail($id);
        
        return $contract->getLogs();
    }

    public function getApplicationDetail($id){
        //dd($id);
        $query = Branch::withoutAttachements()->with(['company', 'company.contacts', 'company.contacts.location','payment','renewalRequest']);

        $query->where('branch.status_id', '!=', ApplicationStatus::PAYMENT_PENDING);
        
        if(\Auth::user()->isStakeholder()){
            $childBranch = \DB::table('branch')->where('parent_id',$id)->first();
           
            if($childBranch){
             $stake = \DB::table('app_circular')->where('role_id', \Auth::user()->role_id)->where('branch_id', $childBranch->id)->first();
                if($stake){
                
                $query->selectRaw(
                    'branch.*, IFNULL(log.status_id, '. ApplicationStatus::NEW .') as status_id'
                );

                $query->leftJoin(
                    \DB::raw("(SELECT alog.`status_id`, alog.entity_id FROM `app_activity_log` as alog LEFT JOIN `app_activity_log` as alog2 ON alog.entity_id = alog2.entity_id AND alog.entity_type = alog2.entity_type AND alog.user_id = alog2.user_id AND alog.performed_at < alog2.performed_at WHERE alog.`status_id` NOT IN (". implode(',', [ApplicationStatus::COMMENTED]) .") AND alog.user_id = '". \Auth::user()->id ."' AND alog.entity_type = 'branch' AND alog2.id IS NULL) as log"),
                    'log.entity_id', '=', 'branch.id'
                );
               }
            }else{

                
                 $query->whereRaw('id in (select `branch_id` from `app_circular` where `role_id` = ?)', [\Auth::user()->role_id]);
                
                $query->selectRaw(
                    'branch.*, IFNULL(log.status_id, '. ApplicationStatus::NEW .') as status_id'
                );

                $query->leftJoin(
                    \DB::raw("(SELECT alog.`status_id`, alog.entity_id FROM `app_activity_log` as alog LEFT JOIN `app_activity_log` as alog2 ON alog.entity_id = alog2.entity_id AND alog.entity_type = alog2.entity_type AND alog.user_id = alog2.user_id AND alog.performed_at < alog2.performed_at WHERE alog.`status_id` NOT IN (". implode(',', [ApplicationStatus::COMMENTED]) .") AND alog.user_id = '". \Auth::user()->id ."' AND alog.entity_type = 'branch' AND alog2.id IS NULL) as log"),
                    'log.entity_id', '=', 'branch.id'
                );

            }

        }
        //echo $id."parent id";
        $data = $query->findOrFail($id);
        //print_r($data);
        if($data){
            if(\is_main_branch($data)){
                $data->appendAll();
            }
            else{
                //dd($data->parent_id);
                $branch = $this->getApplicationDetail($data->parent_id);
                foreach($data->getAttributes() as $key => $value){
                    if($value !== null){
                        $branch->$key = $value; 
                    }
                }
                $branch->setRelation('payment', $data->payment);
                $data = $branch;
            }
            if(\Auth::user()->isSuperAdmin()){
                $data->append(['is_approvable', 'is_rejectable']);

                $roleId = \DB::table('app_circular')->where('branch_id',$id)->pluck('role_id');
        
                if (count($roleId)>0) {
                    $roles = Role::whereIN('id',$roleId)->get();
                    $data['roles'] = $roles;
                }
            }

            if($data->renewalRequest){
                $data['is_renewal'] = 1;
            }else{
                $data['is_renewal'] = 0;
            }
            $data->company->append('contact');

            return $data;
        }
        return \Response::json(["message" => "Rsource not found"], 404);
    }
    public function getApplicationLogs($id){
        return Branch::getlogs(null, $id);
    }

    public function getApplicationsStats(){
        if(\Auth::user()->isStakeholder()){
            $query = Branch::selectRaw(
                'count(*) as count, IFNULL(log.status_id, '. ApplicationStatus::NEW .') as status_id'
            )
            ->leftJoin(
                \DB::raw("(SELECT alog.`status_id`, alog.entity_id FROM `app_activity_log` as alog LEFT JOIN `app_activity_log` as alog2 ON alog.entity_id = alog2.entity_id AND alog.entity_type = alog2.entity_type AND alog.user_id = alog2.user_id AND alog.performed_at < alog2.performed_at WHERE alog.`status_id` NOT IN (". implode(',', [ApplicationStatus::COMMENTED]) .") AND alog.user_id = '". \Auth::user()->id ."' AND alog.entity_type = 'branch' AND alog2.id IS NULL) as log"),
                'log.entity_id', '=', 'branch.id'
            )
            ->whereRaw('branch.id in (select `branch_id` from `app_circular` where `role_id` = ?)', [\Auth::user()->role_id])
            ->groupBy('log.status_id');
        }
        else{
            $query = Branch::select(\DB::raw('status_id, count(*) as count'))->groupBy('status_id');
        }
        
        
        $serviceType = request()->service_type;
        if($serviceType == 'liaison'){
            $query->whereIn('service_type_id', [ServiceType::LIAISON, ServiceType::SUB_LIAISON, ServiceType::LIAISON_CONVERSION]);
        }
        else if($serviceType == 'branch'){
            $query->whereIn('service_type_id', [ServiceType::BRANCH, ServiceType::SUB_BRANCH, ServiceType::BRANCH_CONVERSION]);
        }
        
        $query->where('branch.status_id', '!=', ApplicationStatus::PAYMENT_PENDING);

        return $query->get();

    }

    public function addComments($id){
        $this->validate(request(), [
            "comments" => "required|string"
        ]);
        $data = \App\Models\ApplicationActivity::logStatus(\Auth::user(), 'branch', $id, ApplicationStatus::COMMENTED, request()->all());
        return \Response::json(["success"=> true, "data" => $data]);
    }

    public function validateRenewApplication(BranchRenewalRequest $request){
        //dd($request->all());
        if(Storage::exists('state/' . \Auth::user()->id . '/branch/state.json')){
            $data = json_decode(Storage::get('state/' . \Auth::user()->id . '/branch/state.json'), true);
            $data['Renewal'] = $request->all();
            $data['step'] = 5;
            Storage::put('state/' . \Auth::user()->id . '/branch/state.json', json_encode($data), 'private');
        }
        else{
            return \Response::json(["success"=> false, "message" => "Invalid request"]);
        }
        return \Response::json(["success"=> true]);
    }

    public function renewApplication(BranchRenewalRequest $request, $id){
        //dd($request->all());
        $query = Branch::with('company')->where('organization_id', \Auth::user()->organization_id);
        $branch = $query->findOrFail($id);
        $branch->locked = 1;
        $branch->status_id = ApplicationStatus::PAYMENT_PENDING;
        $branch->save();

        $renewal = Renewal::make($request->all(), $branch);
        $fee = $renewal->calculateFee($branch);
        $renewal->fee = $fee;

        $payment = new Payment;
        $payment->uid = uid();
        $payment->status_id = ApplicationStatus::NEW;
        $payment->entity_type = 'renewal';
        $payment->entity_id = $renewal->id;
        $payment->usd_amount = $fee['usd'];
        $payment->usd_discount = 0;
        $payment->pkr_rate = pkr_rate();
        $payment->save();
        $payment->usd_amount = \number_format($payment->usd_amount, 2, '.', '');
        $payment->append('pkr_amount');

        ApplicationActivity::logStatus(\Auth::user(), 'branch', $branch->id, ApplicationStatus::RENEWED);

        return \Response::json(["success"=> true, "data" => $payment]);
    }
    
    public function reviewApplication($id){
        $query = Branch::where('organization_id', \Auth::user()->organization_id);
        $branch = $query->findOrFail($id);
        if($branch->status_id == ApplicationStatus::REJECTED){
            if($branch->attempts < Branch::ALLOWED_ATTEMPTS){
                $branch->attempts += 1;
                $branch->status_id = ApplicationStatus::SUBMITTED;
                $branch->locked = 1;
                $branch->save();
                ApplicationActivity::logStatus(\Auth::user(), 'branch', $branch->id, ApplicationStatus::SUBMITTED);
                return \Response::json(["success"=> true, "data" => ["status_id" => $branch->status_id]]);
            }
            else{
                return \Response::json(["success"=> false, "message" => 'You have already consumed all available reviews.'], 422);
            }
        }

        return \Response::json(["success"=> false, "message" => 'Application cannot be submited for review.'], 422);
    }

    public function showPaymentForm($id){
        $branch = Branch::with('renewalRequest')->where('organization_id', \Auth::user()->organization_id)->findOrFail($id);
        if($branch->renewalRequest && $branch->renewalRequest->payment){
            $payment = $branch->renewalRequest->payment;
        }
        else{
            $payment = $branch->payment;
        }
        $requestData = $payment->prepareJazzRequestData();
        $payment->pp_request_payload = \json_encode($requestData);
        $payment->save();
        return view('payment-iframe', ['payment' => $payment, 'data' => $requestData, 'branch' => $branch]);
    }

    public function showJazzResponse(){
        // $ppData = request()->all(); //laravel trims the input data but here we need NOT TO TRIM it
        $ppData = $_POST;
        $paymentUid = \Arr::get($ppData, 'pp_BillReference');
        $payment = Payment::where('uid', $paymentUid)->firstOrFail();
        $response = $payment->parseJazzResponse($ppData);
        // \dump($ppData);
        //  dd($response);
        $payment->pp_response_payload = \json_encode($ppData);
        $payment->pp_response_code = \Arr::get($ppData, 'pp_ResponseCode');
        $payment->pp_amount = \Arr::get($ppData, 'pp_Amount');
        $payment->pp_retreival_ref_no = \Arr::get($ppData, 'pp_RetreivalReferenceNo');
        $payment->pp_replied_at = now();
        if($response['success']){
            $payment->status_id = ApplicationStatus::APPROVED;
            $entity = $payment->entity;
            if($payment->entity_type == 'renewal'){
                $branch = $entity->branch;
                $branch->status_id = ApplicationStatus::PENDING;
            }
            else{
                $branch = $entity;
                $branch->status_id = ApplicationStatus::NEW;
            }
            $branch->save();
            if($payment->entity_type == 'branch'){
                if($branch->isMainOffice()){
                    event(new \App\Events\Application\BranchCreated($branch));
                }
            }
        }
        else{
            $payment->status_id = ApplicationStatus::REJECTED;
        }
        $payment->save();
        return view('payment-response', ['payment' => $payment, 'response' => $response, 'data' => $branch]);
    }

    public function getPayment($id){
        $branch = Branch::where('organization_id', \Auth::user()->organization_id)->findOrFail($id);
        if($branch->renewalRequest && $branch->renewalRequest->payment){
            $payment = $branch->renewalRequest->payment;
            $attachment = $branch->renewalRequest->getAllAttachments();

        }
        else{
            $payment = $branch->payment;
            $attachment = [];
        }
        if($payment){
            $payment->append('pkr_amount');
        }
        else {
            $payment = [];
        }
        //return redirect()->back();
        return ['payment' => $payment, 'data' => $branch,'attachment'=>$attachment];
    }

    public function addContract(BranchApplicationRequest $request, $id){
        $branch = Branch::where('organization_id', \Auth::user()->organization_id)->findOrFail($id);
        $data = Contract::make($branch, request()->all());

        return ['success' => true, 'data' => $data];
    }

    public function extendContract(BranchApplicationRequest $request, $id){
        $contract = Contract::with('branch')->findOrFail($id);
        if($contract->branch->organization_id != \Auth::user()->organization_id){
            return \Response::json(["success"=> false, "message" => 'Not authorized.'], 403);
        }
        if($contract->status_id != ApplicationStatus::APPROVED){
            return \Response::json(["success"=> false, "message" => 'Only approved contract can be extended.'], 422);
        }
        $data = $contract->extend(request()->all());

        return ['success' => true, 'data' => $data];
    }

    public function pdf($id){
        $branch = $this->getApplicationDetail($id);
        return \PDF::loadView('branch-pdf', ['branch' => $branch])->download();
    }


    public function pdfBranch($id){
        $branch = $this->getApplicationDetail($id);
        $contact = Contact::select('id')->where('owner_id',$branch->organization_id)->where('owner_type','signup')->where('contact_type_id',ContactType::PRINCIPAL_OFFICER)->first();
        $entity = EntityMedia::where('entity_id',$contact->id)->pluck('media_id');
        //dd($entity);
        $imag = [];
        foreach ($entity as  $value) {
            $media = Media::where('id',$value)->where('media_type',MediaType::DP)->first();
            if($media){
                
               $imag[] =  $media;

            }
        }
         $signup = Company::with(['contacts', 'contacts.location'])->find($branch->company->id);
        if($signup){
            $signup->append(['contact', 'principal_officer', 'directors']);
           // return $signup;
        }

        

        //return \PDF::loadView('pdf.signup-pdf', ['signup' => $signup,'imag' =>$imag])->download();
        return \PDF::loadView('pdf.branch-pdf', ['branch' => $branch,'signup' => $signup,'imag' =>$imag])->download('application.pdf');

    }
    public function receiveManualPayment(Request $request, $id){
        $request->validate([
            'challanNo' => 'required',
            'challanCopy' => 'required|temp_file',
        ]);
        $branch = Branch::with('renewalRequest')->where('organization_id', \Auth::user()->organization_id)->findOrFail($id);
        if($branch->renewalRequest && $branch->renewalRequest->payment){
            $payment = $branch->renewalRequest->payment;
        }
        else{
            $payment = $branch->payment;
        }
        $mediaId = $branch->company->generateUploadedMediaId(\Arr::get($request->all(), 'challanCopy'), MediaType::ATTACHMENT, 'challan-copy', '/branch/'. $branch->id);
        EntityMedia::insert(['media_id' => $mediaId, 'entity_id' => $payment->id, 'entity_type' => 'payment']);
        $payment->status_id = ApplicationStatus::SUBMITTED;
        $payment->save();
        $branch->status_id = $branch->renewalRequest ? ApplicationStatus::SUBMITTED : ApplicationStatus::NEW;
        $branch->save();
        return ['success' => true,'data'=>$branch];   
    }

    public function assignFileNo(Request $request){
        $data = $this->validate($request, [
            'file_no' => 'required',
        ]);

        $branch = Branch::findOrFail($request->id);

        if ($branch) {
            $branch->file_no = $data['file_no'];
            $branch->save();
            return \Response::json(["success"=> true]);
        }

        return \Response::json(["success"=> false, 'errors' => ['user' => ['Branch not found.']]], 422);
    }

    
}
