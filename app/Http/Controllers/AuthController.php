<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private AuthService $authService;
    public function __construct(AuthService $authService) {
        $this->authService = $authService;
    }

    public function showAuthForm()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->only(['email', 'password']);
            $result = $this->authService->login($credentials);

            if ($request->expectsJson()) {
                return response()->json($result, 200);
            }

            // Para requests web, armazena o token na sessão e redireciona
            session(['auth_token' => $result['token']]);
            return redirect('/welcome');

        } catch (ValidationException $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Erro de validação',
                    'errors' => $e->errors()
                ], 422);
            }

            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput($request->except('password'));
        }
    }

    public function logout(Request $request)
    {
        $result = $this->authService->logout();

        if ($request->expectsJson()) {
            return response()->json($result, 200);
        }

        // Para requests web, remove o token da sessão
        session()->forget('auth_token');
        return redirect('/');
    }

    public function refresh(Request $request)
    {
        $token = $request->bearerToken() ?: session('auth_token');

        if (!$token) {
            return response()->json(['message' => 'Token não fornecido'], 401);
        }

        $result = $this->authService->refreshToken($token);

        if (!$result) {
            return response()->json(['message' => 'Token inválido'], 401);
        }

        if ($request->expectsJson()) {
            return response()->json($result, 200);
        }
        session(['auth_token' => $result['token']]);
        return response()->json($result, 200);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => $user
        ]);
    }

}
