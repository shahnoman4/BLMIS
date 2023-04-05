<?php
namespace App\Http\Controllers;

use \App\Lookups\ApplicationStatus;
use \App\Lookups\ServiceType;
use App\Models\Company;
use App\Models\Branch;
use App\Models\Renewal;

class ApplicationController extends Controller{

    public function approve($type, $id){
        return $this->changeStatus($type, $id, ApplicationStatus::APPROVED);
    }

    public function reject($type, $id){
        return $this->changeStatus($type, $id, ApplicationStatus::REJECTED);
    }

    public function addComment($type, $id){
        return $this->changeStatus($type, $id, ApplicationStatus::COMMENTED);
    }

    public function circulate($type, $id){
        if($type !== 'branch'){
            retirn \Response::json('Unknown application', 422);
        }
        return $this->changeStatus($type, $id, ApplicationStatus::CIRCULATED);
    }

    public function revert($type, $id){
        if($type !== 'branch'){
            retirn \Response::json('Unknown application', 422);
        }
        return $this->changeStatus($type, $id, ApplicationStatus::REVERTED);
    }

    public function hold($type, $id){
        if($type !== 'branch'){
            retirn \Response::json('Unknown application', 422);
        }
        return $this->changeStatus($type, $id, ApplicationStatus::HELD, false);
    }

    public function shareCopyForInformation($type, $id){
        if($type !== 'contract'){
            retirn \Response::json('Unknown application', 422);
        }
        return $this->changeStatus($type, $id, ApplicationStatus::SHARED, false);
    }

    private function changeStatus($type, $id, $newStatusId, $commentRequired = true){
        $rules = [];
        if($commentRequired){
            $rules["comments"] = "required|string";
        }
        if($newStatusId == ApplicationStatus::CIRCULATED){
            $rules['role'] = 'required|array';
            $rules['role.*'] = 'integer';
        }
        $this->validate(request(), $rules);
        $data = \App\Models\ApplicationActivity::logStatus(\Auth::user(), $type, $id, $newStatusId, request()->all());
        return \Response::json(["success"=> true, "data" => $data]);
    }

    public function downloadAttachments($type, $id){
       
        if($type == 'signup'){
            $model = \App\Models\Company::withAattchments()->findOrFail($id)->appendAll();
            $company = $model;
            $zipFile = 'attachments-'. \Str::slug($model->name, '-') . '-'. now()->format('Ymdhis') .'.zip';
        }
        else if($type == 'branch'){
            $model = \App\Models\Branch::withAattchments()->findOrFail($id);
            if(\is_sub_branch($model, true)){
                $model = \App\Models\Branch::withAattchments()->findOrFail($model->parent_id);
            }
            $model->appendAll();
            $company = $model->company;
            $zipFile = 'attachments-branch-'. \Str::slug($model->company->name, '-') . '-'. now()->format('Ymdhis') .'.zip';
        }
        else if($type == 'contract'){
            $model = \App\Models\Contract::withAll()->findOrFail($id)->appendAll();
            $company = $model->branch->company;
            $zipFile = 'attachments-contract-'. \Str::slug($model->branch->company->name, '-') . '-'. now()->format('Ymdhis') .'.zip';
        }
        else if($type == 'log'){
            $model = \App\Models\ApplicationActivity::with(['attachments'])->findOrFail($id);
            $company;
            if($model->isCompanyLog()){
                $company = $model->company;
            }
            else if($model->isBranchLog()){
                $company = $model->branch->company;
            }
            $zipFile = 'attachments-activity-log'. ($company ? ('-' . \Str::slug($company->name, '-')) : '') . '-'. now()->format('Ymdhis') .'.zip';
        }
        else{
            return \Response::json('Unknown application', 422);
        }
        $user = \Auth::user();
        if($user->isCompanyOwner()){
            if($user->organization_id != $company->id){
                \Auth::logout();
                throw new \Illuminate\Auth\AuthenticationException('Unauthenticated.');
            }
        }
        \Storage::makeDirectory('downloads');
        $zipFile = \Storage::path('downloads/'.$zipFile);

        $attchments = $model->getAllAttachments();
        //dd($attchments);
        $zip = new \ZipArchive();        
        $zip->open($zipFile, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);
        $attchments->each(function($item) use($zip){
            if(\file_exists(uploads_path($item->path))){
                $zip->addFile(uploads_path($item->path), $item->as);
            }
        });
        $zip->close();
        try{
            return response()->download($zipFile);
        }
        catch(\Exception $e){
            if(request()->wantsJson()){
                return ['success' => false, 'message' => 'Error in downloading attachments.'];
            }
            return 'Error in downloading attachments. <script>setTimeout(function(){window.close();}, 1500);</script>';
        }
    }

    public function getApplicationsStats(){
        $companyCount = Company::select(\DB::raw('count(*) as count'))->get();
        $branchAppCount = Branch::select(\DB::raw('service_type_id, count(*) as count'))->groupBy('service_type_id')
                        ->where('status_id', '!=', ApplicationStatus::PAYMENT_PENDING)->get();
        $renewalCount = Renewal::select(\DB::raw('count(*) as count'))->get();

        $branchCount = $branchAppCount->firstWhere('service_type_id', ServiceType::BRANCH);
        $liaisonCount = $branchAppCount->firstWhere('service_type_id', ServiceType::LIAISON);

        return [
            ['type' => 'company', 'count' => $companyCount->first()->count],
            ['type' => 'branch', 'count' => $branchCount ? $branchCount->count : 0],
            ['type' => 'liaison', 'count' => $liaisonCount ? $liaisonCount->count : 0],
            ['type' => 'renewal', 'count' => $renewalCount->first()->count],
        ];
    }
}