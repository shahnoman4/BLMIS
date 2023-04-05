<?php


namespace App\Models;

use App\Lookups\MediaType;

class Investment extends Model{
    
    protected $table = 'investment';
    
    public $timestamps = false;
    
    protected $hidden = ['attachments'];

    protected $fillable = [
        'proposal_info', 'annual_expenses', 'investment_info', 'pk_bank',
        'designated_person', 'comments','valid_permission_rewnal',
    ];

    public function attachments(){
        return $this->morphToMany(Media::class, 'entity', EntityMedia::table());
    }

    public function scopeAppendAll(){
        return $this->append(['expenses_copy','board_resolution','valid_permission_rewnal']);
    }
    
    public function getExpensesCopyAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::ATTACHMENT;
            });
        }
    }

    public function getBoardResolutionAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::Board_Resolution;
            });
        }
    }

    public function getValidPermissionRewnalAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::Valid_Permission_Rewnal;
            });
        }
    }
}
