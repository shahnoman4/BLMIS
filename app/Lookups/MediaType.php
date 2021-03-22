<?php

/**
 *	This lookup is generated based on lookup data in database using following command
 *
 *	php artisan dump:lookup
 *
 *
 */

namespace App\Lookups;

class MediaType extends BaseLookup{

	/**
	 * Profile picture of an entity
	 */
	const DP = 1;


	/**
	 * Background picture of an entity
	 */
	const COVER_PHOTO = 2;


	/**
	 * Any file uploaded by an entity
	 */
	const ATTACHMENT = 3;


	const PERMISSION_LETTER = 4;
	const NIC = 5;
	const PASSPORT = 6;
	const CV = 7;
	const COVER_LETTER = 8;
	const REGISTRATION_LETTER = 9;
	const MEMORANDUM_ARTICLE = 10;
	const AUTHORITY_LETTER = 11;
	const ORG_PROFILE = 12;
	const AGREEMENT_LETTER = 13;
	const LEASE_AGREEMENT = 14;
	const SECP_CERTIFICATE = 15;
	const REALIZATION_CERTIFICATE = 16;
	const ANNUAL_REPORT = 17;
	const RECEIPT = 18;
	const TAX_RETURN = 19;
	const FINANCIAL_STATEMENT = 20;
	const AUDIT_REPORT = 21;
	const ARTICLE_ASSOCIATION = 22;
	const Board_Resolution = 23;
	const Valid_Permission_Rewnal = 24;

	const DATA = [
		['value' => 1, 'text' => 'Profile Picture'],
		['value' => 2, 'text' => 'Cover Photo'],
		['value' => 3, 'text' => 'Attachment'],
		['value' => 4, 'text' => 'Permission Letter'],
		['value' => 5, 'text' => 'NIC'],
		['value' => 6, 'text' => 'Passport'],
		['value' => 7, 'text' => 'CV'],
		['value' => 8, 'text' => 'Cover Letter'],
		['value' => 9, 'text' => ''],
		['value' => 10, 'text' => ''],
		['value' => 11, 'text' => ''],
		['value' => 12, 'text' => ''],
		['value' => 13, 'text' => ''],
		['value' => 14, 'text' => ''],
		['value' => 15, 'text' => ''],
		['value' => 16, 'text' => ''],
		['value' => 17, 'text' => ''],
		['value' => 18, 'text' => ''],
		['value' => 19, 'text' => ''],
		['value' => 20, 'text' => ''],
		['value' => 21, 'text' => ''],
		['value' => 22, 'text' => ''],
		['value' => 23, 'text' => ''],
		['value' => 24, 'text' => ''],
	];
}