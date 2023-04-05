<?php

namespace App\Traits;

trait Trackable
{
    public static function bootTrackable()
    {
        static::created(function (\App\Models\Model $model) {
            info('Model Created', ["table" => $model->getTable(), "model" => $model->toArray()]);
        });

        static::updated(function ($model) {
            // bleh bleh
        });

        static::deleted(function ($model) {
            // bluh bluh
        });
    }
}