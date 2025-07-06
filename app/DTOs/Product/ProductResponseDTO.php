<?php

namespace App\DTOs\Product;

class ProductResponseDTO
{
    public function __construct(
        public string $id,
        public string $nome,
        public float $valor,
        public string $created_at,
        public string $updated_at,
    )
    {}
}
