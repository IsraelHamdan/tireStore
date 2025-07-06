<?php

namespace App\services;

use App\DTOs\Product\CreateProductDTO;
use App\DTOs\Product\ProductResponseDTO;
use App\repositories\ProductRepository;

class ProductService
{
    private  ProductRepository $repository;
    public function __construct(ProductRepository $repository)
    {
        $this->repository = $repository;
    }

    public function create(CreateProductDTO $dto): ProductResponseDTO
    {

    }
}
