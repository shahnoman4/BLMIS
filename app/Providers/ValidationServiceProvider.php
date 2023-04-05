<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Validator as CustomValidator;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class ValidationServiceProvider extends ServiceProvider {
    
    public function boot()
    {
        $this->app['validator']
             ->resolver(function($translator, $data, $rules, $messages)
        {
            return new CustomValidator(
                $translator, 
                $data, 
                $rules, 
                $messages
            );
        });

        Validator::extend('temp_file', function ($attribute, $value, $parameters, $validator) {
            return !$value || Storage::exists(Arr::get($value, "path")) || Storage::disk('uploads')->exists(Arr::get($value, "path"));
        });

        Validator::extend('temp_mimes', function ($attribute, $value, $parameters, $validator) {
            if(Storage::exists(Arr::get($value, "path")) || Storage::disk('uploads')->exists(Arr::get($value, "path"))){
                $mime = strtolower(\File::extension(Arr::get($value, "path")));
                return \in_array($mime, $parameters);
            }
            return true;
        });
        Validator::replacer('temp_mimes', function($message, $attribute, $rule, $parameters){
            return str_replace(':values', implode(', ', $parameters), $message);
        });

        Validator::extend('not_email', function ($attribute, $value, $parameters, $validator) {
            return !$value || !filter_var($value, FILTER_VALIDATE_EMAIL);
        });

        Validator::extend('strong_password', function ($attribute, $value, $parameters, $validator) {
            return !$value || preg_match('/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{'. (\Arr::get($parameters, '0', '6')) .',}$/', $value);
        });
        Validator::replacer('strong_password', function($message, $attribute, $rule, $parameters){
            return str_replace(':min_length', \Arr::get($parameters, '0', '6'), $message);
        });

        Validator::extend('business_email', function ($attribute, $value, $parameters, $validator) {
            return !$value || !in_array(preg_replace('/.+@/', '', $value), config('mail.domains.common'));
        });
        Validator::extend('phone_number', function($attribute, $value, $parameters, $validator){
            //return !$value || preg_match('/^\+?\d{3}\s?\d{3}\s?\d{3}\s?\d{3}$/', $value); 
            return !$value || preg_match('/^(\+?\d{3}\s?\d{3}\s?\d{4})|(\+?\d{3}\s?\d{3}\s?\d{3}\s?\d{3}\s?\d{3})$/', $value); 
        });
        Validator::extend('alpha_spaces', function ($attribute, $value, $parameters, $validator) {
            return !$value || preg_match('/^[\pL\s]+$/u', $value); 
        });
        Validator::extend('custom_para', function ($attribute, $value, $parameters, $validator) {
            return !$value || preg_match('/^[;-_,. a-zA-Z0-9\s\/\\\\#]+$/', $value); 
        });
        Validator::extend(
            'grecaptcha',
            'App\Validators\GReCaptcha@validate'
     );
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return [
            'validator',
        ];
    }
}