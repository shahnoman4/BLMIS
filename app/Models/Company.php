<?php

namespace App\Models;

use Illuminate\Support\Arr;

use App\Lookups\Authorization;
use App\Lookups\ContactType;
use App\Lookups\ServiceType;
use App\Lookups\MediaType;
use App\Lookups\ApplicationStatus;
use Illuminate\Support\Facades\Storage;

class Company extends Model{
    
    // use \App\Traits\Joinable;

    protected $table = "organization";

    protected $fillable = ["was_permitted", "name", "sector", "sector_id"];

    protected $hidden = ['permission_letter_id', 'contacts', 'attachments', '_branch_profile'];

    protected const ENTITY_NAME = 'signup';

    const CREATED_AT = 'subscribed_at';

    public function setNameAttribute($value){
        $this->attributes['name'] = ($value);
    }
    
    public function getNameAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'name'));
    }

    public function attachments(){
        return $this->morphToMany(Media::class, 'entity', EntityMedia::table());
    }
    
    public function owner()
    {
        return $this->hasOne(User::class, "organization_id")->where('authorization_id', Authorization::ORG_ADMIN);
    }
    
    public function contacts()
    {
        return $this->morphMany(Contact::class, "owner");
    }
    
    public function comments()
    {
        return $this->morphMany(ApplicationActivity::class, "entity");
    }
    
    public function branch()
    {
        return $this->hasOne(Branch::class, 'organization_id')->whereIn('service_type_id', [ServiceType::BRANCH, ServiceType::LIAISON])->where(function($query){
            $query->whereNull('converted_from')->orWhere('status_id', '!=', ApplicationStatus::REJECTED);
        })->latest('created_at');
    }
    
    public function subBranches(){
        return $this->hasMany(Branch::class, 'organization_id')->whereNotIn('service_type_id', [ServiceType::BRANCH, ServiceType::LIAISON]);
    }

    public function scopeWithAll($query) 
    {
        $query->with([
            'attachments',
            'contacts', 'contacts.attachments', 'contacts.location',
            'branch', 'branch.contacts', 'branch.contacts.attachments', 'branch.contacts.location',
            'branch.investment', 'branch.investment.attachments', 'branch.contractHistory',
            'branch.contract', 'branch.contract.attachments', 'branch.contract.contacts', 'branch.contract.contacts.attachments', 'branch.contract.contacts.location',
            'branch.securityAgency', 'branch.securityAgency.attachments',
            'branch.securityAgency.contact', 'branch.securityAgency.contact.location'
        ]);
    }

    public function scopeWithAattchments($query) 
    {
        $query->with(['attachments', 'contacts', 'contacts.attachments', 'comments', 'comments.attachments']);
    }
    
    public function scopeAppendAll($query) 
    {
        return $this->append([
            'permission_letter', 'registration_letter', 'memorandum_article','article_association',
            'authority_letter', 'org_profile', 'contact',
            'principal_officer', 'directors'
        ]);
    }

    public function getPermissionLetterAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::PERMISSION_LETTER;
            });
        }
    }

    public function getRegistrationLetterAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::REGISTRATION_LETTER;
            });
        }
    }

    public function getOrgProfileAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::ORG_PROFILE;
            });
        }
    }

    public function getMemorandumArticleAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::MEMORANDUM_ARTICLE;
            });
        }
    }

    public function getArticleAssociationAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::ARTICLE_ASSOCIATION;
            });
        }
    }

    public function getAuthorityLetterAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::AUTHORITY_LETTER;
            });
        }
    }

    public function getPoDpAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::DP;
            });
        }
    }

    

    public function getContactAttribute()
    {
        return $this->contacts->firstWhere('contact_type_id', ContactType::ORGANIZATION)->append(['nic_copy', 'passport_copy']);
    }
    
    public function getPrincipalOfficerAttribute()
    {
        return $this->contacts->firstWhere('contact_type_id', ContactType::PRINCIPAL_OFFICER)->append(['nic_copy', 'passport_copy', 'dp', 'cv', 'cover_letter']);
    }
    
    public function getDirectorsAttribute()
    {
        return $this->contacts->filter(function ($contact, $key) {
            return $contact->contact_type_id === ContactType::DIRECTOR;
        })
        ->each(function($item){
            $item->append(['nic_copy', 'passport_copy', 'dp', 'cv', 'cover_letter']);
        })->values();
    }

    public function updateProfile($data){
        $dirty = false;
        $contactsMedia = [];
        $companyMedia = [];
        $detail = Arr::get($data, 'Company');
        if($detail){
            $this->fill($detail);
            $dirty = $dirty || $this->isDirty();
            $this->save();
            $permissionLetter = Arr::get($data, 'Company.permission_letter');
            if($permissionLetter && !Arr::get($permissionLetter, 'id')){
                $companyMedia[$this->id] = [
                    [$permissionLetter,  MediaType::PERMISSION_LETTER, 'permission-letter']
                ];
            }
        }
        $contact = Arr::get($data, 'Contact');
        if($contact){
            $this->contact->fill($contact);
            $dirty = $dirty || $this->contact->isDirty();
            $this->contact->save();
            $contactsMedia[$this->contact->id] = [];
            $nic = Arr::get($data, 'Contact.nic_copy');
            if($nic && !Arr::get($nic, 'id')){
                $contactsMedia[$this->contact->id][] = [$nic,  MediaType::NIC, 'contact-nic-copy'];
            }
            
            $passport = Arr::get($data, 'Contact.passport_copy');
            if($passport && !Arr::get($passport, 'id')){
                $contactsMedia[$this->contact->id][] = [$passport,  MediaType::PASSPORT, 'contact-passport-copy'];
            }

        }
        $contactLocation = Arr::get($data, 'Contact.Location');
        if($contactLocation){
            $this->contact->location->fill($contactLocation);
            $dirty = $dirty || $this->contact->location->isDirty();
            $this->contact->location->save();
        }
        $po = Arr::get($data, 'PO');
        if($po){
            $this->principalOfficer->fill($po);
            $dirty = $dirty || $this->principalOfficer->isDirty();
            $this->principalOfficer->save();

            $contactsMedia[$this->principalOfficer->id] = [];
            foreach([
                ['dp', MediaType::DP, 'po-photo'],
                ['cv', MediaType::CV, 'po-cv'],
                ['cover_letter', MediaType::COVER_LETTER, 'po-cover-letter'],
                ['nic_copy', MediaType::NIC, 'po-nic'],
                ['passport_copy', MediaType::PASSPORT, 'po-passport'],
            ] as $mediaType){
                $mediaData = Arr::get($po, $mediaType[0]);
                if($mediaData && !Arr::get($mediaData, 'id')){
                    $contactsMedia[$this->principalOfficer->id][] = [$mediaData,  $mediaType[1], $mediaType[2]];
                }
            }

        }
        $directors = Arr::get($data, 'Directors');
        if($directors){
            foreach($directors as $key => $director){
                if(Arr::get($director, 'id')){
                    $obj = $this->directors->firstWhere('id', Arr::get($director, 'id'));
                    if($obj){
                        $obj->fill($director);
                        $dirty = $dirty || $obj->isDirty();
                        $obj->save();

                        $contactsMedia[$obj->id] = [];
                        // $suffix = preg_replace('/[^A-Za-z]/', '-', $director['full_name']) . '-' . ($key + 1);
                        $suffix = $key + 1;
                        foreach([
                            ['dp', MediaType::DP, 'director-photo-' . $suffix],
                            ['cv', MediaType::CV, 'director-cv-' . $suffix],
                            ['cover_letter', MediaType::COVER_LETTER, 'director-cover-letter-' . $suffix],
                            ['nic_copy', MediaType::NIC, 'director-nic-' . $suffix],
                            ['passport_copy', MediaType::PASSPORT, 'director-passport-' . $suffix],
                        ] as $mediaType){
                            $mediaData = Arr::get($director, $mediaType[0]);
                            if($mediaData && !Arr::get($mediaData, 'id')){
                                $contactsMedia[$obj->id][] = [$mediaData,  $mediaType[1], $mediaType[2]];
                            }
                        }
                        
                    }
                }
                else{
                    $this->addDirector($director, $key, $contactsMedia);
                    $dirty = $dirty || true;
                }
            }
        }

        
        $contactMediaIds = [];
        foreach(['contact' => $contactsMedia, static::ENTITY_NAME => $companyMedia] as $type => $mediaList){
            foreach($mediaList as $entityId => $list){
                foreach($list as $item){
                    $mediaId = $this->generateUploadedMediaId(...$item);
                    if($mediaId){
                        $contactMediaIds[] = ['media_id' => $mediaId, 'entity_id' => $entityId, 'entity_type' => $type];
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
            $this->save();
            return ApplicationActivity::logStatus(\Auth::user(), static::ENTITY_NAME, $this->id, ApplicationStatus::UPDATED, ['meta' => ['section' => Arr::get($data, 'section')]]);
        }
    }

    public static function register(array $data){

        
        \DB::beginTransaction();
        try{
            
            $contactsMedia = [];
            $companyMedia = [];
            $sector = $data['Company']['sector_id'];
            $result ="";
            foreach ($sector as  $value) {
                //dd($value['value']);
              $result .= $value['value'].",";
            }
            $sectorId =  rtrim($result,',');
            $company = new Company(Arr::get($data, 'Company'));
            $company->status_id = ApplicationStatus::NEW;
            $company->locked = 1;
            $company->sector_id = $sectorId;
            $company->uid = preg_replace('/[\s.]/', '', microtime());
            $company->save();
            //dd($company);
            if($company->was_permitted == 1){
                $companyMedia[$company->id] = [
                    [Arr::get($data, 'Company.permission_letter'),  MediaType::PERMISSION_LETTER, 'permission-letter']
                ];
            }
           if(Arr::get($data, 'Contact.nic_copy')!=""){
                $companyContact = $company->addMorphContact(Arr::get($data, 'Contact'), ContactType::ORGANIZATION);
                $contactsMedia[$companyContact->id] = [
                    [Arr::get($data, 'Contact.nic_copy'),  MediaType::NIC, 'contact-nic-copy'],
                    //[Arr::get($data, 'Contact.passport_copy'),  MediaType::PASSPORT, 'contact-passport-copy']
                ];
            }
            
            if(Arr::get($data, 'Contact.passport_copy')!=""){
                $companyContact = $company->addMorphContact(Arr::get($data, 'Contact'), ContactType::ORGANIZATION);
                $contactsMedia[$companyContact->id] = [
                   // [Arr::get($data, 'Contact.nic_copy'),  MediaType::NIC, 'contact-nic-copy'],
                    [Arr::get($data, 'Contact.passport_copy'),  MediaType::PASSPORT, 'contact-passport-copy']
                ];
            }


    
            $user = new User(Arr::get($data, 'User'));
            $user->organization_id = $company->id;
            $user->authorization_id = Authorization::ORG_ADMIN;
    
            $password = str_random(12);
            $hashedPassword = \Hash::make($password);
            $user->password = $hashedPassword;
            $user->status_id = \App\Lookups\ProfileStatus::ACTIVE;
            $user->save();
           
            $company->addPrincipalOfficer(Arr::get($data, 'PO'), $contactsMedia);
            
            $directors = Arr::get($data, 'Directors');
            if($directors){
                $company->addDirectors($directors, $contactsMedia);
            }
    
            $contactMediaIds = [];
            foreach(['contact' => $contactsMedia, static::ENTITY_NAME => $companyMedia] as $type => $mediaList){
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

            if(count($contactMediaIds)){
                EntityMedia::insert($contactMediaIds);
            }
            //dd($company);
            ApplicationActivity::logStatus($user, static::ENTITY_NAME, $company->id, ApplicationStatus::NEW);
            //dd($user);
            //event(new \App\Events\Application\CompanyRegistered($user, $password));
            //
            \DB::commit();
            
            return $user->toArray();
        }
        catch(\Exception $e){
            \DB::rollback();
            //echo "string";exit();
            return null;
        }
    }


    public function generateUploadedMediaId($value, $type, $namePrefix, $dir = ''){
        $media = $this->fillUploadedMedia($value, $type, $namePrefix, $dir);
        if($media){
            $media->save();
            return $media->id;
        }
        return null;
    }

    private function fillUploadedMedia($value, $type, $namePrefix, $dir = ''){
        $media = new Media;
        $media->fillFromPath($value['path'], null, $type);
        $filename = "{$namePrefix}-" . time() . ".{$media->extension}";
        $newPath = "company/{$this->id}{$dir}/{$filename}";
        
        if(Storage::disk('uploads')->put($newPath, Storage::get($media->path))){
            Storage::delete($media->path);
            $media->filename = $value['filename']; //client orginal name
            $media->path = $newPath;
            $media->url = Storage::disk('uploads')->url($newPath);
            return $media;
        }
        return null;
    }

    public function addPrincipalOfficer(array $data, &$unsavedAttachments){
        $contact = $this->addMorphContact($data, ContactType::PRINCIPAL_OFFICER, false);
        
        $unsavedAttachments[$contact->id] = [
            [Arr::get($data, 'dp'),  MediaType::DP, 'po-photo'],
            [Arr::get($data, 'cv'),  MediaType::CV, 'po-cv'],
            [Arr::get($data, 'cover_letter'),  MediaType::COVER_LETTER, 'po-cover-letter'],
            [Arr::get($data, 'nic_copy'),  MediaType::NIC, 'po-nic'],
            [Arr::get($data, 'passport_copy'),  MediaType::PASSPORT, 'po-passport']
        ];
    }


    
    
    public function addDirectors(array $data, &$unsavedAttachments){
        $models = [];
        foreach($data as $key => $director){
            $models[] = $this->addDirector($director, $key, $unsavedAttachments);
        }

        return $models;
    }
    
    public function addDirector(array $data, $key = 0, &$unsavedAttachments){
        // $suffix = preg_replace('/[^A-Za-z]/', '-', $data['full_name']) . '-' . ($key + 1);
        $suffix = $key + 1;
        $contact = $this->addMorphContact($data, ContactType::DIRECTOR, false);

        $unsavedAttachments[$contact->id] = [
            [Arr::get($data, 'dp'),  MediaType::DP, 'director-photo-' . $suffix],
            [Arr::get($data, 'cv'),  MediaType::CV, 'director-cv-' . $suffix],
            [Arr::get($data, 'cover_letter'),  MediaType::COVER_LETTER, 'director-cover-letter-' . $suffix],
            [Arr::get($data, 'nic_copy'),  MediaType::NIC, 'director-nic-' . $suffix],
            [Arr::get($data, 'passport_copy'),  MediaType::PASSPORT, 'director-passport-' . $suffix]
        ];
        return $contact;
    }

    public static function getLogs($id){
        $data = \DB::table(ApplicationActivity::table('log'))
        ->join(Company::table('org'), 'org.id', '=', 'log.entity_id')
        ->join(User::table('u'), 'u.id', '=', 'log.user_id')
        ->leftJoin(EntityMedia::table('em'), function($join){
            $join->on('em.entity_id', '=', 'log.id')
                 ->where('em.entity_type', 'log');
        })
        ->leftJoin(Media::table('media'), function($join){
            $join->on('em.media_id', '=', 'media.id');
        })
        ->select(\DB::raw('`log`.*, media.id as attachment_id, media.filename as attachment_title, `u`.`authorization_id`, `u`.`full_name` as `user_name`, `u`.`authorization_id` = '. Authorization::SUPER_ADMIN .' as `is_admin`, `org`.`name` as `org_name`'))
        ->where('org.id', $id)
        ->where('log.entity_type', static::ENTITY_NAME)
        ->where(function($query){
            if(!\Auth::user()->isSuperAdmin()){
                $query->where('u.authorization_id', '=', Authorization::SUPER_ADMIN)
                ->orWhereRaw('u.organization_id = org.id');
            }
        })
        ->orderBy('log.performed_at', 'ASC')
        ->get()->groupBy('id')->values();
        
        return $data->transform(function($item){
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
    }

    public function getAllAttachments(){
        $res = collect();

        foreach(['permission_letter'] as $attr){
            if($this->$attr){
                $media = $this->$attr;
                $media->as = $attr . '.' . $media->extension;
                $res->push($media);
            }
        }
        
        if($this->contact){
            $member = $this->contact;
            foreach(['nic_copy', 'passport_copy'] as $attr){
                if($member->$attr){
                    $media = $member->$attr;
                    $media->as = 'contact-person-' . $attr . '.' . $media->extension;
                    $res->push($media);
                }
            }
        }
        
        if($this->principalOfficer){
            $member = $this->principalOfficer;
            foreach(['nic_copy', 'passport_copy', 'dp', 'cv', 'cover_letter'] as $attr){
                if($member->$attr){
                    $media = $member->$attr;
                    $media->as = 'principal-officer-'. \Str::slug($member->full_name, '-') .'/' . $attr . '.' . $media->extension;
                    $res->push($media);
                }
            }
        }
        
        if($this->directors){
            $this->directors->each(function($member, $idx) use($res){
                foreach(['nic_copy', 'passport_copy', 'dp', 'cv', 'cover_letter'] as $attr){
                    if($member->$attr){
                        $media = $member->$attr;
                        $media->as = 'directors/'. ($idx + 1) .'-'. \Str::slug($member->full_name, '-') .'/' . $attr . '.' . $media->extension;
                        $res->push($media);
                    }
                }
            });
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

        return $res;
    }


}