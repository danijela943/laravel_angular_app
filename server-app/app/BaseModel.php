<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    public $timestamps = false;
    public $referenceCreate = array();

    public function getTableName(){
    	return $this->table;
    }

    public function getPrimaryKey(){
    	return $this->primaryKey;
    }
}
