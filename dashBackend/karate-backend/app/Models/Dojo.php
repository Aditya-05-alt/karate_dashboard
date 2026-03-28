<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dojo extends Model
{
    use HasFactory;

    // Make sure 'instructor_id' is REMOVED from this list if it's still there
    protected $fillable = [
        'name',
        'phone',
        'status',
        'address',
        'location_url',
        'image',
    ];

    // THIS IS THE FIX: Plural 'instructors' and 'belongsToMany'
    public function instructors()
    {
        return $this->belongsToMany(Instructor::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}