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
            Schema::create('dojos', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('instructor');
                $table->string('phone');
                
                // --- ALL THESE MUST BE HERE ---
                $table->integer('students')->default(0);      // If this is missing -> 500 Error
                $table->string('status')->default('Active');
                $table->text('address')->nullable();          // If this is missing -> 500 Error
                $table->text('location_url')->nullable();     // If this is missing -> 500 Error
                $table->string('image')->nullable();
                
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
