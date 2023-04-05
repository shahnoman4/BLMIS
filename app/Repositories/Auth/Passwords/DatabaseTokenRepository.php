<?php

namespace App\Repositories\Auth\Passwords;

use Illuminate\Auth\Passwords\DatabaseTokenRepository as BaseRepository;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Carbon\Carbon;

class DatabaseTokenRepository extends BaseRepository{
    public function create(CanResetPasswordContract $user)
    {
        $this->deleteExisting($user);

        // We will create a new, random token for the user so that we can e-mail them
        // a safe link to the password reset form. Then we will insert a record in
        // the database so that we can verify the token within the actual reset.
        $token = $this->createNewToken();
        $this->getTable()->insert($this->getPayload($user, $token));

        return $token;
    }
    
    protected function getPayload($user, $token)
    {
        return ['email' =>$user->getEmailForPasswordReset(), 'user_name' => $user->user_name, 'token' => $this->hasher->make($token), 'created_at' => new Carbon];
    }
    
    protected function deleteExisting(CanResetPasswordContract $user)
    {
        return $this->getTable()->where('user_name', $user->user_name)->delete();
    }
    
    public function exists(CanResetPasswordContract $user, $token)
    {
        $record = (array) $this->getTable()->where(
            'user_name', $user->user_name
        )->first();
        return $record &&
            !$this->tokenExpired($record['created_at']) &&
            $this->hasher->check($token, $record['token']);
    }
    
    
}
