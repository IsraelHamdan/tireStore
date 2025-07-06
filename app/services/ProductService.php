<?php

namespace App\services;

use App\DTOs\Product\CreateProductDTO;
use App\DTOs\Product\ProductResponseDTO;
use App\Models\Produto;
use Illuminate\Database\QueryException;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Validation\ValidationException;

class ProductService
{
    /**
     * @throws ValidationException
     */
    public function create(CreateProductDTO $dto): Produto
    {
        try {
            $data = get_object_vars($dto);
            $validator = Validator::make($data, [
                'name' => ['required', 'string', 'max:255'],
                'valor' => ['required', 'numeric'],
            ]);
            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            $product = Produto::create($validator->validated());
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

    public function deleteProduct(string $id): void
    {
       $product = $this->findById($id);
       $product->delete();
    }
}
