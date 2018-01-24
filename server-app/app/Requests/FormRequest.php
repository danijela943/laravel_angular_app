<?php

namespace App\Requests;
use \App\Requests\BaseRequest;
use \Illuminate\Http\Request;
use \Illuminate\Support\Facades\Validator;
use \Illuminate\Support\Facades\Auth;
class FormRequest extends BaseRequest
{
	public function __construct(Request $request_data = null, $type = null){
		parent::__construct($request_data, $type);
	}
	public function fetchRequest() : array {
		$data = array();
		if(!empty($this->request_data)){
			if($this->request_data->method() == 'GET'){
				switch($this->type){
					case 'form-formElement':
						if(!empty($this->request_data->active)){
							$data = array(
								'active' => $this->request_data->active,
								'id_offer' => $this->request_data->id_offer
							);
						}
						else if($this->request_data->has('id_offer')){
							$data = array(
								'id_user' => Auth::user()->id,
								'id_offer' => $this->request_data->id_offer
							);
						}else {
							$data = array(
								'id_form' => $this->request_data->id_form
							);
						}
						break;
					case 'form':
						if(!empty($this->request_data->active)){
							$data = array(
								'active' => $this->request_data->active,
								'id_offer' => $this->request_data->id_offer
							);
						}
						else if($this->request_data->has('id_offer')){
							$data = array(
								'id_user' => Auth::user()->id,
								'id_offer' => $this->request_data->id_offer
							);
						}
						else {
							$data = array(
								'id_form' => $this->request_data->id_form
							);
						}
						break;
					default:
						$data = array();
						break;
				}
			}
			else if($this->request_data->method() == 'PUT'){
				switch($this->request_data->path()){
					case 'api/put/save/form':
						$data = array(
							'id_user' => Auth::user()->id,
							'title' => $this->request_data->title,
							'id_offer' => $this->request_data->id_offer, // CHANGE
							'active' => 1,
							'created_at' => time()
						);
						break;
					case 'api/put/update/form':
						$properties = array('title','active');
						$data['data'] = array();
						foreach($properties as $prop){
							if($this->request_data->has($prop)){
								$data['data'][$prop] = $this->request_data->$prop;
							}
						}
						$data['where'] = array(
							'id_form'=>$this->request_data->id_form
						);
				}
				
			}
			else if($this->request_data->method() == 'POST'){
				$data['where'] = array(
					'id_form' => $this->request_data->id_form
				);
			}
		}
		return $data;
	}
	public function validateRequest($type = null) : array {
		return array();
	}

}