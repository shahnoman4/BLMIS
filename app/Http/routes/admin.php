<?php


Route::get('/application/all/stats', 'ApplicationController@getApplicationsStats');
Route::get('/application/signup/stats', 'CompanyController@getApplicationsStats');
Route::get('/application/signup/{id}', 'CompanyController@getApplicationDetail')->where('id', '[0-9]+');
Route::get('/application/signup/{status?}', 'CompanyController@getApplications')->where('status', '^all|new|rejected|approved$');
Route::get('/application/signup/logs/{id}', 'CompanyController@getApplicationLogs')->where('id', '[0-9]+');
Route::post('/application/{type}/approve/{id}', 'ApplicationController@approve');
Route::post('/application/{type}/reject/{id}', 'ApplicationController@reject');
Route::post('/application/{type}/comment/{id}', 'ApplicationController@addComment');
Route::post('/application/{type}/circulate/{id}', 'ApplicationController@circulate');
Route::post('/application/{type}/revert/{id}', 'ApplicationController@revert');
Route::post('/application/{type}/hold/{id}', 'ApplicationController@hold');
Route::post('/application/{type}/share/{id}', 'ApplicationController@shareCopyForInformation');
Route::get('/application/branch/stats', 'BranchController@getApplicationsStats');
Route::get('/application/branch/{id}', 'BranchController@getApplicationDetail')->where('id', '[0-9]+');
Route::get('/application/branch/{status?}', 'BranchController@getApplications')->where('status', '^all|recent|new|circulated|reverted|reviewable|reject|rejected|approved|matured|hold|expired|expiring$');
Route::get('/application/renewal', 'BranchController@getRenewalRequests');
Route::get('/application/contract', 'BranchController@getContractRequests');
Route::get('/application/contract/{id}', 'BranchController@getContractDetail');
Route::get('/application/contract/logs/{id}', 'BranchController@getContractLogs');
Route::get('/application/branch/logs/{id}', 'BranchController@getApplicationLogs')->where('id', '[0-9]+');
Route::post('/application/branch/assignFileNo', 'BranchController@assignFileNo');

Route::get('/user-group', 'RoleController@getGroups');
Route::post('/user-group', 'RoleController@createGroup');
Route::put('/user-group/{id}', 'RoleController@updateGroup');
Route::get('/role', 'RoleController@getRoles');
Route::post('/role', 'RoleController@createRole');
Route::put('/role/{id}', 'RoleController@updateRole');
Route::get('/role/{id}/permissions', 'RoleController@getRolePermissions');
Route::get('/user', 'UserController@getUsers');
Route::post('/user', 'UserController@createUser');
Route::put('/user/{id}', 'UserController@updateUser');
Route::put('/admin/password', 'UserController@updatePassword');
Route::post('/admin/company/password', 'UserController@updateCompanyPassword');


Route::get('/slider', 'UserController@getSliders');
Route::post('/slider', 'UserController@createSlider');
Route::put('/slider/{id}', 'UserController@updateSlider');


Route::post('/admin/siteConfig', 'UserController@siteConfig');
Route::get('/admin/siteConfig', 'UserController@getSiteConfig');

//Reports Module
//branch
Route::get('/report/branchtoptencities', 'ReportController@getBranchTopTenCities');
Route::get('/report/branchtoptencountries', 'ReportController@getBranchTopTenCountries');
Route::get('/report/branchtoptenprojects', 'ReportController@getBranchTopTenProjects');
Route::get('/report/branchtoptensectors', 'ReportController@getBranchTopTenSectors');
Route::get('/report/branchtoptenNoOfEmp', 'ReportController@getBranchTopTenNoOfEmp');
//liaison
Route::get('/report/liaisontoptencities', 'ReportController@getLiaisonTopTenCities');
Route::get('/report/liaisontoptencountries', 'ReportController@getLiaisonTopTenCountries');
Route::get('/report/liaisontoptenprojects', 'ReportController@getLiaisonTopTenProjects');
Route::get('/report/liaisontoptensectors', 'ReportController@getLiaisonTopTenSectors');
Route::get('/report/liaisontoptenNoOfEmp', 'ReportController@getLiaisonTopTenNoOfEmp');
//
Route::get('/report/dailycurrencyrate', 'ReportController@getDailyCurrencyRate');
Route::get('/report/paymentdetail', 'ReportController@getPaymentDetail');

