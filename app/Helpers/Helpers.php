<?php

namespace App\Helpers;


use App\DTOs\Product\ProductResponseDTO;
use App\DTOs\User\UserResponseDTO;
use App\DTOs\Vendas\VendaResponseDTO;
use App\Models\Produto;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class Helpers
{
    public static function fromUserModel(User $user): UserResponseDTO
    {
        if (!$user->id || !$user->name) {
            Log::error('Usuário incompleto ao montar DTO', [
                'user' => $user,
            ]);
        }
        return new UserResponseDTO(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            cpf: $user->cpf,
            created_at: $user->created_at->toISOString(),
            updated_at: $user->updated_at->toISOString(),
        );
    }
    public static function fromUserModelArray(array $user): array
    {
        return array_map(function($item){
            return self::fromUserModel($item);
        }, $user);
    }

    public static function fromProductModel(Produto $produto): ProductResponseDTO
    {
        return new ProductResponseDTO(
            id: $produto->id,
            nome: $produto->nome,
            valor: $produto->valor,
            created_at: $produto->created_at->toISOString(),
            updated_at: $produto->updated_at->toISOString(),
        );
    }

    public static function fromProductModelArray(array $produto): array
    {
        return array_map(function($item){
            return self::fromProductModel($item);
        }, $produto);
    }

//    public  static function fromVendasModel(VendaResponseDTO $venda)
//    {
//        return new VendaResponseDTO(
//            id: $venda->id,
//            id_prodto
//        )
//    }
}

