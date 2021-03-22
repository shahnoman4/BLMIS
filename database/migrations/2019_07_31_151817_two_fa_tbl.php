<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TwoFaTbl extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::unprepared('
            DROP TABLE IF EXISTS `two_fa_token`;
            CREATE TABLE `two_fa_token` (
                `user_id` char(36) DEFAULT NULL,
                `email` varchar(100) DEFAULT NULL,
                `phone_number` varchar(100) DEFAULT NULL,
                `email_pin` varchar(100) DEFAULT NULL,
                `phone_pin` varchar(100) DEFAULT NULL,
                `attempts` int(11) DEFAULT 0,
                `created_at` timestamp NULL DEFAULT NULL,
                KEY `tfa_user_id` (`user_id`) USING BTREE
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;
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
