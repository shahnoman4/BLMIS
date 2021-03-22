<?php

Route::group(['prefix' => 'api', 'middleware' => 'guest'], function () {
    Route::post('/validate/register', "CompanyController@validateNewCompany");
    Route::post('/register', "CompanyController@registerNewCompany");
    Route::post('/password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail');
});

Route::group(['prefix' => 'api', 'middleware' => 'auth'], function () {
    Route::get('/notification', function(){
        if(request()->all){
            $data = \Auth::user()->notifications;
        }
        else{
            $data = \Auth::user()->unreadNotifications;
        }
        $data->each(function($item){
            $comments = \Arr::get($item->data, 'comments');
            if($comments){
                $item->data = array_merge($item->data, ['comments' => c_decrypt($comments)]);
            }
        });
        return $data;
    });
    Route::put('/notification/{item}', function(\Illuminate\Notifications\DatabaseNotification $item){
        $item->markAsRead();
        return ['success' => true, 'data' => $item];
    });
    Route::post('/application/{type}/{id}/attachments', 'ApplicationController@downloadAttachments');
});

Route::group(['prefix' => 'api', 'middleware' => ['auth', 'orgAdmin']], function () {
        Route::put('/company/password', 'CompanyController@updatePassword');
        Route::get('/company/profile', 'CompanyController@profile');
        Route::get('/company/logs', 'CompanyController@logs');
        Route::put('/company', 'CompanyController@updateProfile');
        Route::post('/company/comment', 'CompanyController@addComments');
        Route::get('/branch/logs/{id?}', 'BranchController@logs');
        Route::post('/validate/branch', "BranchController@validateNewBranch");
        Route::post('/branch/before-submit', "BranchController@validateNewBranchBeforeSubmit");
        Route::post('/sub-branch/before-submit', "BranchController@validateNewSubBranchBeforeSubmit");
        Route::post('/branch', "BranchController@addNewBranch");
        Route::get('/branch/{id}/payment', "BranchController@getPayment");
        Route::post('/payment/branch/{id}', 'BranchController@receiveManualPayment');
        Route::post('/branch/validate-renew', "BranchController@validateRenewApplication");
        Route::post('/branch/{id}/renew', "BranchController@renewApplication");
        Route::post('/branch/{id}/review', "BranchController@reviewApplication");
        Route::post('/branch/after-review', "BranchController@addNewBranchAfterReview");
        Route::post('/sub-branch/after-review', "BranchController@addNewSubBranchAfterReview");
        Route::post('/branch/{id}/contract', "BranchController@addContract");
        Route::put('/contract/{id}', "BranchController@extendContract");
        Route::put('/branch/{id}', "BranchController@updateProfile");
        Route::get('/branch/{id}', 'BranchController@getProfile');
        Route::post('/branch/comment/{id}', 'BranchController@addComments');
        Route::get('/sub-branches', 'BranchController@getSubBranches');
        Route::get('/state/branch', 'BranchController@getEditorState');
    });
    
Route::group(['middleware' => ['auth', 'orgAdmin']], function () {
    Route::get('/checkout/payment/branch/{id}', 'BranchController@showPaymentForm');
    Route::get('/checkout/branch/after-review', "BranchController@addNewBranchAfterReview");
    Route::get('/checkout/sub-branch/after-review', "BranchController@addNewSubBranchAfterReview");
    Route::post('/callback/jazz', 'BranchController@showJazzResponse');
});

Route::group(['middleware' => ['auth', 'admin']], function () {
    Route::get('/admin/2fa/verify', 'TwoFAController@showForm');
    Route::post('/admin/2fa/verify', 'TwoFAController@verifyPin');
    Route::post('/admin/2fa/resend', 'TwoFAController@resendPin');
});
    
Route::group(['middleware' => 'guest'], function () {
    Route::post('/validate/register', "CompanyController@validateNewCompany");
    Route::post('/register', "CompanyController@registerNewCompany");
    Route::post('/password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail');
    Route::post('/validate/register', "CompanyController@validateNewCompany");
    Route::post('/register', "CompanyController@registerNewCompany");
    Route::get('/password/reset/{token}', 'Auth\ResetPasswordController@showResetForm');
    Route::post('/password/reset', 'Auth\ResetPasswordController@reset');

});

Route::get('/application/pdfBranch/{id}', 'BranchController@pdfBranch');
Route::get('/application/pdfSignup/{id}', 'CompanyController@pdfBranch');
Route::get('/application/pdfdummy/{id}', 'CompanyController@pdfdummy');
Route::get('/application/receiptBranch/{id}', 'BranchController@receiptBranch');
Route::get('/application/receiptRenewal/{id}', 'BranchController@receiptRenewal');

Route::get('/report/branchDownloadExcel/{type}', 'ReportController@branchDownloadExcel');
Route::get('/report/liaisonDownloadExcel/{type}', 'ReportController@liaisonDownloadExcel');

Route::get('{slug}', function($slug = null) {
    $config = react_config();
    if(\Auth::guard()->check()){
        $user = \Auth::user();
        $redirectTo = '/admin' . \Arr::get($config, 'redirectTo', '');
        if(($user->isSuperAdmin() || $user->isStakeholder()) && (!$slug || ($slug == 'admin' && trim($redirectTo, '/') != 'admin'))){
            return redirect($redirectTo);
        }
    }
    return view('react', ['config' => $config]);
})
->middleware('twoFA')
->where('slug', '(?!api)([A-z\d\-\/_.]+)?');

Route::group(['prefix' => 'api'], function () {
    Auth::routes(['register' => false]);
});

Route::group(['prefix' => 'api', 'middleware' => 'guest'], function () {
    Route::get('/login', function(){
        if(request()->is('admin*')){
            return redirect('/admin/login');
        }
        return redirect('/login');
    })->name('login');
});

