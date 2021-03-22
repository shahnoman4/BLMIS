<?php


namespace App\Models;

use App\Lookups\MediaType;

class Contact extends Model{
    
    protected $table = 'contact';

    protected $fillable = [
        'office_phone', 'office_fax', 'office_email', 'primary_email',
        'primary_phone', 'full_name', 'nic_no', 'passport_no', 'mobile_phone',
        'contact_category_id','primary_email_md5','office_email_md5',
    ];
    
    protected $hidden = [
        'contact_type_id', 'location_id', 'owner_id', 'owner_type',
         'attachments',
    ];

    
    public function setOfficePhoneAttribute($value){
        $this->attributes['office_phone'] = encrypt($value);
    }
    
    public function getOfficePhoneAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'office_phone'));
    }

    public function setOfficeFaxAttribute($value){
        $this->attributes['office_fax'] = encrypt($value);
    }
    
    public function getOfficeFaxAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'office_fax'));
    }
    
    /* public function setOfficeEmailAttribute($value){
        $this->attributes['office_email'] = encrypt($value);
    }
    
    public function getOfficeEmailAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'office_email'));
    }
    
    public function setPrimaryEmailAttribute($value){
        $this->attributes['primary_email'] = encrypt($value);
    }
    
    public function getPrimaryEmailAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'primary_email'));
    } */
    
    public function setPrimaryPhoneAttribute($value){
        $this->attributes['primary_phone'] = encrypt($value);
    }
    
    public function getPrimaryPhoneAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'primary_phone'));
    }

    public function setFullNameAttribute($value){
        $this->attributes['full_name'] = encrypt($value);
    }
    
    public function getFullNameAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'full_name'));
    }
    
    public function setNicNoAttribute($value){
        $this->attributes['nic_no'] = encrypt($value);
    }
    
    public function getNicNoAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'nic_no'));
    }
    
    public function setPassportNoAttribute($value){
        $this->attributes['passport_no'] = encrypt($value);
    }
    
    public function getPassportNoAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'passport_no'));
    }
    
    public function setMobilePhoneAttribute($value){
        $this->attributes['mobile_phone'] = encrypt($value);
    }
    
    public function getMobilePhoneAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'mobile_phone'));
    }

    public function attachments(){
        return $this->morphToMany(Media::class, 'entity', EntityMedia::table());
    }

    public function location(){
        return $this->hasOne(Location::class, 'id', 'location_id');
    }

    public function getCvAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::CV;
            });
        }
    }
    
    public function getCoverLetterAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::COVER_LETTER;
            });
        }
    }
    
    public function getDpAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::DP;
            });
        }
    }
    
    public function getNicCopyAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::NIC;
            });
        }
    }
    
    public function getPassportCopyAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::PASSPORT;
            });
        }
    }
    
    public function getLeaseAgreementAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::LEASE_AGREEMENT;
            });
        }
    }
    
    public function getSecpCertificateAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::SECP_CERTIFICATE;
            });
        }
    }
}
