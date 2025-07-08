<?php

namespace App\DTOs;

class CreateVendaDTO
{
    /**
     * @param array $vencimento_parcelas Array com a estrutura [['data' => 'dd/mm/yyyy', 'valor' => '250.00'], ...]
     */
    public function __construct(
        public string $produto_id,
        public string $user_id,
        public float  $valor_total,
        public int $qtd_produto,
        public float $valor_unitario_produto,
        public string $pagamento,
        public int $parcelas,
        public array $vencimento_parcelas
    ) {}
}
