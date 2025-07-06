<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('product')->group(function () {
    Route::post('/create', [ProductController::class, 'createProduct']);
});
