<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('rank')->default('White');
            $table->date('dob');
            $table->string('phone')->nullable();
            $table->integer('age')->nullable();
            $table->string('status')->default('Active');
            
            // Assuming you have dojos and instructors tables
            $table->foreignId('dojo_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('instructor_id')->nullable()->constrained()->onDelete('set null');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
