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
    public function index()
    {
        $apiBaseUrl = url('/api');

        return view('vendas.index', compact('apiBaseUrl'));
    }
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
            valor_unitario_produto: (float) $request->input('valor_unitario_produto'),
            pagamento: $request->input('pagamento'),
            parcelas: (int) $request->input('parcelas'),
            vencimento_parcelas: $request->input('vencimento_parcelas')
        );

        $venda = $this->vendasService->createVenda($dto);

        return response()->json([
            'success' => true,
            'message' => 'Venda criada com sucesso',
            'data' => $venda,
        ], 201);

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

    public function deleteVenda(Request $request, string $id): JsonResponse
    {
        try {
            $this->vendasService->deleteVenda($id);
            return response()->json([
                'success' => true,
                'message' => 'Venda deletada com sucesso'
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao deletar venda: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateVenda(Request $request, string $id):JsonResponse
    {
        $dto = new UpdateVendaDTO(
            produto_id: $request->input('produto_id'),
            user_id: $request->input('user_id'),
            valor_total: (float) $request->input('valor_total'),
            qtd_produto: (int) $request->input('qtd_produto'),
            valor_unitario_produto: (float) $request->input('valor_unitario_produto'),
            pagamento: $request->input('pagamento'),
            parcelas: (int) $request->input('parcelas'),
            vencimento_parcelas: $request->input('vencimento_parcelas')
        );

        $venda = $this->vendasService->updateVenda($id, $dto);
        return response()->json([
            'success' => true,
            'message' => 'Venda atualizada com sucesso',
            'data' => $venda,
        ], 200);

    }

    public function filterByDate(Request $request, string $data_inicio, string $data_fim):JsonResponse
    {
        if (!$data_inicio || !$data_fim) {
            return response()->json(['error' => 'Datas inválidas'], 400);
        }
        $vendas = $this->vendasService->filterByDate($data_inicio, $data_fim);
        return response()->json($vendas, 200);
    }

    public function filterByUser(Request $request, string $user_id):JsonResponse
    {
        $vendas = $this->vendasService->filterByUser($user_id);
        return response()->json($vendas, 200);
    }

    public function filterByProduct(Request $request, string $produto_id):JsonResponse
    {
        $vendas = $this->vendasService->filterByProduct($produto_id);
    }
}
