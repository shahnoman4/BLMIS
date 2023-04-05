<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\Lookups\ServiceType;

class UpdateSubBranchesRef extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement('
            UPDATE branch AS b1
            INNER JOIN  branch AS b2
                ON b2.organization_id = b1.organization_id
                AND b2.service_type_id IN (? , ?)
                AND b1.service_type_id NOT IN (? , ?) 
            SET  b1.parent_id = b2.id
        ', [ServiceType::BRANCH, ServiceType::LIAISON, ServiceType::BRANCH, ServiceType::LIAISON]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
