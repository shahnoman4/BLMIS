<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use \App\Lookups\Authorization;

class SyncPrivateDb extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'syncdb:private {--fresh}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Search for latest changes in public/company database and sync them with admin database.';

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
        $this->info("\nExtracting changes from company/public database...\n");
        /********************************************************************/
        $lastSyncedAt = null;
        $syncStartDate = now();
        $publicDB = \DB::connection('public_mysql');
        $adminDB = \DB::connection('mysql');
        $now = now()->format('Y-m-d H:i:s');
        if(!$doFresh && Storage::disk('settings')->exists('synced-at.private')){
            $lastSyncedAt = Storage::disk('settings')->get('synced-at.private');
        }

        $totalRows = 0;

        $orgQuery = $publicDB->table('organization');
        if($lastSyncedAt){
            $orgQuery->where('subscribed_at', '>=', $lastSyncedAt)->orWhere('updated_at', '>=', $lastSyncedAt);
        }
        $orgData = $orgQuery->get();
        $totalRows += $orgData->count();
        $this->info("\nOrganization(s)  {$orgData->count()}");
        
        $userQuery = $publicDB->table('user')->where('authorization_id', Authorization::ORG_ADMIN);
        if($lastSyncedAt){
            $userQuery->where(function($userQuery) use($lastSyncedAt){
                $userQuery->where('created_at', '>=', $lastSyncedAt)->orWhere('updated_at', '>=', $lastSyncedAt);
            });
        }
        $userData = $userQuery->get();
        $totalRows += $userData->count();
        $this->info("\nUser(s)  {$userData->count()}");
        
        $locationQuery = $publicDB->table('location');
        $locationData = $locationQuery->get();
        $totalRows += $locationData->count();
        $this->info("\nLocation(s)  {$locationData->count()}");
        //new tables
        $site_configQuery = $publicDB->table('site_config');
        $site_configData = $site_configQuery->get();
        $totalRows += $site_configData->count();
        $this->info("\nSite Config(s)  {$site_configData->count()}");
        
        $slider_imagesQuery = $publicDB->table('slider_images');
        $slider_imagesData = $slider_imagesQuery->get();
        $totalRows += $slider_imagesData->count();
        $this->info("\nSlider(s)  {$slider_imagesData->count()}");

        $currencyQuery = $publicDB->table('currency');
        $currencyData = $currencyQuery->get();
        $totalRows += $currencyData->count();
        $this->info("\nCurrency(s)  {$currencyData->count()}");
        //end new
        
        $contactQuery = $publicDB->table('contact');
        if($lastSyncedAt){
            $contactQuery->where('created_at', '>=', $lastSyncedAt)->orWhere('updated_at', '>=', $lastSyncedAt);
        }
        $contactData = $contactQuery->get();
        $totalRows += $contactData->count();
        $this->info("\nContact(s)  {$contactData->count()}");
        
        $mediaQuery = $publicDB->table('media');
        if($lastSyncedAt){
            $mediaQuery->where('uploaded_at', '>=', $lastSyncedAt);
        }
        $mediaData = $mediaQuery->get();
        $totalRows += $mediaData->count();
        $this->info("\nMedia {$mediaData->count()}");
        
        if(!$mediaData->isEmpty()){
            $entityMediaQuery = $publicDB->table('entity_media');
            $entityMediaQuery->whereIn('media_id', $mediaData->pluck('id'));
            $entityMediaData = $entityMediaQuery->get();
            $totalRows += $entityMediaData->count();
            $this->info("\nEntity Media  {$entityMediaData->count()}");
        }
        
        $branchQuery = $publicDB->table('branch');
        if($lastSyncedAt){
            $branchQuery->where('created_at', '>=', $lastSyncedAt)->orWhere('updated_at', '>=', $lastSyncedAt);
        }
        $branchData = $branchQuery->get();
        $totalRows += $branchData->count();
        $this->info("\nBranch(es)  {$branchData->count()}");
        
        $branchRenewalQuery = $publicDB->table('branch_renewal');
        if($lastSyncedAt){
            $branchRenewalQuery->where('renewed_at', '>=', $lastSyncedAt);
        }
        $branchRenewalData = $branchRenewalQuery->get();
        $totalRows += $branchRenewalData->count();
        $this->info("\nBranch Renewal(s)  {$branchRenewalData->count()}");
        
        $contractQuery = $publicDB->table('contract');
        if($lastSyncedAt){
            $contractQuery->where('created_at', '>=', $lastSyncedAt)->orWhere('updated_at', '>=', $lastSyncedAt);
        }
        $contractData = $contractQuery->get();
        $totalRows += $contractData->count();
        $this->info("\nContract(s) {$contractData->count()}");
        
        $investmentQuery = $publicDB->table('investment');
        $investmentData = $investmentQuery->get();
        $totalRows += $investmentData->count();
        $this->info("\nInvestment(s)  {$investmentData->count()}");
        
        $securityAgencyQuery = $publicDB->table('security_agency');
        $securityAgencytData = $securityAgencyQuery->get();
        $totalRows += $securityAgencytData->count();
        $this->info("\nSecurity Agenc(ies)  {$securityAgencytData->count()}");
        
        $logQuery = $publicDB->table('app_activity_log');
        if($lastSyncedAt){
            $logQuery->where('performed_at', '>=', $lastSyncedAt);
        }
        $logData = $logQuery->get();
        $totalRows += $logData->count();
        $this->info("\nLog(s)  {$logData->count()}");
        
        if(!$logData->isEmpty()){
            $branchCircularQuery = $publicDB->table('app_circular');
            $branchCircularQuery->whereIn('activity_id', $logData->pluck('id'));
            $branchCircularData = $branchCircularQuery->get();
            $totalRows += $branchCircularData->count();
            $this->info("\nBranch Circular(s)  {$branchCircularData->count()}");
        }
        
        /********************************************************************/
        $this->info("\nTransforming data...\n");
        /********************************************************************/
        $orgSql = "";
        if(!$orgData->isEmpty()){
            $orgSql = $this->buildQuery($orgData, 'organization');
        }
        
        $userSql = "";
        if(!$userData->isEmpty()){
            $userData->each(function($item){
                /**
                 * unset password and username of public user in admin database
                 * so that no one can login private server using public credentials
                 */
                $item->password = null;
                $item->user_name = null;
            });
            $userSql = $this->buildQuery($userData, 'user');
        }

        $locationSql = "";
        if(!$locationData->isEmpty()){
            $locationSql = $this->buildQuery($locationData, 'location');
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

        $currencySql = "";
        if(!$currencyData->isEmpty()){
            $currencySql = $this->buildQuery($currencyData, 'currency');
        }
        //end new
        $contactSql = "";
        if(!$contactData->isEmpty()){
            $contactSql = $this->buildQuery($contactData, 'contact');
        }

        $mediaSql = "";
        $entityMediaSql = "";
        if(!$mediaData->isEmpty()){
            $mediaSql = $this->buildQuery($mediaData, 'media');
            if(!$entityMediaData->isEmpty()){
                $entityMediaSql = $this->buildQuery($entityMediaData, 'entity_media');
            }
        }
        
        $branchSql = "";
        if(!$branchData->isEmpty()){
            $branchSql = $this->buildQuery($branchData, 'branch');
        }
        
        $branchRenewalSql = "";
        if(!$branchRenewalData->isEmpty()){
            $branchRenewalSql = $this->buildQuery($branchRenewalData, 'branch_renewal');
        }
        
        $contractSql = "";
        if(!$contractData->isEmpty()){
            $contractSql = $this->buildQuery($contractData, 'contract');
        }
        
        $investmentSql = "";
        if(!$investmentData->isEmpty()){
            $investmentSql = $this->buildQuery($investmentData, 'investment');
        }
        
        $securityAgencySql = "";
        if(!$securityAgencytData->isEmpty()){
            $securityAgencySql = $this->buildQuery($securityAgencytData, 'security_agency');
        }

        $logSql = "";
        $branchCircularSql = "";
        if(!$logData->isEmpty()){
            $logSql = $this->buildQuery($logData, 'app_activity_log');
            if(!$branchCircularData->isEmpty()){
                $branchCircularSql = $this->buildQuery($branchCircularData, 'app_circular');
            }
        }
        
        /********************************************************************/
        $this->info("Loading data into admin/private database...\n");
        /********************************************************************/
        $adminDB->beginTransaction();
        try{
            if($orgSql){
                $adminDB->unprepared($orgSql);
            }
            
            if($userSql){
                $adminDB->unprepared($userSql);
            }
            
            if($locationSql){
                $adminDB->unprepared($locationSql);
            }
            //new
            if($site_configSql){
                $adminDB->unprepared($site_configSql);
            }

            if($slider_imagesSql){
                $adminDB->unprepared($slider_imagesSql);
            }

            if($currencySql){
                $adminDB->unprepared($currencySql);
            }
            //end new
            if($contactSql){
                $adminDB->unprepared($contactSql);
            }
            
            if($mediaSql){
                $adminDB->unprepared($mediaSql);
            }
            
            if($entityMediaSql){
                if($doFresh){
                    $adminDB->table('entity_media')->truncate();    
                }
                $adminDB->unprepared($entityMediaSql);
            }
            
            if($branchSql){
                $adminDB->unprepared($branchSql);
            }
            
            if($branchRenewalSql){
                $adminDB->unprepared($branchRenewalSql);
            }
            
            if($contractSql){
                $adminDB->unprepared($contractSql);
            }
            
            if($investmentSql){
                $adminDB->unprepared($investmentSql);
            }
            
            if($securityAgencySql){
                $adminDB->unprepared($securityAgencySql);
            }
            
            if($logSql){
                $adminDB->unprepared($logSql);
            }
            
            if($branchCircularSql){
                $adminDB->unprepared($branchCircularSql);
            }
            $adminDB->commit();

            Storage::disk('settings')->put('synced-at.private', $now);
    
            $this->info("\n" . $totalRows . " row(s) affected.\n");
        }
        catch(\Exception $e){
            $adminDB->rollback();
            $this->info("\nError in data transfer. Rolling back db transaction.\n");
            Storage::disk('settings')->put('sync-log-private-'. str_replace([':', '-'], '', $now) .'.log', $e->getMessage());
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
                    $rep = ["/", "'"];
                    $repWith   = ["", "",];
                   
                    $rowSql .= "'". \str_replace($rep, $repWith, $val) ."',";
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
