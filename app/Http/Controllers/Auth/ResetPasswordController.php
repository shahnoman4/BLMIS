<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Support\Facades\Password;

class ResetPasswordController extends Controller {
    /*
      |--------------------------------------------------------------------------
      | Password Reset Controller
      |--------------------------------------------------------------------------
      |
      | This controller is responsible for handling password reset requests
      | and uses a simple trait to include this behavior. You're free to
      | explore this trait and override any methods you wish to tweak.
      |
     */

use ResetsPasswords;

    /**
     * Where to redirect users after resetting their password.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
       
        $this->middleware('guest');
    }

    public function showResetForm(Request $request, $token = null) {
        return view('auth.passwords.reset')->with(
            ['token' => $token, 'user_name' => $request->user_name]
        );
    }

    protected function rules() {
        return [
            'token' => 'required',
            'user_name' => 'required',
            'password' => 'bail|required|strong_password:8|confirmed',
        ];
    }

    protected function credentials(Request $request) {
        return $request->only(
            'user_name', 'password', 'password_confirmation', 'token'
        );
    }

    protected function sendResetFailedResponse(Request $request, $response) {
        $errors = [];
        if ($response === Password::INVALID_TOKEN) {
            $errors['token'] = trans($response);
        }
        else if ($response === Password::INVALID_PASSWORD) {
            $errors['password'] = trans($response);
        }
        else{
            $errors['user_name'] = trans($response);
        }
        return redirect()->back()
            ->withInput($request->only('user_name', 'password'))
            ->withErrors($errors);
    }

}
