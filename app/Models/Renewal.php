<?php


namespace App\Models;

use App\Lookups\MediaType;
use App\Lookups\ServiceType;

class Renewal extends Model{
    
    protected $table = 'branch_renewal';

    
    public $timestamps = false;
    
    protected $dates = [
        'renewed_at',
    ];

    protected $fillable = [
        'contract_duration', 'renewal_period',
    ];
    
    protected $hidden = [
         'attachments',
    ];

    
    public function payment(){
        return $this->morphOne(Payment::Class, 'entity')->latest('created_at');
    }

    
    public function branch(){
        return $this->hasOne(Branch::Class, 'id', 'branch_id');
    }

    // public function scopeAppendAll(){
    //     return $this->append(['secp_certificate','realization_certificate','annual_report']);
    // }

    public function attachments(){
        return $this->morphToMany(Media::class, 'entity', EntityMedia::table());
    }

    public function getRealizationCertificateAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::REALIZATION_CERTIFICATE;
            });
        }
    }

    public function getAnnualReportAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::ANNUAL_REPORT;
            });
        }
    }

    public function getReceiptAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::RECEIPT;
            });
        }
    }

    public function getScepCertificateAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::SECP_CERTIFICATE;
            });
        }
    }

    public function getContractAgreementAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::AGREEMENT_LETTER;
            });
        }
    }

    public function getTaxReturnAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::TAX_RETURN;
            });
        }
    }

    public function getFinancialStatementAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::FINANCIAL_STATEMENT;
            });
        }
    }

    public function getAuditReportAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::AUDIT_REPORT;
            });
        }
    }

    public function getOtherDocAttribute()
    {
        if($this->relationLoaded('attachments')){
            return $this->attachments->last(function($item){
                return $item->media_type == MediaType::ATTACHMENT;
            });
        }
    }

    public static function make($data, $branch){
        $model = new static($data);
        $model->branch_id = $branch->id;
        $model->renewed_at = now();
        $model->save();
        $media = [];
        foreach([
            ['realization_certificate', MediaType::REALIZATION_CERTIFICATE, 'realization-certificate'],
            ['annual_report', MediaType::ANNUAL_REPORT, 'last-year-report'],
            ['receipt', MediaType::RECEIPT, 'fee-receipt'],
            ['scep_certificate', MediaType::SECP_CERTIFICATE, 'scep-certificate'],
            ['other_doc', MediaType::ATTACHMENT, 'other-doc'],
            ['contract_agreement', MediaType::AGREEMENT_LETTER, 'contract-agreement'],
            ['tax_return', MediaType::TAX_RETURN, 'tax-return'],
            ['financial_statement', MediaType::FINANCIAL_STATEMENT, 'financial-statement'],
            ['audit_report', MediaType::AUDIT_REPORT, 'audit-report'],
        ] as $mediaType){
            $mediaData = \Arr::get($data, $mediaType[0]);
            if($mediaData && !\Arr::get($mediaData, 'id')){
                $media[] = [$mediaData,  $mediaType[1], $mediaType[2]];
            }
        }

        $mediaIds = [];

        foreach($media as $item){
            $item[] = '/renewal/' . $branch->id;
            $mediaId = $branch->company->generateUploadedMediaId(...$item);
            if($mediaId){
                $mediaIds[] = ['media_id' => $mediaId, 'entity_id' => $model->id, 'entity_type' => 'renewal'];
            }
        }

        if(count($mediaIds)){
            EntityMedia::insert($mediaIds);
        }

        return $model;

    }

    public function calculateFee($branch){
        if(\is_liaison($branch)){
            $appFeeConfig = config('payment.fee.liaison.renew');
        }
        else{
            $appFeeConfig = config('payment.fee.branch.renew');
        }
        $renewalPeriod = $this->renewal_period;
        $appFeeUSD = $appFeeConfig['application'];
        $addOnFeeUSD = $appFeeConfig['addOn'];
        $totalFeeUSD = $appFeeUSD + ($addOnFeeUSD * $renewalPeriod);
        $totlalFeePKR = usd_to_pkr($totalFeeUSD);
        return ['usd' => $totalFeeUSD, 'pkr' => $totlalFeePKR];
    }


    public function getAllAttachments(){
        $res = collect();
        
        if($this->attachments){
            $this->attachments->each(function($media, $idx) use($res){
                $media->as = ($idx + 1) .'-'. $media->filename;
                $res->push($media);
            });
        }

        return $res;
    }
}
