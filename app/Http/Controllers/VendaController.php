<?php

namespace App\Http\Controllers;

use App\DTOs\CreateVendaDTO;
use App\DTOs\Vendas\UpdateVendaDTO;
use App\services\VendasService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VendaController extends Controller
{
    private VendasService $vendasService;
    public function __construct(VendasService $vendasService)
    {
        $this->vendasService = $vendasService;
    }

    public function createVenda(Request $request):JsonResponse
    {
        $dto = new CreateVendaDTO(
            produto_id: $request->input('produto_id'),
            user_id: $request->input('user_id'),
            valor_total: (float) $request->input('valor_total'),
            qtd_produto: (int) $request->input('qtd_produto'),
            pagamento: $request->input('pagamento'),
            parcelas: (int) $request->input('parcelas'),
            vencimento_parcelas: $request->input('vencimento_parcelas')
        );

        $venda = $this->vendasService->createVenda($dto);
        Log::info('Venda criada no controller', [
            'id' => $venda->id,
            'user_id' => $venda->user_id,
            'produto_id' => $venda->produto_id,
            'valor_total' => $venda->valor_total,
            'qtd_produto' => $venda->qtd_produto,
            'pagamento' => $venda->pagamento,
            'parcelas'=> $venda->parcelas,
            'vencimento_parcelas'=> $venda->vencimento_parcelas,
            'created_at' => $venda->created_at,
            'updated_at' => $venda->updated_at,
        ]);

        return response()->json($venda, 201);
    }

    public  function  findAll(Request $request):JsonResponse
    {
        $vendas = $this->vendasService->findAll();
        return response()->json($vendas, 200);
    }

    public function findById(Request $request, string $id):JsonResponse
    {
        $venda = $this->vendasService->findById($id);
        return response()->json($venda, 200);
    }

    public  function findByUser(Request $request, string $user_id):JsonResponse
    {
        $vendas = $this->vendasService->findByUser($user_id);
        return response()->json($vendas, 200);

    }

    public function updateVenda(Request $request, string $id):JsonResponse
    {
        $dto = new UpdateVendaDTO(
            produto_id: $request->input('produto_id'),
            user_id: $request->input('user_id'),
            valor_total: (float) $request->input('valor_total'),
            qtd_produto: (int) $request->input('qtd_produto'),
            pagamento: $request->input('pagamento'),
            parcelas: (int) $request->input('parcelas'),
            vencimento_parcelas: $request->input('vencimento_parcelas')
        );

        $venda = $this->vendasService->updateVenda($id, $dto);
        return response()->json($venda, 200);
    }

    public function deleteVenda(Request $request, string $id):JsonResponse
    {
        $venda = $this->vendasService->deleteVenda($id);
        return response()->json($venda, 200);
    }
}
