<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Login Required)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Test route to get current user info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // We will add Student/Dojo routes here later
    // Route::apiResource('students', StudentController::class);
});
