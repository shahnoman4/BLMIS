<?php
namespace App\Services\Auth\Passwords;

use Illuminate\Auth\Passwords\PasswordBroker as BasePasswordBroker;
use App\Models\User;

class PasswordBroker extends BasePasswordBroker {

    const INVALID_EMAIL = 'passwords.email';

    public function sendResetLink(array $credentials)
    {
        // First we will check to see if we found a user at the given credentials and
        // if we did not we will redirect back to this current URI with a piece of
        // "flash" data in the session to indicate to the developers the errors.
        $user = $this->getUser($credentials);
        if (is_null($user)) {
            return static::INVALID_USER;
        }
        
        if (!$user->email) {
            return static::INVALID_EMAIL;
        }
        
        // Once we have the reset token, we are ready to send the message out to this
        // user with a link to reset their password. We will then redirect back to
        // the current URI having nothing set in the session to indicate errors.
        
        $user->sendPasswordResetNotification(
            $this->tokens->create($user)
        );

        return static::RESET_LINK_SENT;
    }
    
    public function getUser(array $credentials)
    {
        $userName =  $credentials['user_name'];
        $user = User::where('user_name', $userName)->orWhere('email', $userName)->first();
        if ($user && !$user instanceof User) {
            throw new UnexpectedValueException('User must implement CanResetPassword interface.');
        }
        
        return $user;
    }
    
    
    protected function validatePasswordWithDefaults(array $credentials)
    {
        list($password, $confirm) = [
            $credentials['password'],
            $credentials['password_confirmation'],
        ];

        return $password === $confirm && mb_strlen($password) >= 3;
    }
    
}
