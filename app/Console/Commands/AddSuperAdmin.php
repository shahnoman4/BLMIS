<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AddSuperAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:super-admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Adds a super admin in database';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $data = [];
        $isValid = false;
        do{

            $data['user_name'] = $this->ask("Enter unique username (It will use to login)");
            $data['password'] = $this->ask("Enter password (A strong password is recommended)");
            $data['full_name'] = $this->ask("Enter full name");
            $data['email'] = $this->ask("Enter contact email address");
            $validator = validator($data, [
                'user_name' => 'bail|required|string|max:255|unique:user',
                'password' => 'required|string|strong_password:8',
                'full_name' => 'required',
                'email' => 'required|string|email|business_email|unique:user',
                // 'password' => 'required|string',
                // 'email' => 'required|string|email|unique:user',
            ]);
            
            $isValid = $validator->passes();
            if(!$isValid){
                $this->error("\n\n". implode($validator->messages()->all(), "\n") . "\n\n");
            }
        }
        while(!$isValid);
        $data = $validator->validated();
        $user = new \App\Models\User($data);
        $user->password = \Hash::make($data['password']);
        $user->authorization_id = \App\Lookups\Authorization::SUPER_ADMIN;
        $user->status_id = \App\Lookups\ProfileStatus::ACTIVE;
        $user->verified = 1;
        $user->verified_at = now();
        $user->save();

        $this->info("\n\nSuper admin user created successfully \n\n");
    }
}
