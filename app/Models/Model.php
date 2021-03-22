<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model as BaseModel;

class Model extends BaseModel{
    use \App\Traits\Trackable;
    use \App\Traits\StaticProps;


    /*
     */
    protected $hidden = ["trashed_at"];

    protected function addMorphContact($data, $type, $hasLocation = true){
        $contact = new Contact($data);
        $contact->contact_type_id = $type;
        $contact->owner_type = static::ENTITY_NAME;
        $contact->owner_id = $this->id;
        if($hasLocation){
            $locationData = \Arr::get($data, 'Location');
            if($locationData){
                $location = new Location($locationData);
                $location->save();
                $contact->location_id = $location->id;
            }
        }
        $contact->save();
        return $contact;
    }

    protected function updateMorphContact($data, $contact){
        $dirty = false;
        $contact->fill($data);
        $dirty = $dirty || $contact->isDirty();
        
        $locationData = \Arr::get($data, 'Location');
        if($locationData){
            if($contact->location){
                $contact->location->fill($locationData);
                $dirty = $dirty || $contact->location->isDirty();
                $contact->location->save();
            }
            else{
                $location = new Location($locationData);
                $location->save();
                $contact->location_id = $location->id;
                $dirty = $dirty || true;
            }
        }
        
        if($dirty){
            $contact->save();
        }
        return $dirty;
    }
    
}
