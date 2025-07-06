<?php

namespace App\DTOs\Product;

class CreateProductDTO
{
    public function __construct(

        public string $name,
        public float $valor,
    ) {}
}
