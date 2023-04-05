<?php

namespace App\Http\Middleware;

use Closure;
use App\Exceptions\AuthenticationException;

class AuthenticateSession
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        if (!$request->user() || !$request->session()) {
            return $next($request);
        }
        $ip = $request->ip();
        $ua = $request->header('user-agent');
        $host = gethostname();

        
        if($request->session()->get('last_ip') !== $ip){
            $this->logout($request, trans('auth.ip'));
        }
        
        if($request->session()->get('last_ua') !== $ua){
            $this->logout($request, trans('auth.ua'));
        }

        if($request->session()->get('last_host') !== $host){
            $this->logout($request, trans('auth.host'));
        }

        return $next($request);
    }

    protected function logout($request, $message)
    {
        $request->session()->regenerate();
        auth()->logout();
        $request->session()->flush();
        throw new AuthenticationException($message);
    }
}
