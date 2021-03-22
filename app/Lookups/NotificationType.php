<?php

/**
 *	This lookup is generated based on lookup data in database using following command
 *
 *	php artisan dump:lookup
 *
 *
 */

namespace App\Lookups;

class NotificationType extends BaseLookup{

	const EMAIL = 1;
	const SMS = 2;
	const IM = 3;
	/**
	 * System genderated notifications
	 */
	const SYSTEM = 4;



	const DATA = [
		['value' => 1, 'text' => 'Email'],
		['value' => 2, 'text' => 'SMS'],
		['value' => 3, 'text' => 'Instant Message'],
		['value' => 4, 'text' => 'System'],
	];
}