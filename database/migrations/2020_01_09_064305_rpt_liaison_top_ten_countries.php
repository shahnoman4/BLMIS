<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RptLiaisonTopTenCountries extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      DB::statement("
          CREATE VIEW rpt_liaison_top_ten_countries AS
          (
            SELECT b.original_country as country, COUNT(*) as total, min(b.created_at) as fromdate, max(b.created_at) as todate FROM branch as b 
                
                where b.service_type_id IN (4,5) AND b.original_country IS NOT NULL GROUP BY b.original_country order BY total DESC LIMIT 10
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
       DB::statement('DROP VIEW IF EXISTS rpt_liaison_top_ten_countries');
    }
}
