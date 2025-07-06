<?php

namespace App\services;

use App\DTOs\Product\CreateProductDTO;
use App\DTOs\Product\ProductResponseDTO;
use App\Models\Produto;
use App\repositories\ProductRepository;
use Illuminate\Database\QueryException;

use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use function PHPUnit\Framework\throwException;

class ProductService
{
    public function create(CreateProductDTO $dto): Produto
    {
        try {
            $product = Produto::create([
                'name' => $dto->name,
                'valor' => $dto->valor,
            ]);
            Log::info('Product created', [
                'id' => $product->id,
                'name' => $product->name,
                'valor'=> $product->valor,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ]);
            return $product;
        } catch (QueryException $e) {
            Log::error('Erro ao criar produto', [
                'message' => $e->getMessage(),
                'errorInfo' => $e->errorInfo,
            ]);
            if ($e->getCode() === '23505') {
                throw new HttpException($e->getCode(), 'Usuário já criado', $e->getPrevious());
            }

            throw $e;
        }
    }

    public function findById(string $id): Produto
    {
        return Produto::findOrFail($id);
    }

    public function findAll(): array
    {
        try {
            return Produto::all()->toArray();

        } catch (NotFoundHttpException $e) {
            throw new NotFoundHttpException('Products not found');
        } catch (QueryException $e) {
            Log::error('Erro ao buscar produtos', [], $e->getMessage());
            throw new HttpException($e->getCode(), 'Internal server error', $e->getPrevious());
        }

    }

    public function updateProduct(string $id, array $data): Produto
    {
        $product = $this->findById($id);
        $product->update($data);
        return $product;
    }
}
