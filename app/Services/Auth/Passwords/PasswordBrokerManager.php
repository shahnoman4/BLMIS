<?php
namespace App\Services\Auth\Passwords;

use Illuminate\Auth\Passwords\PasswordBrokerManager as BasePasswordBrokerManager;
use Illuminate\Support\Str;
use App\Repositories\Auth\Passwords\DatabaseTokenRepository;

class PasswordBrokerManager extends BasePasswordBrokerManager {

    protected function resolve($name) {
        $config = $this->getConfig($name);
        if (is_null($config)) {
            throw new InvalidArgumentException("Password resetter [{$name}] is not defined.");
        }
        return new PasswordBroker(
                $this->createTokenRepository($config), $this->app['auth']->createUserProvider($config['provider'])
        );
    }
    
    
    protected function createTokenRepository(array $config)
    {
        $key = $this->app['config']['app.key'];

        if (Str::startsWith($key, 'base64:')) {
            $key = base64_decode(substr($key, 7));
        }

        $connection = isset($config['connection']) ? $config['connection'] : null;

        return new DatabaseTokenRepository(
            $this->app['db']->connection($connection),
            $this->app['hash'],
            $config['table'],
            $key,
            $config['expire']
        );
    }

}
