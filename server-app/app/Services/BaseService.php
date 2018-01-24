<?php

namespace App\Services;

/**
 * summary
 */
use Illuminate\Http\Request;
use \App\Repositories\BaseRepository;
use \Illuminate\Http\JsonResponse;
use \App\Responses\ApiJsonResponse;
use \App\Requests\OfferRequest;

class BaseService
{
    private $repository;
	private $responser;

    public function __construct(){
    	$this->repository = new BaseRepository;
    	$this->responser = new ApiJsonResponse;
    }

    public function setRepository(BaseRepository $repository){
    	$this->repository = $repository;
    }

    public function getFromDb($type, $param = null) : array {
    	$error = $this->repository->setByType($type, $param);
    	if($error){
    		return $this->responser->createErrorResponse(404);
    	}
        if(!empty($this->repository->getRequest())){
            $requestObserver = $this->repository->getRequest();
            $errors = $requestObserver->validateRequest();
            if(count($errors)>0){
                return $this->responser->createErrorResponse(400, $errors);
            }
        }
        $result = null;
        try{
    	   $result = $this->repository->find($param->all());
           if(empty($result)){
                return $this->responser->createErrorResponse(400);
           }
           return $this->responser->createResponse($result);
        }
        catch (\Illuminate\Database\QueryException $q){
            return $this->responser->createErrorResponse(400, $q);
        }
    }

    public function storeToDb($type, Request $request) : array {
    	$error = $this->repository->setByType($type, $request);
    	if($error){
    		return $this->responser->createErrorResponse(404);
    	}
    	$requestObserver = $this->repository->getRequest();
		$errors = $requestObserver->validateRequest();
        if(count($errors)>0){
            return $this->responser->createErrorResponse(400, $errors);
        }
        try{
    		$addedObj = $this->repository->create();
   		if(!empty($addedObj)){
    			return $this->responser->createResponse($addedObj,'You added item successfully.');
    		}
    		else{
    			return $this->responser->createErrorResponse(500);
    		}
        }
    	catch (\Illuminate\Database\QueryException $q){
    		return $this->responser->createErrorResponse(400, $q);
    	}
    }

    public function updateDb($type, Request $request) : array {
        $error = $this->repository->setByType($type, $request);
        if($error){
            return $this->responser->createErrorResponse(404);
        }
        $requestObserver = $this->repository->getRequest();
        if(!empty($this->repository->getRequest())){
            $requestObserver = $this->repository->getRequest();
            $errors = $requestObserver->validateRequest();
            if(count($errors)>0){
                return $this->responser->createErrorResponse(400, $errors);
            }
            $updatedObj = $this->repository->update();
            if(!empty($updatedObj)){
                return $this->responser->createResponse($updatedObj,'You successfully updated item.');
            }
            else{
                return $this->responser->createResponse(null,"You didnt change anything.");
            }
        }
        else{
            return $this->responser->createErrorResponse(400);
        }
    }

    public function deleteFromDb($type, Request $request){
        $error = $this->repository->setByType($type, $request);
        if($error){
            return $this->responser->createErrorResponse(404);
        }
        $requestObserver = $this->repository->getRequest();
        if(!empty($this->repository->getRequest())){
            $requestObserver = $this->repository->getRequest();
            $errors = $requestObserver->validateRequest();
            if(count($errors)>0){
                return $this->responser->createErrorResponse(400, $errors);
            }
            $updatedObj = $this->repository->delete();
            if(!empty($updatedObj)){
                return $this->responser->createResponse($updatedObj,'You successfully deleted item.');
            }
            else{
                return $this->responser->createErrorResponse(500);
            }
        }
        else{
            return $this->responser->createErrorResponse(400);
        }
    }
}
