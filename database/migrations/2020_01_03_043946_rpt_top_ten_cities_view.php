<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RptTopTenCitiesView extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
          CREATE VIEW rpt_branch_top_ten_cities AS
          (
            SELECT l.city, COUNT(*) as total, min(c.created_at) as mindate, max(c.created_at) as maxdate FROM location as l 
                 RIGHT JOIN contact as c
                ON l.id = c.location_id
                where c.owner_type = 'branch' AND l.city IS NOT NULL GROUP BY l.city order BY total DESC LIMIT 10
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
        DB::statement('DROP VIEW IF EXISTS rpt_branch_top_ten_cities');
    }
}
