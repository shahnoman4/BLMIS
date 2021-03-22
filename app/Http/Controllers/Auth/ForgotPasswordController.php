<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller {
    /*
      |--------------------------------------------------------------------------
      | Password Reset Controller
      |--------------------------------------------------------------------------
      |
      | This controller is responsible for handling password reset emails and
      | includes a trait which assists in sending these notifications from
      | your application to your users. Feel free to explore this trait.
      |
     */

use SendsPasswordResetEmails;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('guest');
    }

    public function sendResetLinkEmail(Request $request) {
        $this->validate($request, ['user_name' => 'required'], ['user_name.required' => 'Please enter your user name.']);

        $response = $this->broker()->sendResetLink(
                $request->only('user_name')
        );
        if (! $request->expectsJson()) {
            if ($response === Password::RESET_LINK_SENT) {
                return back()->with('status', trans($response));
            }

            return back()->withErrors(
                ['user_name' => trans($response)]
            );
        }
        if ($response === Password::RESET_LINK_SENT) {
            return \Response::json(['success' => true, 'message' => trans($response)]);
        }

        return \Response::json(['errors' => ['user_name' => [trans($response)]]], 422);
    }

}
