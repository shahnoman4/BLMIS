<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterBranchTbl extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::unprepared('
            ALTER TABLE `branch`
            ADD COLUMN `converted_from` INT(11) NULL DEFAULT NULL AFTER `firm_for_profit`,
            ADD COLUMN `parent_id` INT(11) NULL DEFAULT NULL AFTER `converted_from`;
        ');

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
