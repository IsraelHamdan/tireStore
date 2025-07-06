<?php

use App\Http\Controllers\VendaController;
use Illuminate\Support\Facades\Route;

Route::prefix('vendas')->group(function () {
    Route::post('/createVenda', [VendaController::class, 'createVenda']);

});
