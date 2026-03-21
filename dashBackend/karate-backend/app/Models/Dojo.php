<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Dojo extends Model
{
    protected $fillable = ['name', 'instructor_id', 'phone', 'status', 'address', 'location_url', 'image'];

    // A Dojo has many Students
    public function students()
    {
        return $this->hasMany(Student::class);
    }

    // A Dojo belongs to an Instructor
    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }
}