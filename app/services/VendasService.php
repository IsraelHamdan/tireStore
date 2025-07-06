<?php

namespace App\services;

use App\DTOs\CreateVendaDTO;
use App\Models\Venda;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;


class VendasService
{
    public  function createVenda(CreateVendaDTO $dto): Venda
    {
        try {
            $data = get_object_vars($dto);

            $validator = Validator::make($data, [
                'produto_id' => ['required', 'string', 'exists:produtos,id'],
                'user_id' => ['required', 'string', 'exists:users,id'],
                'valor_total' => ['required', 'numeric', 'min:0'],
                'qtd_produto' => ['required', 'integer', 'min:0'],
                'pagamento' => ['required', 'string'],
                'parcelas'=> ['required', 'integer', 'min:0'],
                'vencimento_parcelas'=> ['required', 'array'],
                'vencimento_parcelas.*' => ['required', 'date_format:d/m/Y']
            ]);

            if($validator->fails()) {
                throw new ValidationException($validator);
            }

            $venda = Venda::create($validator->validated());;

            Log::info('Venda criada', [
                'id' => $venda->id,
                'user_id' => $venda->user_id,
                'product_id' => $venda->product_id,
                'valor_total' => $venda->valor_total,
                'qtd_produto' => $venda->qtd_produto,
                'pagamento' => $venda->pagamento,
                'parcelas'=> $venda->parcelas,
                'vencimento_parcelas'=> $venda->vencimento_parcelas,
                'created_at' => $venda->created_at,
                'updated_at' => $venda->updated_at,
            ]);

            return $venda;
        } catch (QueryException $e) {
            if($e->getCode() === '23505') {
                throw new HttpException($e->getCode(), "{$e->getMessage()}", "{$e->getPrevious()}");
            }
            Log::error('Erro ao criar produto', [
                'message' => $e->getMessage(),
                'errorInfo' => $e->errorInfo,
            ]);
            throw $e;
        } catch (ValidationException $e) {
            throw new HttpException($e->getCode(), "{$e->getMessage()}", "{$e->getPrevious()}");
        }
    }

    public function findAll(): array
    {
        try {
            return Venda::all()->toArray();
        } catch (HttpException $e) {}
    }

    public function findById(string $id): Venda
    {
        return Venda::findOrFail($id);

    }
}
