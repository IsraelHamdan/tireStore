<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::prefix('user')->group(function () {
    Route::post('/create', [UserController::class, 'createUser'])->name('user.create');

    Route::patch('/updateUser/{id}', [UserController::class, 'updateUser']);
    Route::delete('deleteUser/{id}', [UserController::class, 'deleteUser']);

    Route::get('/findAll', [UserController::class, 'findAll']);
    Route::get('findById/{id}', [UserController::class, 'findById']);
    Route::get('/findByName/{name}', [UserController::class, 'searchByName']);
});
