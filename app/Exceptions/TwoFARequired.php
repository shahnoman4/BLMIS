<?php
namespace App\Exceptions;

use Exception;

class TwoFARequired extends Exception
{
    
    public function render()
    {
        if(\Auth::user()->isCompanyOwner()){
            $returnUrl ='/2fa/verify';
        }
        $returnUrl = '/admin/2fa/verify';
        if (request()->expectsJson()) {
            return ['redirect' => $returnUrl];
        }
        return redirect($returnUrl);
    }
}