<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::prefix('user')->group(function () {
    #              prefix                    método do controller
    Route::post('/create', [UserController::class, 'createUser']);
    Route::get('/{id}', [UserController::class, 'findById']);
    Route::patch('/find/{id}', [UserController::class, 'updateUser']);
    Route::delete('/{id}', [UserController::class, 'deleteUser']);
    Route::get('/findAll', [UserController::class, 'findAll']);
    Route::get('/findByName/{name}', [UserController::class, 'searchByName']);
});
