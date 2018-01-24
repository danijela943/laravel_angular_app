<?php

use Illuminate\Http\Request;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group(['prefix' => '/get'], function(){
	Route::match(['get','options'],'/{type}', 'BaseController@get')->middleware(['cors','auth:api']);

});
Route::group(['prefix' => '/pub'], function(){
	Route::get('/{type}', 'BaseController@get');
});
Route::group(['prefix' => '/put'], function(){
	Route::put('/save/{type}', 'BaseController@save')->middleware('auth:api');
	Route::put('/update/{type}', 'BaseController@update')->middleware('auth:api');
});
Route::group(['prefix' => '/delete'], function(){
	Route::post('/{type}', 'BaseController@delete')->middleware('auth:api');
});
Route::get('/unserialize', function(Request $request){
	if(isset($request->object)){
		return unserialize($request->object);
	}
	return response('Object is not set.',400);
});
Route::put('/registerUser', 'RegisterController@index');
Route::get('/get/currency','BaseController@get')->middleware('auth:api');
Route::get('test',function(){
    return response([1,2,3,4],200);   
});
