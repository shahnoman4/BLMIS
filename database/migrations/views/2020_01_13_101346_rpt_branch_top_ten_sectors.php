<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RptBranchTopTenSectors extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      DB::statement("

          CREATE VIEW rpt_branch_top_ten_sectors AS
          (
            SELECT org.sector_id, COUNT(*) as total, min(org.subscribed_at) as fromdate, max(org.subscribed_at) as todate FROM organization  as org 
            RIGHT JOIN branch as b
            ON   org.id = b.organization_id
            where b.service_type_id IN (1,3)
            GROUP BY org.sector_id
            order BY total DESC LIMIT 10
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
       DB::statement('DROP VIEW IF EXISTS rpt_branch_top_ten_sectors');
    }
}
