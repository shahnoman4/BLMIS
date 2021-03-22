<?php


namespace App\Models;


class SliderImage extends Model{
    
    protected $table = 'slider_images';
    
    protected $fillable = [
        'title_1', 'title_2', 'uploads', 'status_id', 'user_id'
    ];
    
}
