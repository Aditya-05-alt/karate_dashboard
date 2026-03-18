<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'rank',
        'dob',
        'phone',
        'age',
        'status',
        'dojo_id',
        'instructor_id'
    ];

    // Optional: If you want to fetch the Dojo name with the student
    public function dojo()
    {
        return $this->belongsTo(Dojo::class);
    }

    // Optional: If you want to fetch the Instructor name with the student
    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }
}