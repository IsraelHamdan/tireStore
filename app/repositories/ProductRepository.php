<?php

namespace App\repositories;

use App\DTOs\Product\CreateProductDTO;
use App\DTOs\Product\ProductResponseDTO;
use App\DTOs\Product\UpdateProductDTO;
use App\Helpers\Helpers;
use App\Models\Produto;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProductRepository
{
    public function all()
    {
        return Produto::all();
    }

    public function findById(string $id): Produto
    {
        return Produto::findOrFail($id);
    }

    public function create(array $data): Produto
    {
        return Produto::create([
            'nome' => $data['nome'],
            'valor' => $data['valor'],
        ]);
    }

    public function update(string $id, UpdateProductDTO $dto): Produto
    {
        $product = Produto::findOrFail($id);
        $product->update([
            'name' => $dto->nome,
            'valor' => $dto->valor,
        ]);
        return $product;
    }

    public function searchByName(string $nome): array
    {
        $product = Produto::where('nome', 'ILIKE', "%$nome%")->get()->all();
        return $product->map(fn($product) => Helpers::fromProductModel($product))->all();
    }

    public function deleteProduct(string $id):void
    {
        $product = Produto::findOrFail($id);
        $product->delete();
    }

}
