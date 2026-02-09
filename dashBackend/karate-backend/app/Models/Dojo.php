<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dojo extends Model
{
    use HasFactory;

    // This array tells Laravel: "It is safe to save these fields"
    protected $fillable = [
        'name',
        'instructor',
        'phone',
        'students',      // <--- Critical addition
        'status',        // <--- Critical addition
        'address',       // <--- Critical addition
        'location_url',  // <--- Critical addition
        'image'
    ];
}