<?php

namespace App\Requests;
use \App\Requests\BaseRequest;
use \Illuminate\Http\Request;
use \Illuminate\Support\Facades\Validator;
class AllowedValuesRequest extends BaseRequest
{
	private $idReference;

	public function setReferenceValue($idReference)
	{
		$this->idReference = $idReference;
	}
	public function __construct(Request $request_data = null, $type = null){
		parent::__construct($request_data, $type);
	}
	public function fetchRequest() : array {
		$data = array();
		if(!empty($this->request_data)){
			if($this->request_data->method()=='PUT'){
				$allowedValues = $this->request_data->allowed_values;
				$data = array();
				foreach ($allowedValues as $value){
					$data[] = array(
						'value' => $value,
						'id_form_element' => $this->idReference
					);
				}
			}
			else if($this->request_data->method()=='POST'){
				$ids = explode(',',$this->request_data->id_form);
				$data['where'] = array();
				$data['where']['id_value']=array();
				foreach ($ids as $id) {
					$data['where']['id_value'][] = $id;
				}
				
			}

		}
		return $data;
	}
	public function validateRequest() : array {
		return array();
	}

}