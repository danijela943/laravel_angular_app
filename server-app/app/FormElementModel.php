<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FormElementModel extends BaseModel
{
    protected $table = 'form_elements';
    protected $fillable = ['label','id_type','required','allowed_values','id_form'];
    public $referenceCreate = array("allowedValues");
 
 	public $relationships = array(
    	"type" => array('table'=>'types', 'relate'=>array('types.id_type','form_elements.id_type')),
    	"allowed" => array('table'=>'allowed_values', 'relate'=>array('allowed_values.id_form_element','form_elements.id_form_element'))
    );

    public function allowed(){
    	return $this->hasMany('App\AllowedValuesModel','id_form_element','id_form_element');
    }
}
