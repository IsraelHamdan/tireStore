<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});



// Página de cadastro de usuário (frontend)
Route::get('/usuarios/cadastro', function () {
    return view('cadastroUsuario');  // resources/views/cadastroUsuario.blade.php
})->name('users.front.cadastro');

// Página de busca de usuário (frontend)
Route::get('/usuarios/busca', function () {
    return view('buscaUsuario'); // resources/views/buscaUsuario.blade.php
})->name('users.front.busca');

// Página de cadastro de produto
Route::get('/produtos/cadastro', function () {
    return view('cadastroProduto');
})->name('products.front.cadastro');

// Página de busca de produto
Route::get('/produtos/busca', function () {
    return view('buscaProduto');
})->name('products.front.busca');

// Página de cadastro de venda
Route::get('/vendas/cadastro', function () {
    return view('cadastroVenda');
})->name('vendas.front.cadastro');

// Página de busca de venda
Route::get('/vendas/busca', function () {
    return view('buscaVenda');
})->name('vendas.front.busca');


