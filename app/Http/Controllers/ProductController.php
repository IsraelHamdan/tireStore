<?php

namespace App\Http\Controllers;

use App\DTOs\Product\CreateProductDTO;

use App\DTOs\Product\UpdateProductDTO;
use App\Models\Produto;
use App\services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    private ProductService $productService;
    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * @throws ValidationException
     */
    public  function createProduct(Request $request): JsonResponse
    {
        Log::info('Product creation request received', [
            'name'=>$request->name,
            'valor'=>$request->valor
        ]);

        $validated = $request->validate([
            'name'=> 'required|string|max:255',
            'valor'=> 'required|numeric'
        ]);

        $dto = new CreateProductDTO(
            name: $validated['name'],
            valor: $validated['valor'],
        );
        $productResponse = $this->productService->create($dto);
        return response()->json($productResponse, 201);
    }

    public function findById(Request $request, string $id):JsonResponse
    {
        $product = $this->productService->findById($id);
        return response()->json($product, 200);
    }

    public function findAll(Request $request):JsonResponse
    {
        $products = $this->productService->findAll();
        return response()->json($products, 200);
    }

    public function updateProduct(Request $request, string $id):JsonResponse
    {
        echo $request->name;
        $validated = $request->validate([
            'name'=> 'sometimes|string|max:255',
            'valor'=> 'sometimes|numeric'
        ]);

        $updateData = $this->productService->updateProduct($id, (array) $validated);
        return response()->json($updateData, 200);
    }

    public function deleteProduct(Request $request, string $id):JsonResponse
    {
        $product = $this->productService->deleteProduct($id);
        return response()->json($product, 200);
    }

}
