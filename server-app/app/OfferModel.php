<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use \App\BaseModel;
class OfferModel extends BaseModel
{
    protected $table = 'offers';
    public $timestamps = true;
    protected $fillable = ['title','body','price','id_currency','bgcolor','active','user_id','id_category','txtcolor'];

    public $relationships = array(
    	"currency"=>array('table'=>'currency', 'relate'=>array('currency.id_currency', 'offers.id_currency')),
    	"category" => array('table'=>'categories', 'relate' => array('categories.id_category','offers.id_category'))
    );
    public function user(){
    	return $this->belongsTo('App\User');
    }

}
