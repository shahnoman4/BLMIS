<?php
/**
 * 
 * 
 */


namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class LookupData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dump:lookup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch lookup data from db and define constants for them';

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
        $data = \DB::table('lookup')->get();
        $groups = [];
        foreach($data as $item){
            if(!isset($groups[$item->type])){
                $groups[$item->type] = [];
            }
            $groups[$item->type][] = $item;

        }
        $allContents = "<?php\nreturn\n[";
        foreach($groups as $type => $data){
            $className = \ucfirst(Str::camel($type));
            $allContents .= "\n'{$className}' => [\n";
            $listContent = "[\n";
            $contents = "<?php\n\n/**\n *\tThis lookup is generated based on lookup data in database using following command\n *\n *\tphp artisan dump:lookup\n *\n *\n */\n\n";
            $contents .= "namespace App\Lookups;\n\n";
            $contents .= "class {$className} extends BaseLookup{\n\n";
            foreach($data as $item){
                if($item->description){
                    $contents .= "\t/**\n\t * {$item->description}\n\t */\n";
                }
                $contents .= "\tconst ". Str::upper(Str::length($item->key) > 3 ? Str::snake($item->key) : $item->key) ." = {$item->id};\n";
                $allContents .= "\t'". Str::upper(Str::length($item->key) > 3 ? Str::snake($item->key) : $item->key) ."' => {$item->id},\n";
                if($item->description){
                    $contents .= "\n\n";
                }
                $listContent .= "\t\t['value' => {$item->id}, 'text' => '{$item->text}'],\n";
            }
            $listContent .= "\t]";
            $contents .= "\n\tconst DATA = " . $listContent . ";\n}";
            $allContents .= "\t'data' => {$listContent}";
            $allContents .= "\n],\n";

            $classFilePath = \app_path('Lookups/' . $className . '.php');
            file_put_contents($classFilePath, $contents);
        }
        $allContents .= "];";
        file_put_contents(\app_path('Lookups/all.php'), $allContents);

        $this->info("\n\nLookup files generated successfully in App\Lookups \n\n\n");
        exit(0);
    }
}
