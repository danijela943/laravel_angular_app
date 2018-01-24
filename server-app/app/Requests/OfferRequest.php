<?php

namespace App\Requests;
use \Illuminate\Http\Request;
use \App\OfferModel;
use \Illuminate\Support\Facades\Validator;
use \Illuminate\Support\Facades\Auth;

class OfferRequest extends BaseRequest
{
	public function __construct(Request $request_data = null, $type = null){
		parent::__construct($request_data, $type);
	}

	public function fetchRequest() : array {
		$data = array();
		if(!empty($this->request_data)){
			if($this->request_data->method() == 'GET'){
				switch($this->type){
					case 'offer-user-currency-category':
					if(isset($this->request_data->active)){
						$data = array(
							'active' => $this->request_data->active
						);
					} else if(isset($this->request_data->user)){
						$data = array(
							'user_id' => Auth::user()->id
						);
						if(isset($this->request_data->id_offer)){
							$data['id_offer'] = $this->request_data->id_offer;
						}
					}
						break;
					default:
						$data = array();
						break;
				}

			}
			else if($this->request_data->method() == 'PUT'){
				switch($this->request_data->path()){
					case 'api/put/save/offer':
						$data = array(
							'title' => $this->request_data->title,
							'body' => $this->request_data->body,
							'price' => $this->request_data->price,
							'id_currency' => $this->request_data->id_currency,
							'id_category' => $this->request_data->id_category,
							'price_formula' => $this->request_data->price_formula,
							'bgcolor' => $this->request_data->bgcolor,
							'txtcolor' => $this->request_data->txtcolor,
							'active' => 1,
							'user_id' => Auth::user()->id
						);
						break;
					case 'api/put/update/offer':
						$properties = array('title','body','price','id_currency','id_category','bgcolor','txtcolor','active');
						$data['data'] = array();
						foreach ($properties as $prop) {
							if($this->request_data->has($prop)){
								$data['data'][$prop] = $this->request_data->$prop;
							}
						}
						$data['where'] = array(
							'id_offer' => $this->request_data->id_offer
						);
						break;
				}
			}

			else if($this->request_data->method() == 'POST'){
				$data['where'] = array(
					'id_offer' => $this->request_data->id_offer
				);
			}
		}
		return $data;
	}

	public function validateRequest() : array {
		if($this->type=='offer-user-currency-category'){
			return array();
		}
		else if($this->request_data->path()=='api/delete/offer'){
			$validator = Validator::make($this->request_data->all(), [
	        	'id_offer' => 'required'
	    	]);
		}
		else{
			$validator = Validator::make($this->request_data->all(), [
		        'title' => 'required',
		        'body' => 'required',
		        'price' => ['required','regex:/^\d{1,30}((\,|\.)\d{2})?$/'],
		        'id_currency' => 'required',
		        'id_category' => 'required'
	    	]);
		}
		$errors = array();
	    if ($validator->fails())
	    {
	       $errors = $validator->errors()->all();
    	}
    	return $errors;
	}
}