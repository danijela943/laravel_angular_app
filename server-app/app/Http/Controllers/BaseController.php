<?php

namespace App\Http\Controllers;
use \App\Services\BaseService;
use Illuminate\Http\Request;
use \Illuminate\Http\JsonResponse;
class BaseController extends Controller
{
    private $service;
    private $allowed = array('get'=>array('currency','types','menu','category'));

    public function __construct(BaseService $service){
        $this->service = $service;
    }

    public function get($type, Request $request) : JsonResponse {
        if(!in_array($type, $this->allowed['get'])){
            $this->middleware('auth');
        }
    	$result = $this->service->getFromDb($type, $request);
    	return response()->json($result, $result['status']);
    }

    public function save($type, Request $request) : JsonResponse {
    	$result = $this->service->storeToDb($type, $request);
        return response()->json($result, $result['status']);
    }

    public function update($type, Request $request) : JsonResponse {
        $result = $this->service->updateDb($type, $request);
        return response()->json($result, $result['status']);
    }

    public function delete($type, Request $request) : JsonResponse{
        $result = $this->service->deleteFromDb($type, $request);
        return response()->json($result, $result['status']);
    }
}
