<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use \App\Http\Controllers\Api\DojoController;
use App\Http\Controllers\Api\InstructorController;

Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Login Required)
Route::middleware('auth:sanctum')->group(function () {
   
    
    // logout 
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Test route to get current user info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Users Logged in 
   Route::apiResource('users', UserController::class);
   
   // Dojos 
    Route::apiResource('dojos', DojoController::class);
   
    // Instructors
    Route::apiResource('instructors', InstructorController::class);
});
