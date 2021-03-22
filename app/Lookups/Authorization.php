<?php

/**
 *	This lookup is generated based on lookup data in database using following command
 *
 *	php artisan dump:lookup
 *
 *
 */

namespace App\Lookups;

class Authorization extends BaseLookup{

	/**
	 * Super admin can manage organizations & users (and anything else upto that level)
	 */
	const SUPER_ADMIN = 1;


	/**
	 * Organization admin can manage users (and anything else upto that level) of their own organization
	 */
	const ORG_ADMIN = 2;


	/**
	 * Normal user can perform action with their organization as authorized by organization admin
	 */
	const USER = 3;


	/**
	 * Admin acts as super admin but as authorized by super admin
	 */
	const ADMIN = 4;



	const DATA = [
		['value' => 1, 'text' => 'Super Admin'],
		['value' => 2, 'text' => 'Organization Admin'],
		['value' => 3, 'text' => 'User'],
		['value' => 4, 'text' => 'Admin'],
	];
}