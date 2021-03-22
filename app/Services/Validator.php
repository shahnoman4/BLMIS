<?php

namespace App\Services;

use Illuminate\Support\Arr;

class MessageBag extends \Illuminate\Support\MessageBag{

    public function add($key, $message)
    {
        if ($this->isUnique($key, $message)) {
            $msgs = Arr::get($this->messages, $key, []);
            $msgs[] = $message;
            Arr::set($this->messages, $key, $msgs);
        }

        return $this;
    }
}

class Validator extends \Illuminate\Validation\Validator{
	

    /**
     * Determine if the data passes the validation rules.
     *
     * @return bool
     */
    public function passes()
    {
        $this->messages = new MessageBag;

        $this->distinctValues = [];

        // We'll spin through each rule, validating the attributes attached to that
        // rule. Any error messages will be added to the containers with each of
        // the other error messages, returning true if we don't have messages.
        foreach ($this->rules as $attribute => $rules) {
            $attribute = str_replace('\.', '->', $attribute);

            foreach ($rules as $rule) {
                $this->validateAttribute($attribute, $rule);

                if ($this->shouldStopValidating($attribute)) {
                    break;
                }
            }
        }

        // Here we will spin through all of the "after" hooks on this validator and
        // fire them off. This gives the callbacks a chance to perform all kinds
        // of other validation that needs to get wrapped up in this operation.
        foreach ($this->after as $after) {
            call_user_func($after);
        }

        return $this->messages->isEmpty();
    }
	
}