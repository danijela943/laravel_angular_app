<?php

namespace App\Requests;
use \App\Requests\BaseRequest;
use \Illuminate\Http\Request;
use \Illuminate\Support\Facades\Auth;
use \Illuminate\Support\Facades\Validator;
class TaskRequest extends BaseRequest
{
	public function __construct(Request $request_data = null, $type = null){
		parent::__construct($request_data, $type);
	}

	public function fetchRequest() : array {
		$data = array();
		if(!empty($this->request_data)){
			if($this->request_data->method() == 'PUT'){
				switch($this->request_data->path()){
					case 'api/put/update/task':
						$data['data'] = array();
						$data['where'] = array('id_task'=>$this->request_data->id_task);
						if($this->request_data->has('id_status')){
							$data['data']['id_status'] = $this->request_data->id_status;
						}
						if($this->request_data->has('comment')){
							$data['data']['comment'] = $this->request_data->comment;
						}
						break;
					case 'api/put/save/task':
						$params = array('title_task','id_status','id_offer','deadline','price');
						foreach ($params as $param) {
							$data[$param] = $this->request_data->$param;
						}
						$data['body_task'] = json_encode($this->request_data->body_task);
						$data['id_creator'] = Auth::user()->id;
						break;
				}
				
			}
			else if($this->request_data->method() == 'GET'){
				switch($this->type){
					case 'task-status-user-offers':
						$data = array(
							'offers.user_id'=> Auth::user()->id 
						);
				}
			}
		}
		return $data;
	}
	public function validateRequest() : array {
		return array();
	}
}