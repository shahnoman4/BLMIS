<?php

/**
 *	This lookup is generated based on lookup data in database using following command
 *
 *	php artisan dump:lookup
 *
 *
 */

namespace App\Lookups;

class ContactType extends BaseLookup{

	const USER = 1;
	const ORGANIZATION = 2;
	const PRINCIPAL_OFFICER = 3;
	const DIRECTOR = 4;
	const LOCAL_CONTACT = 5;
	const LOCAL_SPONSOR = 6;
	const AGENT = 7;
	const PARTNER_COMPANY = 8;
	const PARTNER_PERSON = 9;
	const REPRESENTATIVE_OFFICER = 10;

	const DATA = [
		['value' => 1, 'text' => 'User'],
		['value' => 2, 'text' => 'Organization'],
		['value' => 3, 'text' => 'Principal Officer'],
		['value' => 4, 'text' => 'Director'],
		['value' => 5, 'text' => 'Local Contact'],
		['value' => 6, 'text' => 'Local Sponsor'],
		['value' => 7, 'text' => 'Agent'],
		['value' => 8, 'text' => 'Partner Company'],
		['value' => 9, 'text' => 'Partner Person'],
		['value' => 10, 'text' => 'Representative Officer'],
	];
}