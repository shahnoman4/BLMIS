<?php

namespace App\Lookups;

class BaseLookup{
    public static function get($name){
        $allData = [];
        $data;
        $name = \preg_replace('/\s/', '', $name);
        $names = explode(',', \preg_replace('/\s/', '', $name));
        foreach($names as $name){
            $allData[$name] = static::_get($name);
        }

        return $allData;
    }
    private static function _get($name){
        // return $name::DATA;
        switch(\strtolower($name)){
            case 'sector': return Sector::DATA;
            case 'country': return Country::DATA;
            case 'city': return City::DATA;
            case 'NoOfEmployee': return NoOfEmployee::DATA;
        }
        return null;
    }
    public static function getAll(){
        return static::get('sector, country, city','NoOfEmployee');
    }
}