<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TextifyColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */

    public function up()
    {
        \DB::unprepared('
            ALTER TABLE `contact` 
                CHANGE COLUMN `office_phone` `office_phone` TEXT NULL DEFAULT NULL ,
                CHANGE COLUMN `office_fax` `office_fax` TEXT NULL DEFAULT NULL ,
                CHANGE COLUMN `primary_phone` `primary_phone` TEXT NULL DEFAULT NULL ,
                CHANGE COLUMN `full_name` `full_name` TEXT NULL DEFAULT NULL ,
                CHANGE COLUMN `passport_no` `passport_no` TEXT NULL DEFAULT NULL ,
                CHANGE COLUMN `mobile_phone` `mobile_phone` TEXT NULL DEFAULT NULL ;


            ALTER TABLE `organization` 
                CHANGE COLUMN `name` `name` TEXT NULL DEFAULT NULL ;


            ALTER TABLE `rpt_liaison_top_ten_no_of_employee` 
                CHANGE COLUMN `company_name` `company_name` TEXT NULL DEFAULT NULL ;


            ALTER TABLE `user` 
                CHANGE COLUMN `full_name` `full_name` TEXT NULL DEFAULT NULL ,
                CHANGE COLUMN `first_name` `first_name` TEXT NULL DEFAULT NULL ,
                CHANGE COLUMN `last_name` `last_name` TEXT NULL DEFAULT NULL ;
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
