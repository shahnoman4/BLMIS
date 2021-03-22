<?php

/**
 *	This lookup is generated based on lookup data in database using following command
 *
 *	php artisan dump:lookup
 *
 *
 */

namespace App\Lookups;

class ServiceType extends BaseLookup{

	const BRANCH = 1;
	const SUB_BRANCH = 2;
	const BRANCH_CONVERSION = 3;
	const LIAISON = 4;
	const SUB_LIAISON = 5;
	const LIAISON_CONVERSION = 6;

	const DATA = [
		['value' => 1, 'text' => 'Branch Office'],
		['value' => 2, 'text' => 'Sub-Branch Office'],
		['value' => 3, 'text' => 'Branch Conversion'],
		['value' => 4, 'text' => 'Liaison Office'],
		['value' => 5, 'text' => 'Sub-Liaison Office'],
		['value' => 6, 'text' => 'Liaison Conversion'],
	];
}