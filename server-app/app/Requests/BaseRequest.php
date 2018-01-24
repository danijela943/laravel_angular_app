<?php

namespace App\Requests;
use \App\BaseModel;
use \Illuminate\Http\Request;
abstract class BaseRequest
{
	protected  $request_data;
	protected $type;
	protected $model; 
	public $hasCallback = false;

	public function __construct(Request $request_data = null, $type = null){
		$this->request_data = $request_data;
		$this->type = $type;
	}

	public function getRequestData(){
		return $this->request_data;
	}
	public abstract function fetchRequest() : array;
	public abstract function validateRequest() : array;
}