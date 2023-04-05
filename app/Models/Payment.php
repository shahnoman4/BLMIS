<?php


namespace App\Models;

use App\Lookups\MediaType;
use Illuminate\Support\Carbon;

class Payment extends Model{
    
    protected $table = 'payment';
    
    protected $dates = [
        'pp_replied_at',
    ];

    public function getPkrAmountAttribute(){
        return number_format(($this->usd_amount - $this->usd_discount) * $this->pkr_rate, 2, '.', '');
    }

    public function entity(){
        return $this->morphTo();
    }
    
    public function prepareJazzRequestData(){
        $now = now();
        $now->tz = "Asia/karachi";
        $data = [
            'pp_MerchantID' => config('auth.JAZZ_MERCHANT_ID'),
            'pp_Password' => config('auth.JAZZ_PASSWORD'),
            'pp_ReturnURL' => url('/callback/jazz'),
            'pp_Version' => '1.1',
            'pp_TxnType' => '',
            'pp_Language' => 'EN',
            'pp_SubMerchantID' => '',
            'pp_TxnRefNo' => "TXN". $now->format('YmdHis'),
            'pp_Amount' => $this->pkr_amount * 100,
            'pp_TxnCurrency' => 'PKR',
            'pp_TxnDateTime' => $now->format('YmdHis'),
            'pp_TxnExpiryDateTime' => $now->addDays(8)->format('YmdHis'),
            'pp_BillReference' => $this->uid,
            'pp_Description' => 'Thank you for using JazzCash',
            'pp_DiscountedAmount' => '',
            'pp_DiscountBank' => '',
            'pp_SecureHash' => '',
            'ppmpf_1' => '',
            'ppmpf_2' => '',
            'ppmpf_3' => '',
            'ppmpf_4' => '',
            'ppmpf_5' => '',
        ];

        $data['pp_SecureHash'] = static::generateSecureHashFromJazzData($data);
        return $data;
    }

    public static function generateSecureHashFromJazzData($data){
        $hashKey = config('auth.JAZZ_HASH');
        ksort($data);
        \Arr::forget($data, 'pp_SecureHash');
        $sortedArray = $hashKey;
        
        // $tempKeys = [];

        foreach($data as $key => $val){
            if(!empty($val) && $val != 'undefined'){
                $sortedArray .="&".$val;
                // $tempKeys[$key] =  $val;
            }	
        }

        // \dump($tempKeys);

        $securehash = hash_hmac('sha256', $sortedArray, $hashKey); 

        return $securehash;
    }

    public function parseJazzResponse(array $jazzResponse){
        $resp = [];
        $responseCode = \Arr::get($jazzResponse, 'pp_ResponseCode');
        $amountPaid = \Arr::get($jazzResponse, 'pp_Amount');
        $responseHash = \Arr::get($jazzResponse, 'pp_SecureHash');
        $generatedHash = static::generateSecureHashFromJazzData($jazzResponse);
        // dump(strtolower($generatedHash));
        // dd(strtolower($responseHash));
        if(strtolower($generatedHash) == strtolower($responseHash)){
            if($amountPaid == $this->pkr_amount * 100){
                $resp['success'] = in_array($responseCode, ['000', '121', '200']);
                $resp['message'] = \Arr::get($jazzResponse, 'pp_ResponseMessage');
            }
            else{
                // \dump('Amount requested: PKR ' . $this->pkr_amount);
                // \dump('Amount paid: PKR ' . ($amountPaid / 100) . (' (amount was altered using developer console of browser or network request)'));
                $resp['success'] = false;
                // $resp['message'] = 'Jazz marked the transaction successfull but the amount paid is not same as amount requested.';
                $resp['message'] = 'We detected a suspicious activity during this transaction. We could not proccess your request.';
            }
        }
        else if(!$responseHash){
            $resp['success'] = false;
            $resp['message'] = 'We could not verify this transaction as payment vendor did not return complete information. Please contact system administrator to look in to the matter. Your reference id is ' . $this->uid . '.';
        }
		else{
			$resp['success'] = false;
            $resp['message'] = 'We could not verify this transaction as information returned by payment vendor does not match our records. Please contact system administrator to look in to the matter. Your reference id is ' . $this->uid . '.';
		}
        return $resp;
    }

    public function manualChallanCopy(){
        return $this->morphOne(EntityMedia::class, 'entity')->join(Media::table(), function($join){
            $join->on('media.id', '=', 'entity_media.media_id');
        })->select('media.*');
    }

}
