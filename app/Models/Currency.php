<?php


namespace App\Models;

class Currency extends Model{
    
    protected $table = 'currency';

    protected $fillable = [
        'rate', 'Timestamp','ip',
    ];

}
