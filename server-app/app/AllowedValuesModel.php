<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AllowedValuesModel extends BaseModel
{
    protected $table = 'allowed_values';
    protected $fillable = ['value','id_form_element'];

 
}
