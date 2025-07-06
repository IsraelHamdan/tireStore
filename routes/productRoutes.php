<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('product')->group(function () {
    Route::post('/create', [ProductController::class, 'createProduct']);
    Route::get('/findById/{id}', [ProductController::class, 'findById']);
    Route::get('/findAll', [ProductController::class, 'findAll']);
    Route::patch('/updateProduct/{id}', [ProductController::class, 'updateProduct']);
    Route::delete('/deleteProduct/{id}', [ProductController::class, 'deleteProduct']);
    Route::get('/searchByName/{name}', [ProductController::class, 'searchByName']);
});
