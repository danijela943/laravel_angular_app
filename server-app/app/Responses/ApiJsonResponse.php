<?php

namespace App\Responses;
use \Illuminate\Support\Collection;
use \Illuminate\Http\JsonResponse;
/**
 * summary
 */
class ApiJsonResponse
{
    /**
     * summary
     */
    private $response = array();
    public function createResponse($data = null, $message = null) : array {
        if(!empty($data)){
            $this->response['data'] = $data;
        }
        if(!empty($message)){
            $this->response['message'] = $message;
        }
        $this->response['status'] = 200;
    	return $this->response;
    }

    public function createErrorResponse(int $code, $data = null) : array {
    	$message = '';
    	switch($code){
    		case 404: 
    			$message = 'Requested route or page is not found.';
    			break;
    		case 400:
    			$message = 'Bad request. Wrong number of parameters.';
                break;
            case 500:
                $message = 'Sorry. Something went wrong on server.';
                break;
    	}
        if(!empty($data)){
            $this->response['errors'] = $data;
        }
        $this->response['message'] = $message;
        $this->response['status'] = $code;
    	return $this->response;
    }

}
