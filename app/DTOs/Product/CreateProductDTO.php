<?php

namespace App\DTOs\Product;

class CreateProductDTO
{
    public function __construct(
        public string $id,
        public string $nome,
        public float $valor,
    ) {}
}
