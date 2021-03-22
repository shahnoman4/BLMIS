<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use App\Traits\TwoFactorAuth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */
    
    use AuthenticatesUsers;
    use TwoFactorAuth;
    
    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';
    protected $user;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(['guest', 'activeUser'])->except('logout');
    }

    protected function validateLogin(Request $request)
    {
        $request->validate([
            $this->username() => 'required|string',
            'password' => 'required|string',
            'gr_token' => config('auth.G_CAPTCHA') === 'ON' ? 'required|grecaptcha' : '',
        ], [
            'gr_token.required' => 'Please click "I\'m not a robot" checkbox.'
        ]);
    }
    
    public function username()
    {
        $userName = request()->input('user_name');
        $fieldType = filter_var($userName, FILTER_VALIDATE_EMAIL) ? 'email' : 'user_name';
        request()->merge([$fieldType => $userName]);
        
        return $fieldType;
    }

    protected function sendLoginResponse(Request $request)
    {
        $redirectTo = "/";
        $request->session()->regenerate();
        $this->clearLoginAttempts($request);
        \Auth::logoutOtherDevices($request->password);
        $this->storeRequestSignature($request);
        if (! $request->expectsJson()) {
            return redirect()->intended($this->redirectPath());
        }
        if (\Auth::guard()->check()) {
            $user = \Auth::user();
            $this->user = $user;
            
            if($user->isSuperAdmin() || $user->isStakeholder()){
                $redirectTo = "/admin";
                if(config('auth.TWO_FA') === 'ON'){
                    $this->create2FAToken();
                }
            }
            else if($user->isCompanyOwner() && $user->status_id === \App\Lookups\ApplicationStatus::NEW){
                $redirectTo = "/security"; // remind to create own password
            }
        }
        return \Response::json(["success" => true, "redirect" => $redirectTo]);
    }

    protected function sendFailedLoginResponse(Request $request)
    {
        throw ValidationException::withMessages([
            'user_name' => [trans('auth.failed')],
        ]);
    }
    
    public function logout(Request $request)
    {
        $redirectTo = "/login";
        if (\Auth::guard()->check() && \Auth::user()->isSuperAdmin()) {
            // $redirectTo = "/admin/login";
        }
        $this->guard()->logout();

        $request->session()->invalidate();

        if (! $request->expectsJson()) {
            return redirect($redirectTo);
        }
        return \Response::json(["success" => true, "redirect" => $redirectTo]);
    }

    protected function storeRequestSignature($request){
        $ip = $request->ip();
        $ua = $request->header('user-agent');
        $request->session()->put('last_ip', $ip);
        $request->session()->put('last_ua', $ua);
        $request->session()->put('last_host', gethostname());
    }
}
