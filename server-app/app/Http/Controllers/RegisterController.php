<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Responses\ApiJsonResponse;
class RegisterController extends Controller
{
	private $responser;
     public function __construct()
    {
    	$this->responser = new ApiJsonResponse;
    }

    public function index(Request $request){
    	$validator =  \Illuminate\Support\Facades\Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6'
        ]);
        if (!empty($validator) && $validator->fails())
		{
		       $errors = $validator->errors()->all();
		       return $this->responser->createErrorResponse(400, $errors);
	    }
		    
        $created = \App\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);
        return $this->responser->createResponse($created,'You successfully added user');
    }
}
