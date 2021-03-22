<?php

namespace App\Models;

use \App\Lookups\ApplicationStatus;
use \App\Lookups\Authorization;
use \App\Lookups\MediaType;
use Illuminate\Support\Facades\Storage;

class ApplicationActivity extends Model{
    use \App\Traits\UsesUuid;
    
    protected $table = 'app_activity_log';
    
    const CREATED_AT = 'performed_at';
    const UPDATED_AT = null;

    public function attachments(){
        return $this->morphToMany(Media::class, 'entity', EntityMedia::table());
    }

    public function company(){
        return $this->hasOne(Company::class, 'id', 'entity_id');
    }

    public function branch(){
        return $this->hasOne(Branch::class, 'id', 'entity_id');
    }

    public function isCompanyLog(){
        return $this->entity_type == 'signup';
    }

    public function isBranchLog(){
        return $this->entity_type == 'branch';
    }

    public function setCommentsAttribute($value){
        $this->attributes['comments'] = encrypt($value);
    }
    
    public function getCommentsAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'comments'));
    }

    public static function logStatus($user, $type, int $id, $newStatusId, array $_data = []){
        $type = strtolower($type);
        if(isset($_data['role_id']) && $_data['role_id']!=""){
            $data = [
                "user_id" => $user->id,
                "status_id" => $newStatusId,
                "comments" => \Arr::get($_data, 'comments'),
                "performed_at" => now(),
                "entity_type" => $type,
                "entity_id" => $id,
                "role_id" => $_data['role_id']
            ];
        }else{

            $data = [
                "user_id" => $user->id,
                "status_id" => $newStatusId,
                "comments" => \Arr::get($_data, 'comments'),
                "performed_at" => now(),
                "entity_type" => $type,
                "entity_id" => $id
            ];
        }
        if($meta = \Arr::get($_data, 'meta')){
            if(!is_string($meta)){
                $meta = json_encode($meta);
            }
            $data['payload'] = $meta;
        }
        $log = new static;
        foreach($data as $key => $value){
            $log->{$key} = $value;
        }
        $log->save();
        $logId = $log->id;

        $attachments = \Arr::get($_data, 'attachments');
        $data['attachments'] = [];
        if(!empty($attachments)){
            $mediaIds = [];
            foreach($attachments as $idx => $attachment){
                $mId = static::generateUploadedMediaId($attachment, $type, $id, $idx + 1);
                if($mId){
                    $mediaIds[] = ['media_id' => $mId, 'entity_type' => 'log', 'entity_id' => $logId];
                    $data['attachments'][] = ['id' => $mId, 'title' => $attachment['filename']];
                }
            }

            if(count($mediaIds)){
                EntityMedia::insert($mediaIds);
            }
        }

        
        if($user->isSuperAdmin()){
            if($type == "signup"){
                $model = Company::findOrFail($id);
            }
            else if($type == "branch"){
                $model = Branch::findOrFail($id);
            }
            else if($type == "contract"){
                $model = Contract::join(Branch::table(), 'branch.id', '=', 'contract.branch_id')
                    ->select('contract.*')->where('branch.status_id', ApplicationStatus::APPROVED)
                    ->findOrFail($id);
            }
            $oldStatusId = $model->status_id;
            if($newStatusId === ApplicationStatus::APPROVED || $newStatusId === ApplicationStatus::REJECTED || $newStatusId === ApplicationStatus::CIRCULATED){
                if($type == "branch" && \is_branch($model)){
                    $model->contract->status_id = $newStatusId;
                    $model->contract->save();
                }
                $model->status_id = $newStatusId;
                $model->save();
            }
            else if($newStatusId === ApplicationStatus::COMMENTED || $newStatusId === ApplicationStatus::REVERTED){
                /**
                 * Descision made till now is that
                 * If Super Admin makes a comment on application request or revert it then
                 * unlock the profile for editing
                 */
                if($type == "signup" || $type == "branch"){
                    $model->locked = 0;
                    if($newStatusId === ApplicationStatus::REVERTED){
                        $model->status_id = $newStatusId;
                    }
                    $model->save();
                }
            }
            if($newStatusId === ApplicationStatus::SHARED){
                $model->shared_at = now();
                $model->save();
            }
            if($newStatusId === ApplicationStatus::CIRCULATED){
                $circulars = [];
                foreach($_data['role'] as $roleId){
                    $circulars[] = ['activity_id' => $logId, 'branch_id' => $id, 'role_id' => $roleId];
                }
                \DB::table('app_circular')->insert($circulars);
            }
            event(new \App\Events\Application\StatusUpdated($model, $oldStatusId, $newStatusId, encrypt($data['comments'])));
        }
        $data['performed_at'] = $data['performed_at']->format('Y-m-d H:i:s');
        $data['id'] = $logId;
        
        if($meta = \Arr::get($data, 'payload')){
            if(is_string($meta)){
                $meta = json_decode($meta, true);
            }
            $data['payload'] = $meta;
        }

        return $data;
    }


    public static function generateUploadedMediaId($value, $entityType, $entityId, $idx = 1){
        $media = static::fillUploadedMedia($value, $entityType, $entityId, $idx);
        if($media){
            $media->save();
            return $media->id;
        }
        return null;
    }

    private static function fillUploadedMedia($value, $entityType, $entityId, $idx = 1){
        $media = new Media;
        $media->fillFromPath($value['path'], null, MediaType::ATTACHMENT);
        $filename = "activity-attachemt" . $idx . "-". time() . ".{$media->extension}";
        $newPath = "activity-logs/{$entityType}/{$entityId}/{$filename}";
        
        if(Storage::disk('uploads')->put($newPath, Storage::get($media->path))){
            Storage::delete($media->path);
            $media->filename = $value['filename']; //client orginal name
            $media->path = $newPath;
            $media->url = \Storage::disk('uploads')->url($newPath);
            return $media;
        }
        return null;
    }

    public function getAllAttachments(){
        $res = collect();
        
        if($this->attachments){
            $this->attachments->each(function($media, $idx) use($res){
                $media->as = ($idx + 1) .'-'. $media->filename;
                $res->push($media);
            });
        }

        return $res;
    }
}
