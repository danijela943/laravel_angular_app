<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CategoryModel extends BaseModel
{
    protected $table = 'categories';
    protected $fillable = ['category_name'];
}
