<?php

namespace App\services;

use App\DTOs\Product\CreateProductDTO;
use App\DTOs\Product\ProductResponseDTO;
use App\DTOs\Product\UpdateProductDTO;
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
     * @param CreateProductDTO | UpdateProductDTO $data
     * @return array
     * @throws ValidationException
     */

    private function validateProduct(CreateProductDTO | UpdateProductDTO $dto):array
    {
        $data = array_filter(get_object_vars($dto), fn($value) => !is_null($value));
        $ruleType = ($dto instanceof CreateProductDTO) ? 'required' : 'sometimes|required';
        $rules = [
            'name' => $ruleType . '|string|max:255',
            'valor' => $ruleType . '|numeric',
        ];
        $validator = Validator::make($data, $rules);
        if($validator->fails()) throw  new ValidationException($validator);
        return $validator->validated();
    }


    public function create(CreateProductDTO $dto): Produto
    {
        try {
            $validatedData = $this->validateProduct($dto);

            return Produto::create($validatedData);
        } catch (QueryException $e) {
            Log::error('Erro ao criar produto', [
                'message' => $e->getMessage(),
                'errorInfo' => $e->errorInfo,
            ]);
            if ($e->getCode() === '23505') {
                throw new HttpException($e->getCode(), 'Usuário já criado', $e->getPrevious());
            }

            throw $e;
        } catch (ValidationException $e) {
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

    public function updateProduct(string $id, UpdateProductDTO $data): Produto
    {
        try {
            $validatedData = $this->validateProduct($data);
            $product = $this->findById($id);
            $product->update($validatedData);
            return $product;
        } catch (ValidationException $e) {
            throw new HttpException($e->getCode(), 'Internal server error', $e->getPrevious());
        }

    }

    public function deleteProduct(string $id): void
    {
       $product = $this->findById($id);
       $product->delete();
    }

    public function searchByName(string $nome): array
    {
        try {
            return Produto::where('name', 'ILIKE', "%$nome%")
                ->get()->map(fn($user) => $user->only(['id', 'name', 'email', 'cpf']))
                ->toArray();
        } catch (NotFoundHttpException $exception) {
            throw new HttpException('404', 'User not found');
        } catch (QueryException $e) {
            throw new HttpException('500', 'Internal server error');
        }
    }
}
