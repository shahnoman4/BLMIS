<?php

/**
 *	This lookup is generated based on lookup data in database using following command
 *
 *	php artisan dump:lookup
 *
 *
 */

namespace App\Lookups;

class Sector extends BaseLookup{

	const FOOD = 1;
	const FOOD_PACKAGING = 2;
	const BEVERAGES = 3;
	const TOBACCO_CIGARETTES = 4;
	const SUGAR = 5;
	const TEXTILES = 6;
	const PAPER_PULP = 7;
	const LEATHER_LEATHER_PRODUCTS = 8;
	const RUBBER_RUBBER_PRODUCTS = 9;
	const CHEMICALS = 10;
	const PETRO_CHEMICALS = 11;
	const PETROLEUM_REFINING = 12;
	const MINING_QUARRYING = 13;
	const OIL_GAS_EXPLORATIONS = 14;
	const PHARMACEUTICALS_O_T_C_PRODUCTS = 15;
	const COSMETICS = 16;
	const FERTILIZERS = 17;
	const CEMENT = 18;
	const CERAMICS = 19;
	const BASIC_METALS = 20;
	const METAL_PRODUCTS = 21;
	const MACHINERYOTHERTHAN_ELECTRICAL = 22;
	const ELECTRICAL_MACHINERY = 23;
	const ELECTRONICS = 24;
	const POWER = 25;
	const CONSTRUCTION = 26;
	const TRADE = 27;
	const TRANSPORT = 28;
	const TRANSPORT_EQUIPMENT_AUTOMOBILES = 29;
	const TOURISM = 30;
	const STORAGE_FACILITIES = 31;
	const TELECOMMUNICATIONS = 32;
	const INFORMATION_TECHNOLOGY = 33;
	const FINANCIAL_BUSINESS = 34;
	const SOCIAL_SERVICES = 35;
	const PERSONAL_SERVICES = 36;
	const OTHER = 37;

	const DATA = [
		['value' => 1, 'text' => 'Food'],
		['value' => 2, 'text' => 'Food Packaging'],
		['value' => 3, 'text' => 'Beverages'],
		['value' => 4, 'text' => 'Tobacco & Cigarettes'],
		['value' => 5, 'text' => 'Sugar'],
		['value' => 6, 'text' => 'Textiles'],
		['value' => 7, 'text' => 'Paper & Pulp'],
		['value' => 8, 'text' => 'Leather & Leather Products'],
		['value' => 9, 'text' => 'Rubber & Rubber Products'],
		['value' => 10, 'text' => 'Chemicals'],
		['value' => 11, 'text' => 'Petro Chemicals'],
		['value' => 12, 'text' => 'Petroleum Refining'],
		['value' => 13, 'text' => 'Mining & Quarrying'],
		['value' => 14, 'text' => 'Oil & Gas Explorations'],
		['value' => 15, 'text' => 'Pharmaceuticals & OTC Products'],
		['value' => 16, 'text' => 'Cosmetics'],
		['value' => 17, 'text' => 'Fertilizers'],
		['value' => 18, 'text' => 'Cement'],
		['value' => 19, 'text' => 'Ceramics'],
		['value' => 20, 'text' => 'Basic Metals'],
		['value' => 21, 'text' => 'Metal Products'],
		['value' => 22, 'text' => 'Machinery other than Electrical'],
		['value' => 23, 'text' => 'Electrical Machinery'],
		['value' => 24, 'text' => 'Electronics'],
		['value' => 25, 'text' => 'Power'],
		['value' => 26, 'text' => 'Construction'],
		['value' => 27, 'text' => 'Trade'],
		['value' => 28, 'text' => 'Transport'],
		['value' => 29, 'text' => 'Transport Equipment(Automobiles)'],
		['value' => 30, 'text' => 'Tourism'],
		['value' => 31, 'text' => 'Storage Facilities'],
		['value' => 32, 'text' => 'Telecommunications'],
		['value' => 33, 'text' => 'Information Technology'],
		['value' => 34, 'text' => 'Financial Business'],
		['value' => 35, 'text' => 'Social Services'],
		['value' => 36, 'text' => 'Personal Services'],
		['value' => 37, 'text' => 'Other'],
	];
}