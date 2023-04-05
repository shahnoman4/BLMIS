<?php

namespace App\Http\Middleware;

use Closure;
use App\Lookups\ApplicationStatus;
use App\Lookups\ProfileStatus;
use App\Exceptions\AuthenticationException;

class IsActiveUser
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
        $response = $next($request);
        if (\Auth::guard($guard)->check()) {
            $user = \Auth::user();
            if($user->status_id == ProfileStatus::BLOCKED){
                $this->logout($request, 'Your account is blocked.');
            }
            if($user->isCompanyOwner()){
                if($user->company->status_id == ApplicationStatus::REJECTED){
                    $this->logout($request, 'Your application for signup has been rejected.');
                }
            }
        }
        return $response;
    }

    protected function logout($request, $message)
    {
        $request->session()->regenerate();
        auth()->logout();
        $request->session()->flush();
        throw new AuthenticationException($message);
    }
}
