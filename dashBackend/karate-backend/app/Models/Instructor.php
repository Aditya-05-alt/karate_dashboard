<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'rank',
        'age',
        'email',
        'phone',
        'status',
        'image',
        'dob'
    ];
    public function dojos()
    {
        return $this->hasMany(Dojo::class);
    }

    // An Instructor has many Students
    public function students()
    {
        return $this->hasMany(Student::class);
    }
}