<?php

/**
 *	This lookup is generated based on lookup data in database using following command
 *
 *	php artisan dump:lookup
 *
 *
 */

namespace App\Lookups;

class ProfileStatus extends BaseLookup{

	const ACTIVE = 1;
	const BLOCKED = 2;

	const DATA = [
		['value' => 1, 'text' => 'Active'],
		['value' => 2, 'text' => 'Blocked'],
	];
}