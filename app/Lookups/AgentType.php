<?php

/**
 *	This lookup is generated based on lookup data in database using following command
 *
 *	php artisan dump:lookup
 *
 *
 */

namespace App\Lookups;

class AgentType extends BaseLookup{

	const LAW = 1;
	const ACCOUNTANT = 2;
	const TAX_CONSULTANT = 3;
	const OTHER = 4;

	const DATA = [
		['value' => 1, 'text' => 'Law Firm'],
		['value' => 2, 'text' => 'Chartered Accountancy Firm'],
		['value' => 3, 'text' => 'Tax Consultancy Firm'],
		['value' => 4, 'text' => 'Other'],
	];
}