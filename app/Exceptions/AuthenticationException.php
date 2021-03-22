<?php
namespace App\Exceptions;

use Exception;

class AuthenticationException extends Exception
{
    
    public function render($request)
    {
        $returnUrl = $request->is('admin*') ? '/admin/login' : '/login';
        if (request()->expectsJson()) {
            $errors = session()->get('errors', app(\Illuminate\Support\ViewErrorBag::class))->getBag('default');
            $errors->add('invlaid_session', $this->getMessage());
            $request->session()->flash('errors', $errors);
            return ['redirect' => $returnUrl];
        }
        return redirect($returnUrl)->withErrors(['invlaid_session' => $this->getMessage()]);
    }
}