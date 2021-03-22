<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ImportSql extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:sql {sqlFile}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Imports sql file';

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
        $path = $this->argument('sqlFile');

        \DB::unprepared( file_get_contents( $path ) );
    }
}
