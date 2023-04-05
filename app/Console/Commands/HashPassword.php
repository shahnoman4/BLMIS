<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class HashPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'password:hash {plainPassword}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generates a hash for given plain password.';

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
        $this->info(\Hash::make($this->argument('plainPassword')));
    }
}
