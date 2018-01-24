<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TaskModel extends BaseModel
{
    protected $table = 'tasks';
    public $timestamps = true;
    protected $fillable = ['title_task','body_task','id_status','id_offer','deadline','price','id_creator','comment'];
    public $relationships = array(
    	"user" => array('table'=>'users', 'relate'=>array('users.id','tasks.id_creator')),
    	"offers" => array('table'=>'offers', 'relate'=>array('offers.id_offer','tasks.id_offer'))
    );

    public function status(){
    	return $this->belongsTo('App\StatusModel','id_status','id_status');
    }
}
