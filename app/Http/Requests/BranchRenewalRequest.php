<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use App\Lookups\ServiceType;

class BranchRenewalRequest extends FormRequest
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
        $rules = [
            'service_type_id' => 'required|numeric|in:' . implode(',', [ServiceType::BRANCH, ServiceType::LIAISON]),
            'renewal_period' => 'required|numeric|min:1|max:5',
            'contract_duration' => 'required|numeric|min:1|max:5',
        ];

        $rules['realization_certificate'] = 'required|temp_file';
        $rules['scep_certificate'] = 'required|temp_file';
        //$rules['other_doc'] = 'required|temp_file';

        if(Arr::get($this->data, 'service_type_id') == ServiceType::BRANCH){
            $rules['contract_agreement'] = 'required|temp_file';
            $rules['tax_return'] = 'required|temp_file';
            $rules['financial_statement'] = 'required|temp_file';
            $rules['audit_report'] = 'required|temp_file';

        }        
        else if(Arr::get($this->data, 'service_type_id') == ServiceType::LIAISON){
            $rules['annual_report'] = 'required|temp_file';
            $rules['receipt'] = 'required|temp_file';
        }
        
        return $rules;
    }

    public function messages(){
        return [
        ];
    }
}
