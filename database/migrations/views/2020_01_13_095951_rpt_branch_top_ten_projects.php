<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RptBranchTopTenProjects extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      DB::statement("

          CREATE VIEW rpt_branch_top_ten_projects AS
          (
            SELECT b.project_info as project, inv.annual_expenses as annual_expenses, 
            b.created_at FROM branch as b 
            RIGHT JOIN investment as inv
            ON b.id = inv.branch_id
            where b.service_type_id IN (1,2)
            order BY annual_expenses DESC LIMIT 10
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
       DB::statement('DROP VIEW IF EXISTS rpt_branch_top_ten_projects');
    }
}
