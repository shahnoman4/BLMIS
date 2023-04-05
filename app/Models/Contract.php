<?php


namespace App\Models;

use App\Lookups\MediaType;
use App\Lookups\ContactType;
use App\Lookups\ApplicationStatus;
use App\Lookups\Authorization;
use Illuminate\Support\Carbon;
use Arr;

class Contract extends Model{
    
    protected $table = 'contract';

    protected const ENTITY_NAME = 'contract';
    
    protected $dates = [
        'start_date', 'shared_at'
    ];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
    ];

    protected $hidden = ['attachments', 'contacts'];

    protected $fillable = [
        'title', 'start_date', 'start_page', 'start_clause',
        'valid_for_years', 'end_page', 'end_clause', 'project_cost',
        'defect_start_month', 'defect_start_year', 'defect_end_month', 'defect_end_year',
    ];

    public function attachments(){
        return $this->morphToMany(Media::class, 'entity', EntityMedia::table());
    }

    public function contacts()
    {
        return $this->morphMany(Contact::class, "owner");
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function setStartDateAttribute($value){
        $this->attributes['start_date'] = new Carbon($value);
    }

    public function scopeWithAll($query) 
    {
        $query->with([
            'attachments', 'contacts', 'contacts.location', 'contacts.attachments',
            'branch', 'branch.company'
        ]);
    }

    public function scopeAppendAll(){
        return $this->append(['agreement_letter', 'partner_companies']);
    }
    
    public function getAgreementLetterAttribute(){
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::AGREEMENT_LETTER;
            });
        }
    }

    public function getPartnerCompaniesAttribute(){
        $list = $this->contacts->filter(function($item){
            return $item->contact_type_id === ContactType::PARTNER_COMPANY;
        })->values();
        if($list->isNotEmpty()){
            $ids = $list->pluck('id')->toArray();
            $partnerPersons = Contact::with('attachments')->where('owner_type', 'partner')->whereIn('owner_id', $ids)->get()->groupBy('owner_id');
            foreach($list as &$item){
                $item->append(['secp_certificate', 'lease_agreement']);
                if(isset($partnerPersons[$item->id])){
                    $item->contact = $partnerPersons[$item->id][0];
                    $item->contact->append('nic_copy');
                }
            }
        }
        return $list;
    }

    public static function make(Branch $branch, array $data){
        $contract = new static();
        $contract->_save($data, $branch);
        event(new \App\Events\Application\ContractAdded($contract));
        ApplicationActivity::logStatus(\Auth::user(), static::ENTITY_NAME, $contract->id, ApplicationStatus::NEW);
        return $contract;
    }

    public function extend($data){
        $this->_save($data, $this->branch);
        event(new \App\Events\Application\ContractAdded($this));
        ApplicationActivity::logStatus(\Auth::user(), static::ENTITY_NAME, $this->id, ApplicationStatus::NEW);
        return $this;
    }

    private function _save($data, $branch){
        $media = [
            'contact' => [],
            'contract' => [],
        ];
        $company = $branch->company;
        $contract = $this;
        $contract->fill(Arr::get($data, 'Contract'));
        $contract->branch_id = $branch->id;
        $contract->status_id = ApplicationStatus::NEW;
        $contract->save();
        $media['contract'][$contract->id] = [
            [Arr::get($data, 'Contract.agreement_letter'),  MediaType::AGREEMENT_LETTER, 'contract-agreement'],
        ];
        
        foreach(Arr::get($data, 'PartnerCompanies', []) as $idx => $partnerData){
            $partner = $contract->addMorphContact($partnerData, ContactType::PARTNER_COMPANY);
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
        
            $contactMediaIds = [];
            foreach($media as $type => $mediaList){
                foreach($mediaList as $entityId => $list){
                    foreach($list as $item){
                        $item[] = '/contract/'. now()->format('Ymd'). '-' .$contract->id;
                        $mediaId = $company->generateUploadedMediaId(...$item);
                        if($mediaId){
                            $contactMediaIds[] = ['media_id' => $mediaId, 'entity_id' => $entityId, 'entity_type' => $type];
                        }
                    }
                }
            }

            if(count($contactMediaIds)){
                EntityMedia::insert($contactMediaIds);
            }
        }
    }
    

    public function getLogs(){
        $query = \DB::table(ApplicationActivity::table('log'))
        ->join(Contract::table('c'), 'c.id', '=', 'log.entity_id')
        ->join(Branch::table('branch'), 'branch.id', '=', 'c.branch_id')
        ->join(Company::table('org'), 'org.id', '=', 'branch.organization_id')
        ->join(User::table('u'), 'u.id', '=', 'log.user_id')
        ->select(\DB::raw('`log`.*, `u`.`authorization_id`, `u`.`full_name` as `user_name`, `u`.`authorization_id` = '. Authorization::SUPER_ADMIN .' as `is_admin`, `u`.`authorization_id` = '. Authorization::ADMIN .' as `is_sh_admin`, `org`.`name` as `org_name`'))
        
        ->where('log.entity_type', static::ENTITY_NAME)
        ->where('log.status_id', '!=', ApplicationStatus::HELD)
        ->where(function($query){
            if(!\Auth::user()->isSuperAdmin()){
                $query->where('u.authorization_id', '=', Authorization::SUPER_ADMIN);
                $query->orWhere('u.id', \Auth::user()->id);
                $query->orWhereRaw('u.organization_id = branch.organization_id');
            }
        });
        $query->where('branch.organization_id', $this->branch->company->id);
        $query->where('branch.id', $this->branch->id);
        $query->orderBy('log.performed_at', 'ASC');
        $data = $query->get();
        
        return $data->each(function($item){
            foreach(['comments', 'org_name', 'name', 'user_name'] as $key){
                try{
                    $item->$key = c_decrypt($item->$key);
                }
                catch(\Exception$e){

                }
            }
        });
        
        return $data;
    }

    public function getAllAttachments(){
        $res = collect();
        
        $member = $this;
        foreach(['agreement_letter'] as $attr){
            if($member->$attr){
                $media = $member->$attr;
                $media->as = 'contract-'. $attr .'.'. $media->extension;
                $res->push($media);
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

        return $res;
    }
}
