<?php
namespace App\Services\Auth;
use Illuminate\Auth\GuardHelpers;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Http\Request;
use  Illuminate\Auth\SessionGuard;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class BasicAuthGuard implements Guard
{
	use GuardHelpers;
	protected $name;
	protected $request;
	protected $provider;
	protected $config;
	public function __construct ($name, UserProvider $provider, Request $request, $configuration) {
		$this->name = $name;
		$this->provider = $provider;
		$this->request = $request;
		$this->config = $configuration;
	}

	public function user(){
		
	}


	public function onceBasic(){
		$credentials = $this->basicCredentials($this->request);
        //dd($credentials);
        if (! $this->validate($credentials)) {
            return $this->failedBasicResponse();
        }
	}

	protected function basicCredentials(Request $request)
    {
        return ['username' => strtolower($request->getUser()), 'password' => $request->getPassword()];
	}
	
	public function validate(array $creds = []){
		//dd($creds);
		return $this->provider->validateBasic($creds) && $this->provider->validateIp($this->request->ip());
	}

	protected function failedBasicResponse()
    {
		if ($this->request->expectsJson()) {
            return \Response::json(["success"=> false, "message" => 'Invalid credentials.'], 401);
        }
        throw new UnauthorizedHttpException('Basic', 'Invalid credentials.');
    }
}