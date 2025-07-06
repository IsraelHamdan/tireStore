<?php

use App\Http\Controllers\VendaController;
use Illuminate\Support\Facades\Route;

Route::prefix('vendas')->group(function () {
    Route::post('/createVenda', [VendaController::class, 'createVenda']);
    Route::get('/findAll', [VendaController::class, 'findAll']);
    Route::get('/findById/{id}', [VendaController::class, 'findById']);
    Route::get('/findByUser/{id}', [VendaController::class, 'findByUser']);
});
