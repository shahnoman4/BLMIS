<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\TwoFactorAuth;
use Illuminate\Support\Carbon;

class TwoFAController extends Controller{
    use TwoFactorAuth;

    protected $user;

    public function showForm(){
        if(config('auth.TWO_FA') !== 'ON'){
            return redirect('/');
        }
        $this->user = \Auth::user();
        $record = $this->get2FAToken();
        if(!$record){
            return redirect('/');
        }
        $errors = session()->get('errors', app(\Illuminate\Support\ViewErrorBag::class))->getBag('default');
        if($record->attempts >= config('auth.TWO_FA_MAX_ATTEMPTS')){
            $errors->add('max_attempts', trans('auth.pin_attempts_exceeded'));
        }
        else if(Carbon::make($record->created_at) < Carbon::now()->subMinutes(config('auth.TWO_FA_PIN_LIFETIME'))){
            $errors->add('max_attempts', trans('auth.pin_expired'));
        }
        return view('auth/2fa-form', ['data' => $record])->withErrors($errors);
    }

    public function verifyPin(Request $request){
        if(config('auth.TWO_FA') !== 'ON'){
            return redirect('/');
        }
        $this->user = \Auth::user();
        $data = $this->validateRequest($request);

        $record = $this->get2FAToken();
        $errors = session()->get('errors', app(\Illuminate\Support\ViewErrorBag::class))->getBag('default');
        if(!$record){
            $errors->add('max_attempts', trans('auth.pin_expired'));
        }
        else{
            if($record->attempts >= config('auth.TWO_FA_MAX_ATTEMPTS')){
                $errors->add('max_attempts', trans('auth.pin_attempts_exceeded'));
            }
            else if(Carbon::make($record->created_at) < Carbon::now()->subMinutes(config('auth.TWO_FA_PIN_LIFETIME'))){
                $errors->add('max_attempts', trans('auth.pin_expired'));
            }
            if(!$errors->any()){
                $receivedEToken = $request->e_pin_digit_1.$request->e_pin_digit_2.$request->e_pin_digit_3.$request->e_pin_digit_4;
                if (\Hash::check($receivedEToken, $record->email_pin)) {
                    $this->save2FState(true);
                    $this->delete2FAToken();
                    return \redirect('/');
                }
                else{
                    $errors->add('pin', trans('auth.invalid_pin'));
                }
                $record->attempts += 1;
                $this->update2FAToken($record);
            }
        }
        return back()->withErrors($errors);
    }

    private function validateRequest($request){
        $request->validate([
            'e_pin_digit_1' => 'required|numeric',
            'e_pin_digit_2' => 'required|numeric',
            'e_pin_digit_3' => 'required|numeric',
            'e_pin_digit_4' => 'required|numeric',
        ], [
            '*.required' => 'Please enter 4 digit PIN.',
            '*.numeric' => 'PIN must be a number.',
        ]);
    }

    public function resendPin(){
        if(config('auth.TWO_FA') !== 'ON'){
            return redirect('/');
        }
        $this->user = \Auth::user();
        $this->create2FAToken();
        return redirect()->back();
    }
}