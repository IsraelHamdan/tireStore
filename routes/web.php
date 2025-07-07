<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


// Página de busca de usuário (frontend)
Route::get('/usuarios/busca', function () {
    return view('buscaUsuario');
})->name('users.front.busca');




Route::get('/produtos/busca', function () {
    return view('buscaProduto');
})->name('products.front.busca');



// Página de busca de venda
Route::get('/vendas/busca', function () {
    return view('buscaVenda');
})->name('vendas.front.busca');


