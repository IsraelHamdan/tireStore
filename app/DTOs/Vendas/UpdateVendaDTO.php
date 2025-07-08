<?php

namespace App\DTOs\Vendas;

class UpdateVendaDTO
{
    public function __construct(
        public ?string $produto_id,
        public ?string $user_id,
        public ?float $valor_total,
        public ?int $qtd_produto,
        public ?float $valor_unitario_produto,
        public ?string $pagamento,
        public ?int $parcelas,
        public ?array $vencimento_parcelas,
    ){}
}
