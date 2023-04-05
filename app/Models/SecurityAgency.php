<?php


namespace App\Models;

use App\Lookups\MediaType;

class SecurityAgency extends Model{
    
    protected $table = 'security_agency';
    
    public $timestamps = false;

    protected const ENTITY_NAME = 'security';

    protected $fillable = [
        'name', 'ntn', 'is_pk_based', 'has_foreign_consultant',
        'is_extension', 'extension_info',
    ];
    
    protected $hidden = ['attachments'];

    public function attachments(){
        return $this->morphToMany(Media::class, 'entity', EntityMedia::table());
    }

    public function contact(){
        return $this->morphOne(Contact::class, 'owner');
    }

    public function scopeAppendAll(){
        return $this->append(['secp_certificate']);
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
