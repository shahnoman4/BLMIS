<?php

/**
 *	This lookup is generated based on lookup data in database using following command
 *
 *	php artisan dump:lookup
 *
 *
 */
//UPDATE `branch` SET `status_id` = '1' WHERE `branch`.`id` = 42;

//http://localhost:8000/api/application/branch/42/attachments
namespace App\Lookups;

class ApplicationStatus extends BaseLookup{

	const NEW = 1;
	const INITIATED = 2;
	const SUBMITTED = 3;
	const FORWARDED = 4;
	const CIRCULATED = 5;
	const APPROVED = 6;
	const REJECTED = 7;
	const COMMENTED = 8;
	const UPDATED = 9;
	const REVERTED = 10;
	const HELD = 11;
	const APPROVABLE = 12;
	const REJECTABLE = 13;
	const PAYMENT_PENDING = 14;
	const PENDING = 15;
	const SHARED = 16;
	const ACTIVE = 17;
	const INACTIVE = 18;
	const RENEWED = 19;

	const DATA = [
		['value' => 1, 'text' => 'New'],
		['value' => 2, 'text' => 'Initiated'],
		['value' => 3, 'text' => 'Submitted'],
		['value' => 4, 'text' => 'Forwarded'],
		['value' => 5, 'text' => 'Circulated'],
		['value' => 6, 'text' => 'Approved'],
		['value' => 7, 'text' => 'Rejected'],
		['value' => 8, 'text' => 'Commented'],
		['value' => 9, 'text' => 'Updated'],
		['value' => 10, 'text' => 'Reverted'],
		['value' => 11, 'text' => 'Held'],
		['value' => 12, 'text' => 'Approvable'],
		['value' => 13, 'text' => 'Rejectable'],
		['value' => 14, 'text' => 'Payment Pending'],
		['value' => 15, 'text' => 'Pending'],
		['value' => 16, 'text' => 'Shared'],
		['value' => 17, 'text' => 'Active'],
		['value' => 18, 'text' => 'In Active'],
		['value' => 19, 'text' => 'Renewed'],
	];
}