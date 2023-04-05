<?php

namespace App\Http\Middleware;

use Closure;

class Is2FAuthorized
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
        if (config('auth.TWO_FA') === 'ON' && \Auth::guard($guard)->check()) {
            $user = \Auth::user();
            if(($user->isSuperAdmin() || $user->isStakeHolder()) && session()->get('2fa') !== $user->id){
                throw new \App\Exceptions\TwoFARequired();
            }
        }
        return $next($request);
    }
}
