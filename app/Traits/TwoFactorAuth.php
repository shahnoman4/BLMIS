<?php

namespace App\Traits;

use DB;

trait TwoFactorAuth{

    protected static $table = 'two_fa_token';
    
    public function create2FAToken(){
        $this->delete2FAToken();
        $emailPin = mt_rand(1000,9999);
        DB::table(static::$table)->insert([
            'user_id' => $this->user->id,
            'email' => $this->user->primaryEmail(),
            'email_pin' => \Hash::make($emailPin),
            'attempts' => 0,
            'created_at' => now()
        ]);
        event(new \App\Events\TwoFATokenCreated($this->user, $emailPin));
    }

    public function delete2FAToken(){
        DB::table(static::$table)->where('user_id', $this->user->id)->delete();
    }

    public function get2FAToken(){
        return DB::table(static::$table)->where('user_id', $this->user->id)->first();
    }

    public function update2FAToken($data){
        return DB::table(static::$table)->where('user_id', $this->user->id)->update([
            'attempts' => $data->attempts,
        ]);
    }

    public function save2FState($verified){
        if($verified){
            return session()->put('2fa', $this->user->id);
        }
        return session()->forget('2fa');
    }

}