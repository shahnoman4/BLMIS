<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
class BranchApplicationRequest extends FormRequest
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
         //dd($this->data['step']);
        $contractRules = [
            //now
            'Contract.title' => 'required|alpha_spaces',
           // 'Contract.agreement_letter' => 'required|temp_file',
            'Contract.start_date' => 'required|date_format:Y-m-d',
            //end now
            'Contract.start_page' => 'required|alpha_num|max:8',
            'Contract.start_clause' => 'required|alpha_num|max:8',
            //now
            'Contract.valid_for_years' => 'required|date_format:Y-m-d',
            //end now
            'Contract.end_page' => 'required|alpha_num|max:8',
            'Contract.end_clause' => 'required|alpha_num|max:8',
            //'Contract.defect_start_month' => 'required',
            //'Contract.defect_start_month' => 'required_with:Contract.defect_start_year',
            //'Contract.defect_start_year' => 'required_with:Contract.defect_start_month',
            //'Contract.defect_end_month' => 'required',
            //'Contract.defect_end_month' => 'required_with:Contract.defect_end_year',
           // 'Contract.defect_end_year' => 'required_with:Contract.defect_end_month',
            'Contract.project_cost' => 'required|numeric|digits_between:1,32',
            
            'PartnerCompanies.*.full_name'=> 'required|alpha_spaces',
            'PartnerCompanies.*.lease_agreement' => 'required|temp_file',

            'PartnerCompanies.*.Location.address_line1'=> 'required',
            'PartnerCompanies.*.Location.country'=> 'required',
            'PartnerCompanies.*.Location.city'=> 'required',
            'PartnerCompanies.*.Location.zip'=> 'required|alpha_num|max:32',
            'PartnerCompanies.*.office_phone'=> 'min:10|max:20|phone_number',
            //'PartnerCompanies.*.office_fax'=> 'min:10|max:20|phone_number',
            'PartnerCompanies.*.office_email'=> 'required|email|business_email',
            //'PartnerCompanies.*.secp_certificate' => 'required|temp_file',

            'PartnerCompanies.*.Contact.full_name'=> 'required|alpha_spaces',
            'PartnerCompanies.*.Contact.primary_email'=> 'required|email|business_email',
            'PartnerCompanies.*.Contact.primary_phone'=> 'required|min:12|max:20|phone_number',
            //'PartnerCompanies.*.Contact.nic_no'=> 'alpha_dash|max:32',
            //'PartnerCompanies.*.Contact.nic_copy'=> 'temp_file',
        ];

        if($this->isRenew){
            $rules = [
                'Branch.service_type_id' => 'required|numeric',
                'Branch.original_country' => 'required',
                'Branch.primary_info' => 'required',
                'Branch.other_org_info' => 'required',
                'Branch.other_country_info' => 'required',
                //'Branch.current_country' => 'required',
                //'Branch.current_city' => 'required',
                'Branch.desired_location' => 'required',
                'Branch.desired_places' => 'required',
                'Branch.business_info' => 'required',
                'Branch.project_info' => 'required',
                //'Branch.personnel_info' => 'required|custom_para',
                'Branch.repatriation_info' => 'required',
                'Branch.local_associate_info' => 'required',
                // 'Branch.start_month' => 'required|numeric',
                // 'Branch.start_year' => 'required|numeric',
                //'Branch.permission_period' => 'required|numeric',
                'Branch.background_info' => 'required',
                'Branch.purpose_info' => 'required',
                
                // 'LocalContact.Location.address_line1'=> 'required|custom_para|max:255',
                // 'LocalContact.office_phone'=> 'required|min:10|max:20|phone_number',
                // 'LocalContact.mobile_phone'=> 'required|min:10|max:20|phone_number',
                // //'LocalContact.office_fax'=> 'required|min:10|max:20|phone_number',
                // 'LocalContact.office_email'=> 'required|email|max:255|business_email',
                // 'LocalContact.full_name'=> 'required||max:255|alpha_spaces',
                // 'LocalContact.primary_phone'=> 'required|min:10|max:20|phone_number',
                
                // 'LocalSponsor.Location.address_line1'=> 'required|custom_para|max:255',
                // 'LocalSponsor.Location.city'=> 'required',
                // 'LocalSponsor.office_phone'=> 'required|min:10|max:20|phone_number',
                // 'LocalSponsor.mobile_phone'=> 'required|min:10|max:20|phone_number',
                // //'LocalSponsor.office_fax'=> 'required|min:10|max:20|phone_number',
                // 'LocalSponsor.office_email'=> 'required|email|max:255|business_email',
                
                'Company.registration_letter' => 'required|temp_file',
                'Company.memorandum_article' => 'required|temp_file',
                'Company.article_association' => 'required|temp_file',
                'Company.authority_letter' => 'required|temp_file',
                'Company.org_profile' => 'required|temp_file',
                
                /*'Agent.full_name'=> 'max:255|alpha_spaces',
                'Agent.contact_category_id'=> 'numeric',
                'Agent.mobile_phone'=> 'min:10|max:20|phone_number',
                'Agent.primary_email'=> 'email|max:255|business_email',
                'Agent.Location.address_line1'=> 'custom_para|max:255',
                'Agent.Location.country'=> '',
                'Agent.Location.city'=> '',
                */
                'Investment.proposal_info' => 'required',
                'Investment.annual_expenses' => 'required|numeric|digits_between:1,32',
                'Investment.expenses_copy' => 'temp_file',
                //'Investment.investment_info' => 'custom_para|max:255',
                //'Investment.pk_bank' => 'required|max:255|alpha_spaces',
                'Investment.designated_person' => 'required|alpha_spaces',
                //'Investment.comments' => 'custom_para|max:255',
                
                'SecurityAgency.security_required' => 'required|numeric',

            ];
        }else{
            $rules = [
                'Branch.service_type_id' => 'required|numeric',
                'Branch.original_country' => 'required',
                'Branch.primary_info' => 'required',
                'Branch.other_org_info' => 'required',
                'Branch.other_country_info' => 'required',
                //'Branch.current_country' => 'required',
               // 'Branch.current_city' => 'required',
                'Branch.desired_location' => 'required',
                'Branch.desired_places' => 'required',
                'Branch.business_info' => 'required',
                'Branch.project_info' => 'required',
                // 'Branch.personnel_info' => 'required',
                'Branch.repatriation_info' => 'required',
                'Branch.local_associate_info' => 'required',
                //'Branch.start_month' => 'required|numeric',
            // 'Branch.start_year' => 'required|numeric',
                //'Branch.permission_period' => 'required|numeric',
                'Branch.background_info' => 'required',
                'Branch.purpose_info' => 'required',
                
                // 'LocalContact.Location.address_line1'=> 'required|custom_para|max:255',
                // 'LocalContact.office_phone'=> 'required|min:10|max:20|phone_number',
                // 'LocalContact.mobile_phone'=> 'required|min:10|max:20|phone_number',
                // //'LocalContact.office_fax'=> 'required|min:10|max:20|phone_number',
                // 'LocalContact.office_email'=> 'required|email|max:255|business_email',
                // 'LocalContact.full_name'=> 'required||max:255|alpha_spaces',
                // 'LocalContact.primary_phone'=> 'required|min:10|max:20|phone_number',
                
                // 'LocalSponsor.Location.address_line1'=> 'required|custom_para|max:255',
                // 'LocalSponsor.Location.city'=> 'required',
                // 'LocalSponsor.office_phone'=> 'required|min:10|max:20|phone_number',
                // 'LocalSponsor.mobile_phone'=> 'required|min:10|max:20|phone_number',
                // //'LocalSponsor.office_fax'=> 'required|min:10|max:20|phone_number',
                // 'LocalSponsor.office_email'=> 'required|email|max:255|business_email',
                
                'Company.registration_letter' => 'required|temp_file',
                'Company.memorandum_article' => 'required|temp_file',
                'Company.article_association' => 'required|temp_file',
                'Company.authority_letter' => 'required|temp_file',
                'Company.org_profile' => 'required|temp_file',
                
               /* 'Agent.full_name'=> 'max:255|alpha_spaces',
                'Agent.contact_category_id'=> 'numeric',
                'Agent.mobile_phone'=> 'min:10|max:20|phone_number',
                'Agent.primary_email'=> 'email|max:255|business_email',
                'Agent.Location.address_line1'=> 'custom_para|max:255',
                'Agent.Location.country'=> '',
                'Agent.Location.city'=> '',
                */
                'Investment.proposal_info' => 'required',
                'Investment.annual_expenses' => 'required|numeric|digits_between:1,32',
                'Investment.expenses_copy' => 'temp_file',
               // 'Investment.investment_info' => 'custom_para|max:255',
               // 'Investment.pk_bank' => 'required|max:255|alpha_spaces',
                'Investment.designated_person' => 'required|max:255|alpha_spaces',
                //'Investment.comments' => 'custom_para|max:255',
                
                'SecurityAgency.security_required' => 'required|numeric',

            ];
        }

        if(isset($this->data['step']) && ($this->data['step']==3)){
            $step3 = $this->data['step'];
        } else{
            $step3 = '';
        } 

        if(isset($this->data['step']) && ($this->data['step']==4)){
            $step4 = $this->data['step'];
        } else{
            $step4 = '';
        }

        //UPDATE `user` SET `password` = '' WHERE `user`.`id` = '8fb9c133-bbc1-4d76-8da5-2cd524ef179e';


        if((Arr::get($this->data, 'SecurityAgency.security_required') == 1) && (($step3==3) || ($step4==4))){
            $rules = array_merge($rules, [
                'SecurityAgency.name' => 'required|alpha_spaces',
                'SecurityAgency.ntn' => 'required|alpha_num|max:32',
                'SecurityAgency.secp_certificate' => 'temp_file',
                'SecurityAgency.is_pk_based' => 'required|numeric',
                'SecurityAgency.has_foreign_consultant' => 'nullable|numeric',
                'SecurityAgency.is_extension' => 'nullable|numeric',
                'SecurityAgency.extension_info' => 'required_if:SecurityAgency.is_extension,1',
            
                'SecurityAgency.Contact.Location.address_line1'=> 'required',
                'SecurityAgency.Contact.Location.country'=> 'required',
                'SecurityAgency.Contact.Location.city'=> 'required',
                'SecurityAgency.Contact.Location.zip'=> 'alpha_num|max:32',
                'SecurityAgency.Contact.office_phone'=> 'required|min:10|max:20|phone_number',
                //'SecurityAgency.Contact.office_fax'=> 'min:10|max:20|phone_number',
                'SecurityAgency.Contact.office_email'=> 'required|email|business_email',
            ]);
        }

        if($request->is('*contract')){ // add contract
            $rules = $contractRules;
        }
        else{
            if(isset($this->data['Branch']['service_type_id'])  && ($this->data['Branch']['service_type_id'] == 1)){
               $rules = array_merge($rules, $contractRules);
            
            }
        }
        if(Arr::get($this->data, 'Payment')){
            $rules['Payment.challanNo'] = 'required';
            $rules['Payment.challanCopy'] = 'required|temp_file';
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
            '*.*.required'=> 'This field is required',
            '*.*.temp_file'=> 'Only pdf file under 10MB is acceptable',
            'PartnerCompanies.*.*.required'=> 'This field is required',
            'PartnerCompanies.*.*.temp_file'=> 'Only pdf file under 10MB is acceptable',
            '*.*.email'=> 'Please enter valid email address',
            'PartnerCompanies.*.*.email'=> 'Please enter valid email address',
            '*.*.business_email' => 'Only business email is acceptable',
            '*.*.numeric' => 'Invalid option selected',
            'Contract.project_cost.numeric' => 'Invalid cost amount added',
            'Investment.annual_expenses.numeric' => 'Invalid annum expenses amount added',

            'SecurityAgency.Contact.*.phone_number' => 'Incorrect number format. Correct format is +420 000 000 000',
            'PartnerCompanies.*.Contact.*.phone_number' => 'Incorrect number format. Correct format is +420 000 000 000',
            'PartnerCompanies.*.*.phone_number'=>'Incorrect number format. Correct format is +420 000 000 000',
            'Agent.*.phone_number'=>'Incorrect number format. Correct format is +420 000 000 000',
            'LocalSponsor.*.phone_number'=>'Incorrect number format. Correct format is +420 000 000 000',
            'LocalContact.*.phone_number'=>'Incorrect number format. Correct format is +420 000 000 000',

            'Contact.*.*.max' => 'Maximum :max character limit reached',
            'SecurityAgency.Contact.*.max'  => 'Maximum :max character limit reached', 
            'Investment.*.max' => 'Maximum :max character limit reached',
            'PartnerCompanies.*.*.*.max' => 'Maximum :max character limit reached',
            'PartnerCompanies.*.*.max' => 'Maximum :max character limit reached',
            'Contract.*.max' => 'Maximum :max character limit reached',
            'Agent.*.max' => 'Maximum :max character limit reached',
            'LocalSponsor.*.max' => 'Maximum :max character limit reached',
            'LocalContact.*.max' => 'Maximum :max character limit reached',
            'Branch.*.max' => 'Maximum :max character limit reached',
            '*.*.min' => 'Minimum :min characters required',
            '*.*.business_email' => 'Only business email is acceptable',
            '*.*.alpha_dash' => 'Only accepts alpha-numeric, as well as dashes and underscores',
            '*.*.alpha_spaces' => 'Only A-Z,a-z and space allowed',
            'Investment.annual_expenses.between' => 'Maximum 32 digits limit reached',
            'Contract.project_cost.between' => 'Maximum 32 digits limit reached', 
            'Contract.start_page.between' => 'Maximum 8 digits limit reached',
            'Contract.end_page.between' => 'Maximum 8 digits limit reached',
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
