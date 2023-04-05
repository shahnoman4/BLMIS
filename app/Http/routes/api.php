<?php


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('/user/siteConfig', function() {
        $data['config'] = \App\Models\SiteConfig::findOrFail(1);
        $data['slider'] = \DB::table('slider_images')->where('status_id',\App\Lookups\ProfileStatus::ACTIVE)->get(); 
        return response()->json($data);
});

Route::post('/media/raw', "MediaController@uploadTempFile");
Route::post('/media/raw-image', "MediaController@uploadTempImage");
Route::get('/lookup/{type?}', function($type = null){
    if($type){
        return \App\Lookups\BaseLookup::get($type);
    }
    return \App\Lookups\BaseLookup::getAll();
});
if(config('auth.nbp.active')){
    Route::post('/external/nbp/currency/convertor/usd-to-pkr', function(){
        //dd(request()->ip());
        \File::append(
            storage_path('/logs/currency-convertor.http.log'),
            now()->format('Y-m-d H:i:s') . ' ('. request()->ip() .') : ' . json_encode(request()->all()) . "\n"
        );
        \App\Models\Currency::insert(
            ['rate' => request()->rate, 'Timestamp' => request()->Timestamp, 'ip' => request()->ip()]
        );
        return ['success' => true];
    })->middleware('auth.basic.once:nbp');
}