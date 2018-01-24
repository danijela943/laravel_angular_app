<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StatusModel extends BaseModel
{
    protected $table = 'status';
    public $timestamps = false;
    protected $fillable = ['name','class'];
}
