<?php

namespace App\Models;

use Illuminate\Support\Arr;

use App\Lookups\Authorization;
use App\Lookups\ContactType;
use App\Lookups\MediaType;
use App\Lookups\ApplicationStatus;
use App\Lookups\ServiceType;
use Illuminate\Support\Facades\Storage;

class Branch extends Model{
    
    protected $table = "branch";

    private static $stakeholdersLog;
    public const MATURE_AGE = 7; // an application becomes mature case after this much WEEKS of submission
    public const ALLOWED_ATTEMPTS = 4; // An application can be submitted this much time if rejected

    /**
     * application will expire after this much months from today
     * this value is used to filter NEAR TO EXPIRE applications
     */
    public const EXPIRES_AFTER_MONTH = 2;

    protected $fillable = [
        'service_type_id', 'original_country', 'primary_info', 'other_org_info',
        'other_country_info', 'current_country', 'current_city', 'desired_location',
        'desired_places', 'business_info', 'project_info', 'personnel_info',
        'repatriation_info', 'local_associate_info', 'start_month', 'start_year',
        'permission_period', 'background_info', 'purpose_info','no_of_personnel_employee','firm_for_capital','firm_for_profit',
    ];

    protected $hidden = ['contacts', 'security_agency_id'];

    protected const ENTITY_NAME = 'branch';
    
    public function renewalRequest(){
        return $this->hasOne(Renewal::Class, 'branch_id')->latest('renewed_at');
    }
    
    public function payment(){
        return $this->morphOne(Payment::Class, 'entity')->latest('created_at');
    }

    public function contacts(){
        return $this->morphMany(Contact::class, "owner");
    }
    
    public function comments()
    {
        return $this->morphMany(ApplicationActivity::class, "entity");
    }

    public function investment(){
        return $this->hasOne(Investment::Class, 'branch_id');
    }
    
    public function contract(){
        return $this->hasOne(Contract::Class, 'branch_id')->latest('created_at');
    }
    
    public function contractHistory(){
        return $this->hasMany(Contract::Class, 'branch_id')->orderBy('created_at', 'desc');
    }
    
    public function securityAgency(){
        return $this->hasOne(SecurityAgency::Class, 'branch_id');
    }
    
    public function company(){
        return $this->hasOne(Company::Class, 'id', 'organization_id');
    }

    public function scopeWithAll($query){
        $query->with([
            'contacts', 'contacts.attachments', 'contacts.location',
            'investment', 'investment.attachments', 'contractHistory',
            'contract', 'contract.attachments', 'contract.contacts', 'contract.contacts.location',
            'securityAgency', 'securityAgency.attachments',
            'securityAgency.contact', 'securityAgency.contact.location'
        ]);
    }

    public function scopeWithAattchments($query){
        $query->with([
            'company', 'company.attachments',
            'contacts', 'contacts.attachments',
            'investment', 'investment.attachments', 'contract', 'contract.attachments',
            'contract.contacts', 'contract.contacts.attachments',
            'securityAgency', 'securityAgency.attachments',
            'comments', 'comments.attachments',
            'renewalRequest', 'renewalRequest.attachments',
        ]);
    }

    public function scopeWithoutAttachements($query){
        $query->with([
            'contacts', 'contacts.location', 'contractHistory',
            'investment', 'contract', 'contract.contacts', 'contract.contacts.location',
            'securityAgency', 'securityAgency.contact', 'securityAgency.contact.location'
        ]);
    }

    public function scopePayment($query){
        $query->with([
            'payment']);
    }

    public function scopeAppendAll(){
        return $this->append(['local_contact', 'local_sponsor', 'agent', 'partner_companies','representative_officer']);
    }
    
    public function getStakeHoldersAttribute(){
        return User::join('app_circular as ac', 'user.role_id', '=', 'ac.role_id')
        ->whereRaw('ac.activity_id = (select max(activity_id) from app_circular where branch_id = ?)', [$this->id])
        ->select('user.*')->get();
    }

    public function getUidAttribute(){
        $uid = $this->attributes['uid'];
        return substr($uid, 0, 3) . substr($uid, strlen($uid) - 3);
    }

    public function getIsApprovableAttribute(){
        if($this->status_id == ApplicationStatus::APPROVED || $this->status_id == ApplicationStatus::REVERTED){
            return false;
        }
        // if($this->status_id == ApplicationStatus::NEW){
        //     return true;
        // }
        $logs = $this->getStakeHoldersLog();
        $hasNull = false;
        foreach($logs as $log){
            if($log->status_id === null){
                $hasNull = true;
            }
            else if($log->status_id != ApplicationStatus::APPROVED){
                // if any of stakeholders did not approve application
                // admin cannot approve it
                return false;
            }
        }
        
        if($hasNull){
             // if some stakeholders did not respond yet
            if($this->created_at->startOfDay()->diffInWeeks(now()->endOfDay()) >= static::MATURE_AGE){
                // and 7 weeks have passed
                // admin can approve now
                return true;
            }
            return false;
        }

        return true;        
    }

    public function getIsRejectableAttribute(){
        return $this->status_id != ApplicationStatus::REJECTED; // as per new requirement application is always rejectable

        if($this->status_id == ApplicationStatus::APPROVED || $this->status_id == ApplicationStatus::REJECTED || $this->status_id == ApplicationStatus::REVERTED){
            return false;
        }
        $logs = $this->getStakeHoldersLog();
        $allNull = true;
        foreach($logs as $log){
            if($log->status_id == ApplicationStatus::REJECTED){
                // if any of stakeholders rejected application
                // admin can reject it
                return true;
            }
            else if($log->status_id !== null){
                $allNull = false;
            }
        }
        
        if($allNull){
             // if none of stakeholders responded yet
            if($this->created_at->startOfDay()->diffInWeeks(now()->endOfDay()) >= static::MATURE_AGE){
                // and 7 weeks have passed
                // admin can reject now
                return true;
            }
        }

        return false;
    }

    private function getStakeHoldersLog(){
        if(!static::$stakeholdersLog){
            static::$stakeholdersLog = \DB::select(\DB::raw('
                SELECT 
                    u.id, u.full_name, log.status_id
                FROM
                    `user` AS u
                        INNER JOIN
                    `app_circular` AS ac ON ac.role_id = u.role_id
                        LEFT JOIN
                    `app_activity_log` AS log ON log.user_id = u.id AND log.entity_type="branch" AND log.entity_id=ac.branch_id
                        AND log.status_id IN (? , ?)
                WHERE ac.branch_id = ?
            '), [ApplicationStatus::APPROVED, ApplicationStatus::REJECTED, $this->id]);
        }
        return static::$stakeholdersLog;
    }

    public function getLocalContactAttribute(){
        return Arr::get($this->attributes, 'local_contact', $this->contacts->firstWhere('contact_type_id', ContactType::LOCAL_CONTACT));
        
    }
    public function getLocalSponsorAttribute(){
        return $this->contacts->firstWhere('contact_type_id', ContactType::LOCAL_SPONSOR);
        
    }
    public function getAgentAttribute(){
        return $this->contacts->firstWhere('contact_type_id', ContactType::AGENT);
        
    }
    public function getPartnerCompaniesAttribute(){
        return $this->contract ? $this->contract->partner_companies : null;
    }
    
    public function getLockedAttribute(){
        return Arr::get($this->attributes, 'locked') === 1;
    }

    public function getRepresentativeOfficerAttribute()
    {
        return $this->contacts->firstWhere('contact_type_id', ContactType::REPRESENTATIVE_OFFICER);//->append(['rp_nic_copy', 'rp_passport_copy', 'rp_dp', 'rp_cv', 'rp_cover_letter']);
    }

    public function updateProfile(array $data){
        $media = [
            'signup' => [],
            'contact' => [],
            'contract' => [],
            'investment' => [],
            'security' => [],
        ];
        $dirty = false;
        $branch = $this;        
        $company = $branch->company;

        $branchData = Arr::get($data, 'Branch');
        $localContactData = Arr::get($data, 'LocalContact');
        $localSponsorData = Arr::get($data, 'LocalSponsor');
        $companyData = Arr::get($data, 'Company');
        $agentData = Arr::get($data, 'Agent');
        $contractData = Arr::get($data, 'Contract');
        $partnersData = Arr::get($data, 'PartnerCompanies');
        $investmentData = Arr::get($data, 'Investment');
        $securityAgencyData =  Arr::get($data, 'SecurityAgency');
        
        if($branchData){
            $branch->fill($branchData);
            if($securityAgencyData){
                $branch->security_required = Arr::get($securityAgencyData, 'security_required');
            }
            $dirty = $dirty || $branch->isDirty();
            // $branch->save();
        }

        if($localContactData){
            $dirty = $branch->updateMorphContact($localContactData, $branch->local_contact) || $dirty;
        }

        if($localSponsorData){
            $dirty = $branch->updateMorphContact($localSponsorData, $branch->local_sponsor) || $dirty;
        }

        if($companyData){
            $media['signup'][$company->id] = [];
            foreach([
                ['registration_letter', MediaType::REGISTRATION_LETTER, 'registration-letter'],
                ['memorandum_article', MediaType::MEMORANDUM_ARTICLE, 'memorandum-article'],
                ['article_association', MediaType::ARTICLE_ASSOCIATION, 'article-association'],
                ['authority_letter', MediaType::AUTHORITY_LETTER, 'authority-letter'],
                ['org_profile', MediaType::ORG_PROFILE, 'company-profile'],
            ] as $mediaType){
                $mediaData = Arr::get($companyData, $mediaType[0]);
                if($mediaData && !Arr::get($mediaData, 'id')){
                    $media['signup'][$company->id][] = [$mediaData,  $mediaType[1], $mediaType[2]];
                }
            }
        }
        
        if($agentData){
            $dirty = $branch->updateMorphContact($agentData, $branch->agent) || $dirty;
        }

        if($contractData){
            $branch->contract->fill($contractData);
            $dirty = $dirty || $branch->contract->isDirty();
            $branch->contract->save();

            $contractLetter = Arr::get($contractData, 'agreement_letter');
            if($contractLetter && !Arr::get($contractLetter, 'id')){
                $media['contract'][$branch->contract->id] = [
                    [$contractLetter,  MediaType::AGREEMENT_LETTER, 'contract-agreement'],
                ];
            }
        }
        if($partnersData){
            foreach($partnersData as $idx => $partnerData){                
                if(Arr::get($partnerData, 'id')){
                    $obj = $branch->contract->partnerCompanies->firstWhere('id', Arr::get($partnerData, 'id'));
                    if($obj){
                        $objContact = $obj->contact;
                        unset($obj->contact);
                        $dirty = $branch->contract->updateMorphContact($partnerData, $obj) || $dirty;

                        $media['contact'][$obj->id] = [];
                        $suffix = $idx + 1;
                        foreach([
                            ['lease_agreement', MediaType::LEASE_AGREEMENT, 'partner-lease-agreement' . $suffix],
                            ['secp_certificate', MediaType::SECP_CERTIFICATE, 'partner-secp-certificate' . $suffix],
                        ] as $mediaType){
                            $mediaData = Arr::get($partnerData, $mediaType[0]);
                            if($mediaData && !Arr::get($mediaData, 'id')){
                                $media['contact'][$obj->id][] = [$mediaData,  $mediaType[1], $mediaType[2]];
                            }
                        }
                        
                        $partnerContacData = Arr::get($partnerData, 'Contact');
                        if($partnerContacData){
                            if($objContact){
                                $objContact->fill($partnerContacData);
                                $dirty = $dirty || $objContact->isDirty();
                                $objContact->save();
                                $objContactNic = Arr::get($partnerContacData, 'nic_copy');
                                if($objContactNic && !Arr::get($objContactNic, 'id')){
                                    $media['contact'][$objContact->id] = [
                                        [$objContactNic,  MediaType::NIC, 'partner-nic' . ($idx + 1)],
                                    ];
                                }
                            }
                            else{
                                $partnerContactPerson = new Contact($partnerContacData);
                                $partnerContactPerson->contact_type_id = ContactType::PARTNER_PERSON;
                                $partnerContactPerson->owner_type = 'partner';
                                $partnerContactPerson->owner_id = $obj->id;
                                $partnerContactPerson->save();
                                $media['contact'][$partnerContactPerson->id] = [
                                    [Arr::get($partnerContacData, 'nic_copy'),  MediaType::NIC, 'partner-nic' . ($idx + 1)],
                                ];
                                $dirty = $dirty || true;
                            }
                        }
                        
                    }
                }
                else{
                    $partner = $branch->contract->addMorphContact($partnerData, ContactType::PARTNER_COMPANY);
                    $media['contact'][$partner->id] = [
                        [Arr::get($partnerData, 'lease_agreement'),  MediaType::LEASE_AGREEMENT, 'partner-lease-agreement' . ($idx + 1)],
                        [Arr::get($partnerData, 'secp_certificate'),  MediaType::SECP_CERTIFICATE, 'partner-secp-certificate' . ($idx + 1)],
                    ];
                    $partnerContacData = Arr::get($partnerData, 'Contact');
                    if($partnerContacData){
                        $partnerContactPerson = new Contact($partnerContacData);
                        $partnerContactPerson->contact_type_id = ContactType::PARTNER_PERSON;
                        $partnerContactPerson->owner_type = 'partner';
                        $partnerContactPerson->owner_id = $partner->id;
                        $partnerContactPerson->save();
                        $media['contact'][$partnerContactPerson->id] = [
                            [Arr::get($partnerContacData, 'nic_copy'),  MediaType::NIC, 'partner-nic' . ($idx + 1)],
                        ];
                    }
                    $dirty = $dirty || true;
                }
            }
        }

        if($investmentData){
            $branch->investment->fill($investmentData);
            $dirty = $dirty || $branch->investment->isDirty();
            $branch->investment->save();

            $investmentAttachment = Arr::get($investmentData, 'expenses_copy');
            if($investmentAttachment && !Arr::get($investmentAttachment, 'id')){
                $media['investment'][$branch->investment->id] = [
                    [$investmentAttachment,  MediaType::ATTACHMENT, 'investment-expenses'],
                ];
            }
        }

        if($branch->security_required == 1){
            if($securityAgencyData){
                if(!$branch->securityAgency){
                    $securityAgency = new SecurityAgency($securityAgencyData);
                    $securityAgency->branch_id = $branch->id;
                    $securityAgency->save();
                
                    $media['security'][$securityAgency->id] = [
                        [Arr::get($securityAgencyData, 'secp_certificate'),  MediaType::SECP_CERTIFICATE, 'security-agency-secp-cert'],
                    ];
        
                    $securityAgency->addMorphContact(Arr::get($securityAgencyData, 'Contact'), ContactType::ORGANIZATION);

                    $dirty = $dirty || true;
                }
                else{
                    $branch->securityAgency->fill($securityAgencyData);
                    $dirty = $dirty || $branch->securityAgency->isDirty();
                    $branch->securityAgency->save();
                    
                    $securityAgencyAttachment = Arr::get($securityAgencyData, 'secp_certificate');
                    if($securityAgencyAttachment && !Arr::get($securityAgencyAttachment, 'id')){
                        $media['security'][$branch->securityAgency->id] = [
                            [$securityAgencyAttachment,  MediaType::SECP_CERTIFICATE, 'security-agency-secp-cert'],
                        ];
                    }
                    $securityAgencyContactData = Arr::get($securityAgencyData, 'Contact');
                    if($securityAgencyContactData){
                        $dirty = $branch->securityAgency->updateMorphContact($securityAgencyContactData, $branch->securityAgency->contact) || $dirty;
                    }
                }
            }
        }
        
        $contactMediaIds = [];
        foreach($media as $type => $mediaList){
            foreach($mediaList as $entityId => $list){
                foreach($list as $item){
                    if($item){
                        $item[] = '/branch';
                        $mediaId = $company->generateUploadedMediaId(...$item);
                        if($mediaId){
                            $contactMediaIds[] = ['media_id' => $mediaId, 'entity_id' => $entityId, 'entity_type' => $type];
                        }
                    }
                }
            }
        }
        
        if(count($contactMediaIds)){
            EntityMedia::insert($contactMediaIds);
            $dirty = $dirty || true;
        }
        
        if($dirty){
            $this->locked = 1;
            if($this->status_id === ApplicationStatus::REVERTED){
                $this->status_id = ApplicationStatus::NEW;
            }
            $this->save();
            return ApplicationActivity::logStatus(\Auth::user(), static::ENTITY_NAME, $this->id, ApplicationStatus::UPDATED, ['meta' => ['section' => Arr::get($data, 'section')]]);
        }
        
    }
    
    public static function register(Company $company, array $data, $isAfterReview = false, $doConvert = false)
    {
      
     \DB::beginTransaction();
        try{

        $media = [
            'signup' => [],
            'contact' => [],
            'contract' => [],
            'investment' => [],
            'security' => [],
        ];
        if(isset($data['Branch']['current_country'])){
                
            if(is_array($data['Branch']['current_country'])){
            
                $currentCountry = $data['Branch']['current_country'];
                    $result ="";
                    foreach ($currentCountry as  $value) {
                        //dd($value['value']);
                      $result .= $value['value'].",";
                    }
                    $country =  rtrim($result,',');
            }else{
                $country =  null;
            } 
        }else{
            
            $country =  null;
        } 
      //dd($data);
        $branch = new Branch(Arr::get($data, 'Branch'));
        $branch->current_country = $country;
        if($doConvert && $company->branch){
            $branch->converted_from = $company->branch->id;
        }
        else if($company->branch && \is_sub_branch($branch, true)){
            $branch->parent_id = $company->branch->id;
        }
        $branch->organization_id = $company->id;
        $branch->attempts = 1;
        $branch->uid = uid();
        if(!$isAfterReview && \is_main_branch($branch) && $company->was_permitted){
            $branch->status_id = ApplicationStatus::APPROVED;
        }
        else{
            $branch->status_id = ApplicationStatus::PAYMENT_PENDING;
        }

        $branch->locked = 1;
        $branch->security_required = Arr::get($data, 'SecurityAgency.security_required');
        $branch->save();
    //dd($data);
        $localContact = $branch->addMorphContact(Arr::get($data, 'LocalContact'), ContactType::LOCAL_CONTACT);
        $localSponsor = $branch->addMorphContact(Arr::get($data, 'LocalSponsor'), ContactType::LOCAL_SPONSOR);
        
        $media['signup'][$company->id] = [
            [Arr::get($data, 'Company.registration_letter'),  MediaType::REGISTRATION_LETTER, 'registration-letter'],
            [Arr::get($data, 'Company.memorandum_article'),  MediaType::MEMORANDUM_ARTICLE, 'memorandum-article'],
            [Arr::get($data, 'Company.article_association'),  MediaType::ARTICLE_ASSOCIATION, 'article-association'],
            [Arr::get($data, 'Company.authority_letter'),  MediaType::AUTHORITY_LETTER, 'authority-letter'],
            [Arr::get($data, 'Company.org_profile'),  MediaType::ORG_PROFILE, 'company-profile'],
        ];
        
        $agent = $branch->addMorphContact(Arr::get($data, 'Agent'), ContactType::AGENT);
        if(\is_branch($branch)){
            //contract and partner companies are applicable fro BRANCH type applications only
            $contract = new Contract(Arr::get($data, 'Contract'));
            $contract->branch_id = $branch->id;
            $contract->save();
            $media['contract'][$contract->id] = [
                [Arr::get($data, 'Contract.agreement_letter'),  MediaType::AGREEMENT_LETTER, 'contract-agreement'],
            ];

            foreach(Arr::get($data, 'PartnerCompanies', []) as $idx => $partnerData){
                $partner = $contract->addMorphContact($partnerData, ContactType::PARTNER_COMPANY);
                if(Arr::get($partnerData, 'secp_certificate')){
                    $media['contact'][$partner->id] = [
                        [Arr::get($partnerData, 'lease_agreement'),  MediaType::LEASE_AGREEMENT, 'partner-lease-agreement' . ($idx + 1)],
                        [Arr::get($partnerData, 'secp_certificate'),  MediaType::SECP_CERTIFICATE, 'partner-secp-certificate' . ($idx + 1)],
                    ];
                }else{
                    $media['contact'][$partner->id] = [
                        [Arr::get($partnerData, 'lease_agreement'),  MediaType::LEASE_AGREEMENT, 'partner-lease-agreement' . ($idx + 1)],
                    ];
                }
                $partnerContacData = Arr::get($partnerData, 'Contact');
                if($partnerContacData){
                    $partnerContactPerson = new Contact($partnerContacData);
                    $partnerContactPerson->contact_type_id = ContactType::PARTNER_PERSON;
                    $partnerContactPerson->owner_type = 'partner';
                    $partnerContactPerson->owner_id = $partner->id;
                    $partnerContactPerson->save();
                    if(Arr::get($partnerContacData, 'nic_copy')){
                        $media['contact'][$partnerContactPerson->id] = [
                            [Arr::get($partnerContacData, 'nic_copy'),  MediaType::NIC, 'partner-nic' . ($idx + 1)],
                        ];
                    }
                }
            }
        }
        //Arr::get($data, 'Investment')
       // dd($data);
        $investment = new Investment();
        $investment->branch_id       = $branch->id;
        if(isset($data['Investment']['proposal_info'])){
           $investment->proposal_info   = $data['Investment']['proposal_info'];
         }
        if(isset($data['Investment']['annual_expenses'])){
           $investment->annual_expenses = $data['Investment']['annual_expenses'];
         }
        if(isset($data['Investment']['investment_info'])){
           $investment->investment_info = $data['Investment']['investment_info'];
        }
        if(isset($data['Investment']['pk_bank'])){
           $investment->pk_bank         = $data['Investment']['pk_bank'];
        }
        if(isset($data['Investment']['designated_person'])){
           $investment->designated_person = $data['Investment']['designated_person'];
        }
        if(isset($data['Investment']['designated_person'])){
          $investment->comments        = $data['Investment']['designated_person'];
        }
        $investment->save();
        
        

        if($doConvert && $company->branch){
          if(Arr::get($data, 'Investment.expenses_copy')){
            $media['investment'][$investment->id] = [
                [Arr::get($data, 'Investment.valid_permission_rewnal'),  MediaType::Valid_Permission_Rewnal, 'valid-permission-rewnal'],
                [Arr::get($data, 'Investment.expenses_copy'),  MediaType::ATTACHMENT, 'investment-expenses'],
                [Arr::get($data, 'Investment.board_resolution'),  MediaType::Board_Resolution, 'board-resolution'],
            ];
           }else{

              $media['investment'][$investment->id] = [
                [Arr::get($data, 'Investment.valid_permission_rewnal'),  MediaType::Valid_Permission_Rewnal, 'valid-permission-rewnal'],
                [Arr::get($data, 'Investment.board_resolution'),  MediaType::Board_Resolution, 'board-resolution'],
            ];
           } 

        }else{

          if(Arr::get($data, 'Investment.expenses_copy')){
            $media['investment'][$investment->id] = [
                [Arr::get($data, 'Investment.expenses_copy'),  MediaType::ATTACHMENT, 'investment-expenses'],
            ];
        }

        }
       
        if($branch->security_required == 1){
            $securityAgency = new SecurityAgency(Arr::get($data, 'SecurityAgency'));
            $securityAgency->branch_id = $branch->id;
            $securityAgency->save();
            if(Arr::get($data, 'SecurityAgency.secp_certificate')){
                $media['security'][$securityAgency->id] = [
                    [Arr::get($data, 'SecurityAgency.secp_certificate'),  MediaType::SECP_CERTIFICATE, 'security-agency-secp-cert'],
                ];
            }

            $securityAgency->addMorphContact(Arr::get($data, 'SecurityAgency.Contact'), ContactType::ORGANIZATION);
        }
        //dd($media);
        $contactMediaIds = [];
        foreach($media as $type => $mediaList){
            foreach($mediaList as $entityId => $list){
                
                    foreach($list as $item){
                        //dd($item);
                        if($item){
                            $item[] = '/branch/'. $branch->id;
                            $mediaId = $company->generateUploadedMediaId(...$item);
                            if($mediaId){
                                $contactMediaIds[] = ['media_id' => $mediaId, 'entity_id' => $entityId, 'entity_type' => $type];
                            }
                        }    
                    }
                    
            }
        }

        //dd($contactMediaIds);
        if(count($contactMediaIds)){
            EntityMedia::insert($contactMediaIds);
        }

        if($isAfterReview || $branch->status_id === ApplicationStatus::PAYMENT_PENDING){
            $fee = $branch->calculateFee($company);
            $payment = new Payment;
            $payment->uid = uid();
            $payment->status_id = ApplicationStatus::NEW;
            $payment->entity_type = 'branch';
            $payment->entity_id = $branch->id;
            $payment->usd_amount = $fee['usd'];
            $payment->usd_discount = 0;
            $payment->pkr_rate = pkr_rate();
            $payment->save();
            
            $manualPayment = Arr::get($data, 'Payment');
            if($manualPayment){
                $mediaId = $company->generateUploadedMediaId(Arr::get($manualPayment, 'challanCopy'), MediaType::ATTACHMENT, 'challan-copy', '/branch/'. $branch->id);
                EntityMedia::insert(['media_id' => $mediaId, 'entity_id' => $payment->id, 'entity_type' => 'payment']);
                
                $branch->status_id = ApplicationStatus::NEW;
                $branch->save();

                $payment->status_id = ApplicationStatus::SUBMITTED;
                $payment->pp_txn_ref_no = Arr::get($manualPayment, 'challanNo');
                $payment->save();
            }
            $branch->fee = $fee;
        }
        
        //event(new \App\Events\Application\BranchCreated($branch));

        ApplicationActivity::logStatus(\Auth::user(), static::ENTITY_NAME, $branch->id, ApplicationStatus::NEW);
        \DB::commit();

        return $branch;
      
      }
        catch(\Exception $e){
            \DB::rollback();
            //echo "string";exit();
            return null;
        } 
        
    }

    public static function registerSubBranch(Company $company, array $data, $isAfterReview = false){  
        //dd($data);
        $contactsMedia = [];

        $branch = new Branch(Arr::get($data, 'Branch'));
        $branch->organization_id = $company->id;
        $branch->attempts = 1;
        $branch->uid = uid();
        $branch->status_id = ApplicationStatus::PAYMENT_PENDING;
        $branch->locked = 1;
        $branch->parent_id = $company->branch->id;
        $branch->save();

        $branch->addRepresentativeOfficer(Arr::get($data, 'RP'), $contactsMedia);
        $contactMediaIds = [];
            foreach(['contact' => $contactsMedia] as $type => $mediaList){
                foreach($mediaList as $entityId => $list){
                    foreach($list as $item){
                        //dd($item[0]);
                        if(isset($item[0]) && $item[0]!=null){
                            $mediaId = $company->generateUploadedMediaId(...$item);
                            if($mediaId){
                                $contactMediaIds[] = ['media_id' => $mediaId, 'entity_id' => $entityId, 'entity_type' => $type];
                            }
                        }
                    }
                }
            }
//dd($data);
            if(count($contactMediaIds)){
                EntityMedia::insert($contactMediaIds);
            }

        if($isAfterReview){
            $fee = $branch->calculateFee($company);
            $payment = new Payment;
            $payment->uid = uid();
            $payment->status_id = ApplicationStatus::NEW;
            $payment->entity_type = 'branch';
            $payment->entity_id = $branch->id;
            $payment->usd_amount = $fee['usd'];
            $payment->usd_discount = 0;
            $payment->pkr_rate = pkr_rate();
            $payment->save();
            
            $manualPayment = Arr::get($data, 'Payment');
            if($manualPayment){
                $mediaId = $company->generateUploadedMediaId(Arr::get($manualPayment, 'challanCopy'), MediaType::ATTACHMENT, 'challan-copy', '/branch/'. $branch->id);
                EntityMedia::insert(['media_id' => $mediaId, 'entity_id' => $payment->id, 'entity_type' => 'payment']);

                $payment->status_id = ApplicationStatus::SUBMITTED;
                $payment->pp_txn_ref_no = Arr::get($manualPayment, 'challanNo');
                $payment->save();
                $branch->status_id = ApplicationStatus::NEW;
                $branch->save();
            }
            $branch->fee = $fee;
        }
        //event(new \App\Events\Application\BranchCreated($branch));

        ApplicationActivity::logStatus(\Auth::user(), static::ENTITY_NAME, $branch->id, ApplicationStatus::NEW);
        return $branch;
    }


    public function addRepresentativeOfficer(array $data, &$unsavedAttachments){
        //dd(ContactType::REPRESENTATIVE_OFFICER);
        //dd($data);
        $contact = $this->addMorphContact($data, ContactType::REPRESENTATIVE_OFFICER, false);
        //dd($contact);
        $unsavedAttachments[$contact->id] = [
            [Arr::get($data, 'rp_dp'),  MediaType::DP, 'rp-photo'],
            [Arr::get($data, 'rp_cv'),  MediaType::CV, 'rp-cv'],
            [Arr::get($data, 'rp_cover_letter'),  MediaType::COVER_LETTER, 'rp-cover-letter'],
            [Arr::get($data, 'rp_nic_copy'),  MediaType::NIC, 'rp-nic'],
            [Arr::get($data, 'rp_passport_copy'),  MediaType::PASSPORT, 'rp-passport']
        ];
    }

    public static function getLogs($orgId, $branchId = null){
        $query = \DB::table(ApplicationActivity::table('log'))
        ->join(Branch::table('branch'), 'branch.id', '=', 'log.entity_id');
        if($orgId && !$branchId){
            $query->join(\DB::raw('(
                SELECT id FROM branch WHERE `service_type_id` IN (?,?) AND organization_id=?
                AND (`converted_from` IS NULL OR `status_id` != ?)
                ORDER BY created_at DESC LIMIT 1
            ) as bb'), 'bb.id', '=', 'branch.id')
            ->addBinding([ServiceType::BRANCH, ServiceType::LIAISON, $orgId, ApplicationStatus::REJECTED], 'select');
        }
        $query->join(Company::table('org'), 'org.id', '=', 'branch.organization_id')
        ->join(User::table('u'), 'u.id', '=', 'log.user_id')
        ->leftJoin(EntityMedia::table('em'), function($join){
            $join->on('em.entity_id', '=', 'log.id')
                 ->where('em.entity_type', 'log');
        })
        ->leftJoin(Media::table('media'), function($join){
            $join->on('em.media_id', '=', 'media.id');
        })
        ->select(\DB::raw('`log`.*, media.id as attachment_id, media.filename as attachment_title, `u`.`authorization_id`, `u`.`full_name` as `user_name`, `u`.`authorization_id` = '. Authorization::SUPER_ADMIN .' as `is_admin`, `u`.`authorization_id` = '. Authorization::ADMIN .' as `is_sh_admin`, `org`.`name` as `org_name`'))
        
        ->where('log.entity_type', static::ENTITY_NAME)
        ->where('log.status_id', '!=', ApplicationStatus::HELD)
        ->where(function($query){
            if(!\Auth::user()->isSuperAdmin()){
                $query->where('u.authorization_id', '=', Authorization::SUPER_ADMIN);
                $query->orWhere('u.id', \Auth::user()->id);
                $query->orWhereRaw('u.organization_id = branch.organization_id');
            }

           
        });
        if($orgId){
            $query->where('branch.organization_id', $orgId);
        }
        if($branchId){
            $query->where('branch.id', $branchId);
        }
        else{
            $query->where(function($query){
                $query->where('branch.service_type_id', ServiceType::BRANCH)->orWhere('branch.service_type_id', ServiceType::LIAISON);
            });
        }
        $query->orderBy('log.performed_at', 'ASC');
        $data = $query->get();

        if(\Auth::user()->isCompanyOwner()){
            $data->each(function($item){
                if($item->status_id === ApplicationStatus::CIRCULATED || $item->role_id!=null){
                    $item->comments = null;
                }
            });
        }

        // if(\Auth::user()->isStakeholder()){
        //     $data->each(function($item){
        //         if($item->status_id === ApplicationStatus::NEW && $item->authorization_id === Authorization::ORG_ADMIN){

                    

        //         }else if($item->authorization_id === Authorization::ORG_ADMIN){
        //             //$item = null;

        //             $item->id = null;
        //            // $item->status_id = null;
        //             $item->entity_id = null;
        //             $item->authorization_id = null;
        //             $item->user_id = null;
        //             $item->org_name = null;
        //             $item->comments = null;
        //             $item->performed_at = null;
        //             $item->entity_type = null;
        //         }
        //     });
        // }

        //dd($data);
 

            return $data->groupBy('id')->values()->transform(function($item){
                //dd($item);
                $attachments = [];
                foreach($item as $instance){
                    if($instance->attachment_id){
                        $attachments[] = ["id" => $instance->attachment_id, "title" => $instance->attachment_title];
                    }
                }
                $temp = $item[0];
                unset($temp->attachment_id);
                unset($temp->attachment_title);
                $temp->attachments = $attachments;
                return $temp;
            })->each(function($item){
                
                foreach(['comments', 'org_name', 'name', 'user_name'] as $key){
                       
                        try{
                            if($key=='org_name'){
                               $item->$key = $item->$key;
                            }else{
                               $item->$key = c_decrypt($item->$key); 
                            }
                        }
                        catch(\Exception$e){

                        }
                        
                }
                if($item->payload){
                    $item->payload = \json_decode($item->payload, true);
                }
            });
        
        
        return $data;
    }

    public function getAllAttachments(){
        $res = collect();

        if($this->company){
            $member = $this->company;
            foreach(['registration_letter', 'memorandum_article','article_association', 'authority_letter', 'org_profile'] as $attr){
                if($member->$attr){
                    $media = $member->$attr;
                    $media->as = 'company/'. $attr .'.'. $media->extension;
                    $res->push($media);
                }
            }
        }
        
        if($this->contract){
            $member = $this->contract;
            foreach(['agreement_letter'] as $attr){
                if($member->$attr){
                    $media = $member->$attr;
                    $media->as = 'contract/'. $attr .'.'. $media->extension;
                    $res->push($media);
                }
            }
        }
        
        if($this->partnerCompanies){
            $this->partnerCompanies->each(function($member, $idx) use($res){
                foreach(['lease_agreement', 'secp_certificate'] as $attr){
                    if($member->$attr){
                        $media = $member->$attr;
                        $media->as = 'partners/'. ($idx + 1) .'-'. \Str::slug($member->full_name, '-') .'/' . $attr . '.' . $media->extension;
                        $res->push($media);
                    }
                    if($member->contact && $member->contact->nic_copy){
                        $media = $member->contact->nic_copy;
                        $media->as = 'partners/'. ($idx + 1) .'-'. \Str::slug($member->full_name, '-') .'/contact-nic_copy.' . $media->extension;
                        $res->push($media);

                    }
                }
            });
        }


        if($this->renewalRequest){
            $member = $this->renewalRequest;
            foreach(['scep_certificate','realization_certificate','annual_report','receipt','other_doc','contract_agreement','tax_return','financial_statement','audit_report'] as $attr){
                if($member->$attr){
                    $media = $member->$attr;
                    $media->as = 'renew/'. $attr .'.'. $media->extension;
                    $res->push($media);
                }
            }
        }

        
        
        if($this->investment){
            $member = $this->investment;
            foreach(['expenses_copy'] as $attr){
                if($member->$attr){
                    $media = $member->$attr;
                    $media->as = 'investment/'. $attr .'.'. $media->extension;
                    $res->push($media);
                }
            }
        }

        if($this->investment){
            $member = $this->investment;
            foreach(['board_resolution'] as $attr){
                if($member->$attr){
                    $media = $member->$attr;
                    $media->as = 'investment/'. $attr .'.'. $media->extension;
                    $res->push($media);
                }
            }
        }

        if($this->investment){
            $member = $this->investment;
            foreach(['valid_permission_rewnal'] as $attr){
                if($member->$attr){
                    $media = $member->$attr;
                    $media->as = 'investment/'. $attr .'.'. $media->extension;
                    $res->push($media);
                }
            }
        }

        if($this->securityAgency){
            $member = $this->securityAgency;
            foreach(['secp_certificate'] as $attr){
                if($member->$attr){
                    $media = $member->$attr;
                    $media->as = 'security-agency/'. $attr .'.'. $media->extension;
                    $res->push($media);
                }
            }
        }        

        if($this->comments){
            $idx = 0;
            $this->comments->each(function($member) use($res, &$idx){
                $member->attachments->each(function($media) use($res, &$idx){
                    $media->as = 'other/'. (++$idx) .'-'. $media->filename;
                    $res->push($media);
                });
            });
        }
        if($payment = $this->payment){
            if($renRequest = $this->renewalRequest){
                if($renRequest->payment){
                    $payment = $renRequest->payment;
                }
            }
            if($media = $payment->manualChallanCopy){
                $media->as = 'manual-payment-challan-'. $payment->pp_txn_ref_no .'.'. $media->extension;
                $res->push($media);
            }
        }

        return $res;
    }

    public function calculateFee($company){
        //dd($company);
        if(\is_main_branch($this) && $company->was_permitted){
            if(\is_liaison($this)){
                $appFeeConfig = config('payment.fee.liaison.renew');
            }
            else{
                $appFeeConfig = config('payment.fee.branch.renew');
            }
        }
        else{
            if(\is_branch($this)){
                $appFeeConfig = config('payment.fee.branch.new');
            }
            else if(\is_sub_branch($this)){
                $appFeeConfig = config('payment.fee.sub_branch.new');
            }
            else if(\is_liaison($this)){
                $appFeeConfig = config('payment.fee.liaison.new');
            }
            else if(\is_sub_liaison($this)){
                $appFeeConfig = config('payment.fee.sub_liaison.new');
            }
        }
        
        $permissionPeriod = $this->permission_period;
        $appFeeUSD = $appFeeConfig['application'];
        $addOnFeeUSD = $appFeeConfig['addOn'];
        $totalFeeUSD = $appFeeUSD + ($addOnFeeUSD);
        //$totalFeeUSD = $appFeeUSD + ($addOnFeeUSD * $permissionPeriod);
        
       //add this code new
        /*if(\is_main_branch($this) && $company->was_permitted){
            if(isset($this->branch->renewal_period) && $this->branch->renewal_period!=""){
              $renewalPeriod = $this->branch->renewal_period;
              $totalFeeUSD = $appFeeUSD + ($addOnFeeUSD * $renewalPeriod);
            }else{

              $totalFeeUSD = $appFeeUSD + ($addOnFeeUSD);
            }
        }else{

           $totalFeeUSD = $appFeeUSD + ($addOnFeeUSD);
        }*/
        //add this code new
        $totlalFeePKR = usd_to_pkr($totalFeeUSD);
        return ['usd' => $totalFeeUSD, 'pkr' => $totlalFeePKR];
    }

    public function isMainOffice(){
        return \is_main_branch($this);
    }
}