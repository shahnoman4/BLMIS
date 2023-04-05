<?php

namespace App\Http\Middleware;

use Closure;

class IsStakeholderAdmin
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
        if (\Auth::guard($guard)->check() && \Auth::user()->isStakeholder()) {
            return $next($request);
        }
        if (! $request->expectsJson()) {
            return redirect('/');
        }
        throw new \Illuminate\Auth\AuthenticationException();
    }
}
