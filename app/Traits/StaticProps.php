<?php

namespace App\Traits;

trait StaticProps{

    protected static $instances = [];

    public static function instance(){
        
        $class = get_called_class();
        if(!isset(static::$instances[$class])){
            static::$instances[$class] = new static;
        }
        return static::$instances[$class];
    }

    public static function table($alias = null){
        return static::instance()->getTable() . ($alias ? ' as ' . $alias : '');
    }
}