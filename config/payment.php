<?php


/**
 * Fee schedule in USD
 */
$payments =    file_get_contents(storage_path('logs/currency-convertor.http.log'));
$payments = explode("\n",$payments);
$last = "";
do{
    $last = array_pop($payments);
    $last = trim($last);
    if($last){
    preg_match_all("/^(.+? .+? .+?) \: (.+)$/", $last, $matches);
    $lastArray = json_decode($matches[2][0], true);
    $lastRate = $lastArray['rate'];
    // $lastRate = $lastRates * 20;
    }
}while($last == "");


//
// foreach($payments as $pp){
    // preg_match_all("/^(.+? .+? .+?) \: (.+)$/", $pp, $matches);
    // dd($matches);
    // $p[$matches[1][0]] = json_decode($matches[2][0]);
// }

return [
    'fee' => [
        'signup' => 0,
        'branch' => [
            'new' => [
                'application' => 2000,
                'addOn' => 1000, //per year,
            ],
            'renew' => [
                'application' => 0,
                'addOn' => 1000, //per year,
            ],
        ],
        'sub_branch' => [
            'new' => [
                'application' => 1500,
                'addOn' => 0, //per year,
            ],
            'renew' => [
                'application' => 0,
                'addOn' => 0, //per year,
            ],
        ],
        'liaison' => [
            'new' => [
                'application' => 1500,
                'addOn' => 500, //per year,
            ],
            'renew' => [
                'application' => 0,
                'addOn' => 500, //per year,
            ],
        ],
        'sub_liaison' => [
            'new' => [
                'application' => 1000,
                'addOn' => 0, //per year,
            ],
            'renew' => [
                'application' => 0,
                'addOn' => 0, //per year,
            ],
        ],
    ],
    'rate' => [
        'usd' => $lastRate
    ]
];