<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
    {
        Schema::create('dojos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            
            // The crucial foreign key for the instructor
            $table->foreignId('instructor_id')->nullable()->constrained('instructors')->onDelete('set null');
            
            $table->string('phone')->nullable();
            $table->string('status')->default('Active');
            $table->string('address')->nullable();
            $table->text('location_url')->nullable(); // Using text() because URLs can be long
            $table->text('image')->nullable();        // Using text() for image URLs too
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dojos');
    }
};
