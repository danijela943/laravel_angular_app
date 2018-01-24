<?php

namespace App\Repositories;
use App\BaseModel;
use \App\Requests\BaseRequest;
use \Illuminate\Support\Facades\DB;
/**
 * summary
 */
class BaseRepository
{
	private $model;
	private $request;
    private $type;
    private $apiResult = []; 
	public function __construct(){
	}

	public function setModel(BaseModel $model){
		$this->model = $model;
	}

    public function getModel(){
        return $this->model;
    }

    public function getRequest(){
        return $this->request;
    }

	public function setRequest(BaseRequest $request){
        $this->request = $request;
    }

	public function setByType($type, $request = null){
		$error = false;
    	switch($type){
    		case 'currency': 
    			$this->setModel(new \App\CurrencyModel);
    			break;
            case 'category':
                $this->setModel(new \App\CategoryModel);
                break;
    		case 'menu':
    			$this->setModel(new \App\MenuModel);
    			break;
            case 'status':
                $this->setModel(new \App\StatusModel);
                break;
    		case in_array($type, array('offer','offer-user-currency-category')):
    			$this->setModel(new \App\OfferModel);
                $this->setRequest(new \App\Requests\OfferRequest($request,$type));
    			break;
            case 'type':
                $this->setModel(new \App\TypeModel);
                break;
            case in_array($type, array('form','form-formElement')):
                $this->setModel(new \App\FormModel);
                $this->setRequest(new \App\Requests\FormRequest($request,$type));
                break;
            case in_array($type, array('formElement', 'formElement-allowed-type','formElement-allowed')):
                $this->setModel(new \App\FormElementModel);
                $this->setRequest(new \App\Requests\FormElementRequest($request,$type));
                break;
            case 'allowedValues':
                $this->setModel(new \App\AllowedValuesModel);
                $this->setRequest(new \App\Requests\AllowedValuesRequest($request,$type));
                break;
            case in_array($type, array('task','task-status-user-offers')):
                $this->setModel(new \App\TaskModel);
                $this->setRequest(new \App\Requests\TaskRequest($request,$type));
                break;
    		default:
    			$error = true;
    			break;
    	}
        $this->type = $type;
    	return $error;
	}

    public function find($param = null){
        $result = null;
        if(strpos($this->type,'-')!==false){
                $result =  $this->joins();
        }
        if(!empty($param)){
            $whereParams = $this->request->fetchRequest();
            if(count($whereParams) == 0) return null;
            $result = $this->where($result, $whereParams);
        }
    	return (!empty($result)) ? $result->get() : $this->model::all();
    }

    public function create(){
        $data = $this->request->fetchRequest();
        if(count($data) != count($data, COUNT_RECURSIVE)){ // array is multidimensional - like form_element has few allowed_values
            foreach ($data as $insertData) {
                $this->apiResult[] = $this->model::create($insertData);
            }
        } else{
            $this->apiResult[] = $this->model::create($data);
        }
        if(count($this->model->referenceCreate)>0 && $this->request->hasCallback) {
            $idReference = $this->apiResult[0]->id;
            foreach ($this->model->referenceCreate as $reference) {
                $this->setByType($this->model->referenceCreate[0], $this->request->getRequestData());
                $this->request->setReferenceValue($idReference);
                $this->create();
            }
        }
        return $this->apiResult;
    }

    public function update()
    {
        $data = $this->request->fetchRequest();
        $result = $this->where(null,$data['where']);
        if(!empty($result)){
            $result = $result->update($data['data']);
        }
        return $result;
    }

    public function delete()
    {
        $data = $this->request->fetchRequest();
        $result = $this->where(null, $data['where']);
        if(!empty($result)){
            $result = $result->delete();
        }
        return $result;
    }

    private function joins(){
        $joins = explode('-',$this->type);
        $query =  $this->model::with($joins[1]);
        for($i=2; $i < count($joins); $i++) {
            $query = $query->join($this->model->relationships[$joins[$i]]['table'], $this->model->relationships[$joins[$i]]['relate'][0],'=',$this->model->relationships[$joins[$i]]['relate'][1]);
            
        }
        return $query;
    }

    private function where($query, $param){
        $q = $query;
        foreach ($param as $key=>$value){
            if(is_array($value)){
                //foreach ($value as $v) {

                    if(empty($q)){
                        $q = $this->model::whereIn($this->model->getTableName().'.'.$key, $value);
                    }else{
                        $q = $q->whereIn($this->model->getTableName().'.'.$key,$value);
                    }
                //}
            }
            else{
                if(empty($q)){
                        $q = $this->model::where($this->model->getTableName().'.'.$key,'=',$value);
                    }else{
                        $q = $q->where($this->model->getTableName().'.'.$key,'=',$value);
                    }
            }
        }
        return $q;
    }
}
