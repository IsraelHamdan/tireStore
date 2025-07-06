<?php

namespace App\DTOs\Product;

class UpdateProductDTO
{
    public  function  __construct(
        public ?string $name,
        public ?float $valor,
    )
    {}
}
