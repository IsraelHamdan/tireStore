<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VendaController;
use Illuminate\Support\Facades\Route;

// User routes
use App\Http\Controllers\UserController;

Route::prefix('user')->group(function () {
    Route::post('/create', [UserController::class, 'createUser'])->name('user.create');

    Route::patch('/updateUser/{id}', [UserController::class, 'updateUser']);
    Route::delete('deleteUser/{id}', [UserController::class, 'deleteUser']);

    Route::get('/findAll', [UserController::class, 'findAll']);
    Route::get('findById/{id}', [UserController::class, 'findById']);
    Route::get('/findByName/{name}', [UserController::class, 'searchByName']);

});


// Product Routes
use App\Http\Controllers\ProductController;
Route::prefix('product')->group(function () {
    Route::post('/create', [ProductController::class, 'createProduct']);
    Route::get('/findById/{id}', [ProductController::class, 'findById']);
    Route::get('/findAll', [ProductController::class, 'findAll']);
    Route::patch('/updateProduct/{id}', [ProductController::class, 'updateProduct']);
    Route::delete('/deleteProduct/{id}', [ProductController::class, 'deleteProduct']);
    Route::get('/findByName/{name}', [ProductController::class, 'findByName']);
});


// Vendas routes
Route::prefix('vendas')->group(function () {
    Route::post('/createVenda', [VendaController::class, 'createVenda']);
    Route::get('/findAll', [VendaController::class, 'findAll']);
    Route::get('/findById/{id}', [VendaController::class, 'findById']);
    Route::get('/findByUser/{id}', [VendaController::class, 'findByUser']);
    Route::patch('/updateVenda/{id}', [VendaController::class, 'updateVenda']);
    Route::delete('/deleteVenda/{id}', [VendaController::class, 'deleteVenda']);
});


// AuthRoutes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
});

