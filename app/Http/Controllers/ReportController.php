<?php
namespace App\Http\Controllers;

use App\Models\BranchTopTenCountries;
use App\Models\BranchTopTenCities;
use App\Models\BranchTopTenProjects;
use App\Models\BranchTopTenSectors;
use App\Models\BranchTopTenNoOfEmp;
use App\Models\LiaisonTopTenCountries;
use App\Models\LiaisonTopTenCities;
use App\Models\LiaisonTopTenProjects;
use App\Models\LiaisonTopTenSectors;
use App\Models\LiaisonTopTenNoOfEmp;
use App\Models\RptPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Excel;
use App\Exports\LiaisonTopTenCountriesExport;
use App\Exports\LiaisonTopTenCitiesExport;
use App\Exports\LiaisonTopTenProjectsExport;
use App\Exports\LiaisonTopTenSectorsExport;
use App\Exports\LiaisonTopTenNoOfEmpExport;

use App\Exports\BranchTopTenCountriesExport;
use App\Exports\BranchTopTenCitiesExport;
use App\Exports\BranchTopTenProjectsExport;
use App\Exports\BranchTopTenSectorsExport;
use App\Exports\BranchTopTenNoOfEmpExport;

class ReportController extends Controller{
    
    


    /*
     * get Branch top ten cities
     */
    public function getBranchTopTenCities(){

        $data['all'] = BranchTopTenCities::all();
        $data['city'] = BranchTopTenCities::pluck('city');
        $data['total'] = BranchTopTenCities::pluck('total');
        return $data;
    }



    /*
     * get Branch top ten countries
     */
    public function getBranchTopTenCountries(){

        $country = BranchTopTenCountries::pluck('country');
        $array = array();
        foreach ($country as  $value) {
            $count = collect(\App\Lookups\Country::DATA)->firstWhere('value', $value);
            $array[] = $count['text'];
        }
        $data['country'] = $array;
        $data['all'] = BranchTopTenCountries::all();
        $data['total'] = BranchTopTenCountries::pluck('total');
        return $data;
    }

    /*
     * get Branch top ten projects
     */
    public function getBranchTopTenProjects(){
       
        $data['all'] = BranchTopTenProjects::all();
        $data['project'] = BranchTopTenProjects::pluck('project');
        $data['annual_expenses'] = BranchTopTenProjects::pluck('annual_expenses');
        return $data;
    }

    /*
     * get Branch top ten sectors
     */
    public function getBranchTopTenSectors(){

        $sector = BranchTopTenSectors::pluck('sector_id');
        $sector_id = array();
        foreach ($sector as  $value) {
            $sector = collect(\App\Lookups\Sector::DATA)->firstWhere('value', $value);
            $sector_id[] = $sector['text'];
        }
        $data['sector'] = $sector_id;
        $data['all'] = BranchTopTenSectors::all();
        $data['total'] = BranchTopTenSectors::pluck('total');
        return $data;
        
    }

    /*
     * get Branch top ten No Of Employee
     */
    public function getBranchTopTenNoOfEmp(){
        
        $all = BranchTopTenNoOfEmp::all();
        $array = array();
        $company = array();
        $total_employee = array();
        foreach ($all as  $value) {
            $date = date('d-m-Y',strtotime($value->created_at));
            $company_name = $this->c_decrypt_name($value->company_name);
            $array[] = ['company_name' =>$company_name,'total_employee' =>$value->total_employee,'created_at' => $date];
            $company[] = $company_name;
            $total_employee[] = $value->total_employee;
        }
        $data['all'] = $array;
        $data['company_name'] = $company;
        $data['total_employee'] = $total_employee;
        return $data;
    }

    
   // for branch report data download in csv 
    public function branchDownloadExcel($type)
    {

       if($type=='TopTenNoOfEmp'){
        
         return Excel::download(new BranchTopTenNoOfEmpExport, 'top_ten_no_of_employee.xlsx');

       }else if($type=='TopTenCities'){
        
         return Excel::download(new BranchTopTenCitiesExport, 'top_ten_cities.xlsx');  

       }else if($type=='TopTenCountries'){

         return Excel::download(new BranchTopTenCountriesExport, 'top_ten_countries.xlsx');  

       }else if($type=='TopTenProjects'){
        
         return Excel::download(new BranchTopTenProjectsExport, 'top_ten_projects.xlsx');  

       }else if($type=='TopTenSectors'){
        
         return Excel::download(new BranchTopTenSectorsExport, 'top_ten_sectors.xlsx');  

       }

    }



    function c_decrypt_name($val){
        try{
            return $val ? decrypt($val) : $val;
        }
        catch(\Exception $e){
            return $val;
        }
    }


    /*
     * get Liaison top ten cities
     */
    public function getLiaisonTopTenCities(){
       
        $data['all'] = LiaisonTopTenCities::all();
        $data['city'] = LiaisonTopTenCities::pluck('city');
        $data['total'] = LiaisonTopTenCities::pluck('total');
        return $data;
    }



    /*
     * get Liaison top ten countries
     */
    public function getLiaisonTopTenCountries(){
        
        $data['all'] = LiaisonTopTenCountries::all();
        $country = LiaisonTopTenCountries::pluck('country');
        $array = array();
        foreach ($country as  $value) {
            $count = collect(\App\Lookups\Country::DATA)->firstWhere('value', $value);
            $array[] = $count['text'];
        }
        $data['country'] = $array;
        $data['total'] = LiaisonTopTenCountries::pluck('total');
        return $data;
    }

    /*
     * get Liaison top ten projects
     */
    public function getLiaisonTopTenProjects(){
        
        $data['all'] = LiaisonTopTenProjects::all();
        $data['project'] = LiaisonTopTenProjects::pluck('project');
        $data['annual_expenses'] = LiaisonTopTenProjects::pluck('annual_expenses');
        return $data;
    }

    /*
     * get Liaison top ten sectors
     */
    public function getLiaisonTopTenSectors(){
       
        $sector = LiaisonTopTenSectors::pluck('sector_id');
        $sector_id = array();
        foreach ($sector as  $value) {
            $sector = collect(\App\Lookups\Sector::DATA)->firstWhere('value', $value);
            $sector_id[] = $sector['text'];
        }
        $data['sector'] = $sector_id;
        //print_r($data['sector']);exit();
        $data['all'] = LiaisonTopTenSectors::all();
        $data['total'] = LiaisonTopTenSectors::pluck('total');
        return $data;
    }


    /*
     * get Liaison top ten No Of Employee
     */
    public function getLiaisonTopTenNoOfEmp(){
        
        $all = LiaisonTopTenNoOfEmp::all();
        $array = array();
        $company = array();
        $total_employee = array();
        foreach ($all as  $value) {
            $date = date('d-m-Y',strtotime($value->created_at));
            $company_name = $this->c_decrypt_name($value->company_name);
            $array[] = ['company_name' =>$company_name,'total_employee' =>$value->total_employee,'created_at' => $date];
            $company[] = $company_name;
            $total_employee[] = $value->total_employee;
        }
        $data['all'] = $array;
        $data['company_name'] = $company;
        $data['total_employee'] = $total_employee;
        return $data;
    }


    /*
     * get Daily Currency Rate
     */
    public function getDailyCurrencyRate(){
        
        $query = \App\Models\Currency::select('currency.*')->orderBy('id', 'DESC');
        
        
        $pageSize = request()->per_page;
        $data = $query->paginate($pageSize ? (int)$pageSize : 10);
        
        return $data;
    }

    public function getPaymentDetail(){
        $query = RptPayment::select('rpt_payments.*')->orderBy('id', 'DESC');
        
        
        $pageSize = request()->per_page;
        $data = $query->paginate($pageSize ? (int)$pageSize : 10);
        
        return $data;
    }


    // for csv report download
    public function liaisonDownloadExcel($type)
    {
        
       if($type=='TopTenNoOfEmp'){

         return Excel::download(new LiaisonTopTenNoOfEmpExport, 'top_ten_no_of_employee.xlsx');

       }else if($type=='TopTenCities'){
        
         return Excel::download(new LiaisonTopTenCitiesExport, 'top_ten_cities.xlsx');  

       }else if($type=='TopTenCountries'){
        
         return Excel::download(new LiaisonTopTenCountriesExport, 'top_ten_countries.xlsx');  

       }else if($type=='TopTenProjects'){
        
         return Excel::download(new LiaisonTopTenProjectsExport, 'top_ten_projects.xlsx');  

       }else if($type=='TopTenSectors'){
        
         return Excel::download(new LiaisonTopTenSectorsExport, 'top_ten_sectors.xlsx');  

       }

    }

   
}