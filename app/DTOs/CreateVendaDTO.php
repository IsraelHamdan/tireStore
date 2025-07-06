<?php

namespace App\DTOs;

class CreateVendaDTO
{
    /**
     * @param string[] $vencimento_parcelas Array com as datas de vencimento. Ex: ["2025-08-08", "2025-09-08"]
     */
    public function __construct(
        public string $produto_id,
        public string $user_id,
        public float  $valor_total,
        public int $qtd_produto,
        public string $pagamento,
        public int $parcelas,
        public array $vencimento_parcelas
    ) {}
}
