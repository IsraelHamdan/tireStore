<?php

namespace App\services;

use App\DTOs\CreateVendaDTO;
use App\DTOs\Vendas\UpdateVendaDTO;
use App\Models\Venda;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Database\Eloquent\Collection;

class VendasService
{
    /**
     * Valida os dados de uma venda para criação ou atualização.
     *
     * @param CreateVendaDTO|UpdateVendaDTO $data
     * @return array Os dados validados.
     * @throws ValidationException
     */

    private function validateVenda(CreateVendaDTO | UpdateVendaDTO $dto): array
    {
        $data = array_filter(get_object_vars($dto), fn($value) => !is_null($value));
        $ruleType = ($dto instanceof CreateVendaDTO) ? 'required' : 'sometimes|required';

        $rules = [
            'produto_id' => "$ruleType|string|exists:produtos,id",
            'user_id' => "$ruleType|string|exists:users,id",
            'valor_total' => "$ruleType|numeric|min:0",
            'qtd_produto' => "$ruleType|integer|min:1",
            'pagamento' => "$ruleType|string",
            'parcelas' => "$ruleType|integer|min:0",
            'vencimento_parcelas' => $ruleType . '|array',
            'vencimento_parcelas.*.data' => 'required_with:vencimento_parcelas.*|date_format:d/m/Y',
            'vencimento_parcelas.*.valor' => 'required_with:vencimento_parcelas.*|numeric|min:0',

        ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $validator->validated();
    }


    public  function createVenda(CreateVendaDTO $dto): Venda
    {
        try {
            $validatedData = $this->validateVenda($dto);

            $venda = Venda::create($validatedData);;

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
            throw new HttpException($e->getCode(), $e->getMessage(), $e->getPrevious());
        }
    }

    public function findAll(): array
    {
        try {
            return Venda::all()->toArray();
        } catch (HttpException $e) {
            throw new HttpException($e->getCode(), "{$e->getMessage()}", "{$e->getPrevious()}");
        }
    }

    public function findById(string $id): Venda
    {
        return Venda::findOrFail($id);

    }

            /**
             * Encontra todas as vendas de um usuário específico.
             *
             * @param string $user_id O ID do usuário.
             * @return \Illuminate\Database\Eloquent\Collection Retorna uma coleção de vendas.
             * @throws NotFoundHttpException Se o usuário não for encontrado.
             */
        public function updateVenda(string $id, UpdateVendaDTO $data): Venda
        {
            try {
                $venda = $this->findById($id);

                $validatedData = $this->validateVenda($data);
                if(empty($validatedData)) return $venda;

                $venda->update($validatedData);
                return $venda;
            } catch (QueryException $e) {
                throw new HttpException($e->getCode(), "{$e->getMessage()}", "{$e->getPrevious()}");

            } catch (NotFoundHttpException $e) {
                throw new NotFoundHttpException("{$e->getMessage()}", $e->getCode());
            }
        }


    public function findByUser(string $user_id): Collection
    {
        try {
            return Venda::where('user_id', $user_id)->get();
        } catch (NotFoundHttpException $e) {
            throw new NotFoundHttpException("{$e->getMessage()}", $e->getCode());
        } catch (QueryException $e) {
            throw new HttpException($e->getCode(), "{$e->getMessage()}", );
        }
    }

    public function deleteVenda(string $id): void
    {
        try {
            $venda = $this->findById($id);
            $venda = Venda::destroy($id);;
        } catch (QueryException $e) {
            throw new HttpException($e->getCode(), "{$e->getMessage()}", "{$e->getPrevious()}");
        }
    }



}
