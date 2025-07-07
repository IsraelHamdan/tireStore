<?php

namespace App\Http\Middleware;

use App\Services\AuthService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtMiddleware
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function handle(Request $request, Closure $next): Response
    {
        $token = $this->getTokenFromRequest($request);

        if (!$token) {
            return $this->unauthorizedResponse($request);
        }

        if (!$this->authService->isAuthenticated()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = $this->authService->validateToken($token);

        if (!$user) {
            return $this->unauthorizedResponse($request);
        }

        // Adiciona o usuário ao request
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }

    /**
     * Obtém o token do request
     */
    private function getTokenFromRequest(Request $request)
    {
        // Primeiro tenta obter do header Authorization
        $bearerToken = $request->bearerToken();
        if ($bearerToken) {
            return $bearerToken;
        }

        // Depois tenta obter da sessão (para requests web)
        $sessionToken = session('auth_token');
        if ($sessionToken) {
            return $sessionToken;
        }

        // Por último, tenta obter do query parameter
        return $request->query('token');
    }

    /**
     * Retorna resposta de não autorizado
     */
    private function unauthorizedResponse(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Token inválido ou não fornecido'], 401);
        }

        return redirect('/')->with('error', 'Acesso negado. Faça login para continuar.');
    }
}
