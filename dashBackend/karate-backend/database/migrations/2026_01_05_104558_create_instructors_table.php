<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('instructors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('rank');
            $table->integer('age');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('status'); // e.g., 'Active'
            $table->text('image');    // URL for profile image
            $table->date('dob');      // Date of Birth
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('instructors');
    }
};