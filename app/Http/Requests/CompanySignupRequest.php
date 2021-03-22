<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class CompanySignupRequest extends FormRequest
{


    private $data;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(Request $request)
    {
        $this->data = $this->all();
        $contactId = Arr::get($this->data, 'Contact.id');
        $companyId = Arr::get($this->data, 'Company.id');
       // $this->data['Contact']['office_email'] = md5($this->data['Contact']['office_email'];
        
        $rules = [
            'User.user_name' => 'bail|required|string|unique:user,user_name|max:255|alpha_dash',
            'User.email' => 'bail|required|email|business_email|unique:user,email|max:255',

            // 'User.user_name' => 'bail|required|string',
            // 'User.email' => 'bail|required|email',

            //'Company.name' => 'required|string|max:255',
            'Company.name'=> 'required|string|max:255|unique:organization,name' . ($companyId ? (','. $companyId .',id') : ''),
            'Company.was_permitted' => 'bail|required|numeric',
            'Company.sector_id' => 'required',
            'Company.permission_letter' => 'bail|required_if:Company.was_permitted,1|temp_file',

            'Contact.full_name'=> 'required|max:255|alpha_spaces',
            'Contact.office_phone'=> 'required|min:10|max:20|phone_number',
            //'Contact.office_fax'=> 'required|min:10|max:20|phone_number',
            'Contact.office_email'=> 'required|email|business_email|unique:contact,office_email' . ($contactId ? (','. $contactId .',id') : ''),
            'Contact.primary_email'=> 'required|email|business_email|unique:contact,primary_email' . ($contactId ? (','. $contactId .',id') : ''),
            'Contact.primary_phone'=> 'required|min:10|max:20|phone_number',
            // as per adnan sir optional this
            //'Contact.nic_no'=> 'required|max:20',
            //'Contact.nic_copy'=> 'required|temp_file',
            // as per adnan sir optional this
            'Contact.passport_no'=> 'required|max:20',
            'Contact.passport_copy'=> 'required|temp_file',

            'Contact.Location.address_line1'=> 'required|max:255',
            'Contact.Location.country'=> 'required|max:255',
            'Contact.Location.city'=> 'required',
            'Contact.Location.zip'=> 'required|max:20',

            'PO.full_name'=> 'required|max:255|alpha_spaces',
            'PO.dp'=> 'required|temp_file|temp_mimes:png,jpg,jpeg',
            'PO.cv'=> 'required|temp_file',
            'PO.cover_letter'=> 'required|temp_file',
            //'PO.nic_no'=> 'required|max:20',
            //'PO.nic_copy'=> 'required|temp_file',
           // 'PO.passport_no'=> 'required|max:20',
           // 'PO.passport_copy'=> 'required|temp_file',
            'G.gr_token' => config('auth.G_CAPTCHA') === 'ON' ? 'required|grecaptcha' : '',
        ];
        
        if(Arr::get($this->data, 'Directors')){
            $rules = array_merge($rules, [
                'Directors.*.full_name'=> 'required|max:255|alpha_spaces',
                'Directors.*.dp'=> 'required|temp_file|temp_mimes:png,jpg,jpeg',
                'Directors.*.cv'=> 'required|temp_file',
                'Directors.*.cover_letter'=> 'required|temp_file',
               // 'Directors.*.nic_no'=> 'required|max:20',
               // 'Directors.*.nic_copy'=> 'required|temp_file',
                //'Directors.*.passport_no'=> 'required|max:20',
               // 'Directors.*.passport_copy'=> 'required|temp_file',
            ]);
        }

        if(($request->is('*validate*') || $request->method() === "PUT")){
            //validate available sections only
            $temp = '1(*&65sdf&&90000"';
            foreach($rules as $key => $rule){
                $name = explode('.', $key)[0];

                if(Arr::get($this->data, $name, $temp) === $temp){
                    unset($rules[$key]);
                }
            }
        }
        
        return $rules;
    }

    public function messages(){
        return [
            'Contact.primary_phone.required'=> 'Contact number is required',
            'Directors.*.full_name.required'=> 'Director name is required',
            'Directors.*.passport_copy.required'=> 'Director passport is required',

            'User.user_name.alpha_dash' => 'Username only accept alpha-numeric, as well as dashes and underscores',
            'User.user_name.required' => 'Username is required',
            'User.user_name.unique' => 'Username already exists',
            'User.user_name.string' =>'Username can only be alpha-numeric(a-z,A-Z,0-9)',
            'User.email.required' => 'Email address is required',
            'User.email.business_email' => 'Only business email is acceptable',
            'User.email.unique' => 'Email address already exists',
            'User.*.max' => 'Maximum :max character limit reached',
            
            'Company.name.required' => 'Company name is required',
            'Company.name.string' => 'Company name can only be alpha-numeric(a-z,A-Z,0-9)',
            'Company.name.max' => 'Maximum :max character limit reached',
            
            'Company.was_permitted.required' => 'Please select Yes/No',
            'Company.was_permitted.numeric' => 'Invalid option selected',
            'Company.sector_id.required' => 'Please select company sector',
            // 'Company.permission_letter.required_if' => 'Please attach permission letter',

            'Contact.*.required'=> 'This field is required',
            'Contact.*.email'=> 'Please enter valid email',
            'Contact.*.max' => 'Maximum :max character limit reached',
            'Contact.*.*.max' => 'Maximum :max character limit reached',
            'Contact.*.min' => 'Minimum :min integers required',
            'Contact.*.phone_number' => 'Incorrect number format. Correct format is +420 000 000 000',
            'Contact.full_name.alpha_spaces' => 'Only A-Z,a-z and space allowed',
            'Contact.*.business_email' => 'Only business email is acceptable',
            
             //'Contact.office_email'
             'Contact.office_email.unique' => 'Email address already exists',
             'Contact.primary_email.unique' => 'Email address already exists',
            // 'Contact.full_name'=> 'required',
            // 'Contact.office_phone'=> 'required',
            // 'Contact.office_fax'=> 'required',
            // 'Contact.office_email'=> 'required',
            // 'Contact.primary_email'=> 'required|email',
            // 'Contact.primary_phone'=> 'required',
            // 'Contact.nic_no'=> 'required',
            // 'Contact.passport_no'=> 'required',
            // 'Contact.nic_copy'=> 'required',
            // 'Contact.passport_copy'=> 'required',

            // 'Contact.Location.address_line1'=> 'required',
            // 'Contact.Location.country'=> 'required',
            // 'Contact.Location.city'=> 'required',
            // 'Contact.Location.zip'=> 'required',

            'PO.*.required'=> 'This field is required',
            'PO.*.max' => 'Maximum :max character limit reached',
            'PO.full_name.alpha_spaces' => 'Only A-Z,a-z and space allowed',
            // 'PO.*.mimes' => 'Only :mimes photo allowed',
            
            'Directors.*.*.required' => 'This field is required',
            'Directors.*.*.max' => 'Maximum :max character limit {max} reached',
            'Directors.*.*full_name.alpha_spaces' => 'Only A-Z,a-z and space allowed',
            // 'Directors.*.*.mimes' => 'Only :mimes photo allowed',
            // 'PO.full_name'=> 'required',
            // 'PO.dp'=> 'required|temp_file',
            // 'PO.cv'=> 'required|temp_file',
            // 'PO.cover_letter'=> 'required|temp_file',
            // 'PO.nic_no'=> 'required',
            // 'PO.nic_copy'=> 'required|temp_file',
            // 'PO.passport_no'=> 'required',
            // 'PO.passport_copy'=> 'required|temp_file',
            'G.gr_token.required' => 'Please click "I\'m not a robot" checkbox.'
        ];
    }

    public function postProfileValidation($profile){
        $failed = false;
        if(Arr::get($this->data, 'Company.was_permitted') == 1){
            if(!$profile->permission_letter_id && !Arr::get($this->data, 'Company.permission_letter')){
                $failed = true;
                $this->validator->errors()->add('Company.permission_letter', 'Permission letter is required');
            }
        }
        if($failed){
            $this->failedValidation($this->validator);
        }
    }
}
