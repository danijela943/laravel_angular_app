<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\MenuModel;
use \App\Responses\ApiJsonResponse;
class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    private $service;
    private $responser;

    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
    }
}
