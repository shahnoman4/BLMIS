<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Lookups\Authorization;

use App\Lookups;

class User extends Authenticatable
{
    use Notifiable;
    use \App\Traits\StaticProps;
    use \App\Traits\UsesUuid;
    
    protected $table = "user";

    // protected $with = ['contact', 'company'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'full_name', 'user_name', 'first_name', 'last_name', 'email','organization_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',  'authorization_id', '__role_id'
    ];

    public function setFullNameAttribute($value){
        $this->attributes['full_name'] = encrypt($value);
    }
    
    public function getFullNameAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'full_name'));
    }
    
    public function setFirstNameAttribute($value){
        $this->attributes['first_name'] = encrypt($value);
    }
    
    public function getFirstNameAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'first_name'));
    }
    
    public function setLastNameAttribute($value){
        $this->attributes['last_name'] = encrypt($value);
    }
    
    public function getLastNameAttribute(){
        return c_decrypt(\Arr::get($this->attributes, 'last_name'));
    }
    
    // public function setUserNameAttribute($value){
    //     $this->attributes['user_name'] = encrypt($value);
    // }
    
    // public function getUserNameAttribute(){
    //     return c_decrypt(\Arr::get($this->attributes, 'user_name'));
    // }
    
    // public function setEmailAttribute($value){
    //     $this->attributes['email'] = encrypt($value);
    // }
    
    // public function getEmailAttribute(){
    //     return c_decrypt(\Arr::get($this->attributes, 'email'));
    // }
    
    public function contact()
    {
        return $this->hasOne(Contact::class, "owner_id")->where(["contact_type_id" => Lookups\ContactType::USER]);
    }
    
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
    
    public function company()
    {
        return $this->belongsTo(Company::class, "organization_id");
    }
    
    public function getEmailForPasswordReset()
    {
        return $this->primaryEmail();
    }
    
    public function primaryEmail(){
        return $this->email;
    }
    
    public function routeNotificationForMail()
    {
        return $this->primaryEmail();
    }

    public function isSuperAdmin(){
        return $this->authorization_id == Authorization::SUPER_ADMIN;
    }

    public function isStakeholder(){
        return $this->authorization_id == Authorization::ADMIN;
    }

    public function isCompanyOwner(){
        return $this->authorization_id == Authorization::ORG_ADMIN;
    }

    public function sendPasswordResetNotification($token){
        \Mail::to([
            "address" => $this->primaryEmail(),
        ])->send(new \App\Mail\PasswordReset($this, $token));
    }
}
