<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RptLiaisonTopTenNoOfEmployee extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
          CREATE VIEW rpt_liaison_top_ten_no_of_employee AS
          (
          
            SELECT org.name as company_name, b.no_of_personnel_employee as total_employee, b.created_at as created_at FROM branch as b 
                 LEFT JOIN organization as org
                 ON    b.organization_id = org.id
                where b.service_type_id IN (4,5) AND 
                b.no_of_personnel_employee IS NOT NULL order BY total_employee DESC LIMIT 10
          )
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('DROP VIEW IF EXISTS rpt_liaison_top_ten_no_of_employee');
    }
}
