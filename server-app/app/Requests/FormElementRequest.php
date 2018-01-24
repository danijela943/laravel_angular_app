<?php

namespace App\Requests;
use \App\Requests\BaseRequest;
use \Illuminate\Http\Request;
use \Illuminate\Support\Facades\Validator;
class FormElementRequest extends BaseRequest
{

	public function __construct(Request $request_data = null, $type = null){
		parent::__construct($request_data, $type);
	}
	public function fetchRequest() : array {
		$data = array();
		if(!empty($this->request_data)){
			if($this->request_data->method() == 'GET'){
				switch($this->type){
					case 'formElement-allowed-type':
						if(strpos($this->request_data->id_form,',')!==false){
							$ids = explode(',',$this->request_data->id_form);
							$data['id_form'] = array();
							foreach ($ids as $value) {
								$data['id_form'][] = $value;
							}
						}else {
							$data = array(
								'id_form' => $this->request_data->id_form
							);
						}
						
						break;
					case 'formElement-allowed':
						if(strpos($this->request_data->id_form_element,',')!==false){
							$ids = explode(',',$this->request_data->id_form_element);
							$data['id_form_element'] = array();
							foreach ($ids as $id) {
								$data['id_form_element'][]=$id;
							}
						}
						
						break;
					default:
						$data = array();
						break;				}
			}
			else if($this->request_data->method() == 'PUT'){
				$data = array(
					'label' => $this->request_data->label,
					'id_type' => $this->request_data->id_type,
					'required' => $this->request_data->required,
					'id_form' => $this->request_data->id_form
				);
			}
		}
		return $data;
	}
	public function validateRequest($type = null) : array {
		$errors = array();
		$validator = null;
		if(!empty($this->request_data)){
			if($this->request_data->method() == 'GET'){
				
				switch($this->type){
					case 'formElement-allowed-type':
						$validator = Validator::make($this->request_data->all(), [
					        'id_form' => 'required'
			    		]);
			    		break;
			    	case 'formElement' || 'formElement-allowed':
			    		$validator = null;
			    		break;
			    	default:
			    		$errors[] = 'Method is not allowed!';
			    		break;
				}
			}
			else if($this->request_data->method() == 'PUT'){
				$errors = array();
				$validator = Validator::make($this->request_data->all(), [
			        'label' => 'required',
			        'id_type' => 'required',
			        'id_form' => 'required'
			    ]);
			    $allowedFail = "";
				if($this->request_data->allowed_values){
					foreach ($this->request_data->allowed_values as $value) {
						if(empty(trim($value))){
							$allowedFail = "Allowed value field can't be empty.";
							break;
						}
					}
					$this->hasCallback = true;
				}
			    
		    	if(!empty($allowedFail)){
		    		$errors[] = $allowedFail;
		    	}	
			}
			if (!empty($validator) && $validator->fails())
		    {
		       $errors[] = $validator->errors()->all();
	    	}
		    return $errors;
		}
		
	}

}