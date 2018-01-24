<?php

namespace App;
use \App\BaseModel;
use Illuminate\Database\Eloquent\Model;

class FormModel extends BaseModel
{
	protected  $table = 'forms';
    public $timestamps = false;
    protected $fillable = ['id_user','title','id_offer','active'];
    protected $primaryKey = 'id_form';
    public function formElement(){
    	return $this->hasMany('App\FormElementModel', 'id_form','id_form');
    }
    public $relationships = array(
    	//"type" => array('table'=>'types', 'relate'=>array('types.id_type','form_elements.id_type')),
    	"allowed" => array('table'=>'allowed_values', 'relate'=>array('allowed_values.id_form_element','form_elements.id_form_element'))
    );
}
