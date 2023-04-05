<?php

namespace App\Validators;

use GuzzleHttp\Client;

class GReCaptcha
{
    public function validate($attribute, $value, $parameters, $validator){
        $client = new Client();
    
        $response = $client->post(
            'https://www.google.com/recaptcha/api/siteverify',
            ['form_params'=>
                [
                    'secret'=>config('auth.G_CAPTCHA_SECRET'),
                    'response'=>$value
                 ]
            ]
        );
    
        $body = json_decode((string)$response->getBody());
        return $body->success;
    }

}