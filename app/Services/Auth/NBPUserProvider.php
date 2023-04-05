<?php
namespace App\Services\Auth;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Support\Str;

class NBPUserProvider implements UserProvider
{
	public function retrieveById ($identifier) {
        
	}
	public function retrieveByToken ($identifier, $token) {
        
	}
	public function updateRememberToken (Authenticatable $user, $token) {
		// update via remember token not necessary
	}
	public function retrieveByCredentials (array $credentials) {
        
	}
	public function validateCredentials (Authenticatable $user, array $credentials) {
		return app('hash')->check($plain, $user->getAuthPassword());
	}
	public function validateBasic (array $creds) {
		if(!config('auth.nbp.on')){
			return true;
		}
		$nbpUsername = config('auth.nbp.username');
		$nbpPassword = config('auth.nbp.password');
		//dd($creds);
		dd($nbpPassword);
		//dd(app('hash')->check($creds['password'], $nbpPassword));
		return $creds['username'] === $nbpUsername && app('hash')->check($creds['password'], $nbpPassword);
	}
	public function validateIp ($ip) {
		if(!config('auth.nbp.on')){
			return true;
		}
        $nbpIps = config('auth.nbp.ip');
        return \in_array($ip, $nbpIps);
	}
}