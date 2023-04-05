<?php


namespace App\Models;

class Location extends Model{
    
    protected $table = 'location';
    
    public $timestamps = false;

    protected $fillable = ['address_line1', 'city', 'state', 'zip', 'country', 'formatted_address'];

    protected $hidden = ['lat', 'lon', 'formatted_address'];
}
