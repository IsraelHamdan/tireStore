<?php

namespace App\DTOs\Product;

class UpdateProductDTO
{
    public  function  __construct(

        public ?string $nome,
        public ?float $valor,
    )
    {}
}
