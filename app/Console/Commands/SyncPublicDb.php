<?php
/**
 * 
 * 
 */


namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use \App\Lookups\Authorization;

class SyncPublicDb extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'syncdb:public {--fresh}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Search for latest changes in admin database and sync them with public/company database.';

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
        $doFresh = strtolower($this->option('fresh'));
        /********************************************************************/
        $this->info("\nExtracting changes from admin/private database...\n");
        /********************************************************************/
        $lastSyncedAt = null;
        $syncStartDate = now();
        $publicDB = \DB::connection('public_mysql');
        $adminDB = \DB::connection('mysql');
        $now = now()->format('Y-m-d H:i:s');
        if(!$doFresh && Storage::disk('settings')->exists('synced-at.public')){
            $lastSyncedAt = Storage::disk('settings')->get('synced-at.public');
        }

        $totalRows = 0;

        $orgQuery = $adminDB->table('organization');
        if($lastSyncedAt){
            $orgQuery->where('updated_at', '>=', $lastSyncedAt);
        }
        $orgData = $orgQuery->get();
        $totalRows += $orgData->count();
        $this->info("\nOrganization(s)  {$orgData->count()}");

        $userQuery = $adminDB->table('user')->where('authorization_id', Authorization::SUPER_ADMIN);
        if($lastSyncedAt){
            $userQuery->where(function($userQuery) use($lastSyncedAt){
                $userQuery->where('created_at', '>=', $lastSyncedAt)->orWhere('updated_at', '>=', $lastSyncedAt);
            });
        }
        $userData = $userQuery->get();
        $totalRows += $userData->count();
        $this->info("\nUser(s)  {$userData->count()}");

        $branchQuery = $adminDB->table('branch');
        if($lastSyncedAt){
            $branchQuery->where('updated_at', '>=', $lastSyncedAt);
        }
        $branchData = $branchQuery->get();
        $totalRows += $branchData->count();
        $this->info("\nBranch(es)  {$branchData->count()}");

        $contractQuery = $adminDB->table('contract');
        if($lastSyncedAt){
            $contractQuery->where('updated_at', '>=', $lastSyncedAt);
        }
        $contractData = $contractQuery->get();
        $totalRows += $contractData->count();
        $this->info("\nContract(s) {$contractData->count()}");

        //new tables
        $site_configQuery = $adminDB->table('site_config');
        $site_configData = $site_configQuery->get();
        $totalRows += $site_configData->count();
        $this->info("\nSite Config(s)  {$site_configData->count()}");
        
        $slider_imagesQuery = $adminDB->table('slider_images');
        $slider_imagesData = $slider_imagesQuery->get();
        $totalRows += $slider_imagesData->count();
        $this->info("\nSlider(s)  {$slider_imagesData->count()}");
        //end new
        
        $logQuery = $adminDB->table('app_activity_log as log')->select('log.*');
        $logQuery->join('user', 'user.id', '=', 'log.user_id');
        $logQuery->where('user.authorization_id', Authorization::SUPER_ADMIN);
        if($lastSyncedAt){
            $logQuery->where('performed_at', '>=', $lastSyncedAt);
        }
        $logData = $logQuery->get();
        $totalRows += $logData->count();
        $this->info("\nLog(s)  {$logData->count()}");

        /********************************************************************/
        $this->info("\nTransforming data...\n");
        /********************************************************************/

        $orgSql = "";
        if(!$orgData->isEmpty()){
            $orgData->each(function($row) use(&$orgSql){
                $orgSql .= "UPDATE organization SET status_id = {$row->status_id}, updated_at='{$row->updated_at}', locked={$row->locked} WHERE id={$row->id} AND updated_at < '{$row->updated_at}';";
            });
        }
        
        $userSql = "";
        if(!$userData->isEmpty()){
            $userData->each(function($item){
                /**
                 * unset password and username of admin user in public database
                 * so that no one can login public server using admin credentials
                 */
                $item->password = null;
                $item->user_name = null;
            });
            $userSql = $this->buildQuery($userData, 'user');
        }

        $branchSql = "";
        if(!$branchData->isEmpty()){
            $branchData->each(function($row) use(&$branchSql){
                $branchSql .= "UPDATE branch SET status_id = {$row->status_id}, updated_at='{$row->updated_at}', locked={$row->locked} WHERE id={$row->id} AND updated_at < '{$row->updated_at}';";
            });
        }

        $contractSql = "";
        if(!$contractData->isEmpty()){
            $contractData->each(function($row) use(&$contractSql){
                $contractSql .= "UPDATE contract SET status_id=". ($row->status_id === null ? "null" : "{$row->status_id}") .", updated_at='{$row->updated_at}', shared_at=". ($row->shared_at === null ? "null" : "'{$row->shared_at}'") ." WHERE id={$row->id} AND updated_at < '{$row->updated_at}';";
            });
        }

        //new
        $site_configSql = "";
        if(!$site_configData->isEmpty()){
            $site_configSql = $this->buildQuery($site_configData, 'site_config');
        }

        $slider_imagesSql = "";
        if(!$slider_imagesData->isEmpty()){
            $slider_imagesSql = $this->buildQuery($slider_imagesData, 'slider_images');
        }
        //end new
        
        $logSql = "";
        if(!$logData->isEmpty()){
            $logSql = $this->buildQuery($logData, 'app_activity_log');
        }
        
        
        /********************************************************************/
        $this->info("Loading data into public/company database...\n");
        /********************************************************************/
        $publicDB->beginTransaction();
        try{
            if($orgSql){
                $publicDB->unprepared($orgSql);
            }
            
            if($userSql){
                $publicDB->unprepared($userSql);
            }
            
            if($branchSql){
                $publicDB->unprepared($branchSql);
            }
            
            if($contractSql){
                $publicDB->unprepared($contractSql);
            }

            //new
            if($site_configSql){
                $publicDB->unprepared($site_configSql);
            }

            if($slider_imagesSql){
                $publicDB->unprepared($slider_imagesSql);
            }
            //end new
            
            if($logSql){
                $publicDB->unprepared($logSql);
            }
            $publicDB->commit();

            Storage::disk('settings')->put('synced-at.public', $now);

            $this->info("\n" . $totalRows . " row(s) affected.\n");
        }
        catch(\Exception $e){
            $publicDB->rollback();
            $this->info("\nError in data transfer. Rolling back db transaction.\n");
            Storage::disk('settings')->put('sync-log-public-'. str_replace([':', '-'], '', $now) .'.log', $e->getMessage());
        }
        
        /********************************************************************/
        $this->info("Synchronization completed in ". (now()->diffInSeconds($syncStartDate)) ." second(s).\n");
        /********************************************************************/
        exit(0);
    }

    private function buildQuery($data, $table){
        $sql = "REPLACE INTO `{$table}` VALUES";
        $data->each(function($row) use (&$sql){
            $rowSql = "";
            foreach($row as $key => $val){
                if(gettype($val) == 'string'){
                    $rowSql .= "'". \str_replace("'", "\'", $val) ."',";
                }
                else{
                    $rowSql .= ($val === null ? 'null' : $val) . ",";
                }
            }
            $rowSql = substr($rowSql, 0, strlen($rowSql) - 1);
            $sql .= "(". $rowSql ."),";
        });
        $sql = substr($sql, 0, strlen($sql) - 1);

        return $sql;
    }
}
