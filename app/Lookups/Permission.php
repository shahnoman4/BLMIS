<?php

/**
 *	This lookup is generated based on lookup data in database using following command
 *
 *	php artisan dump:lookup
 *
 *
 */

namespace App\Lookups;

class Permission extends BaseLookup{

	const VIEW = 1;
	const CREATE = 2;
	const READ = 3;
	const UPDATE = 4;
	const DELETE = 5;
}