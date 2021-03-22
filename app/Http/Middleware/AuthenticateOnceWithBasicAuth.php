<?php

namespace App\Http\Middleware;

class AuthenticateOnceWithBasicAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, $next, $guard = null)
    {
        return \Auth::guard($guard)->onceBasic() ?: $next($request);
    }

}