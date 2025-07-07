<?php

namespace App\services;

use App\Models\User;
use App\Services\AuthService\ValidationException;
use App\Services\AuthService\Validator;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    private $key;
    private $algorithm = 'HS256';
    private $tokenExpiration = 60 * 60 * 24; // 24 horas
    private $cookieName = 'auth_token';

    public function __construct()
    {
        $this->key = config('app.jwt_secret');
    }

    /**
     * Autentica um usuário recém-criado (para uso após registro)
     */
    public function authenticateUser(User $user)
    {
        $token = $this->generateToken($user);

        // Salva o token no cookie
        $this->setTokenCookie($token);

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $this->tokenExpiration
        ];
    }

    /**
     * Autentica um usuário
     */
    public function login(array $credentials)
    {
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        $token = $this->generateToken($user);

        // Salva o token no cookie
        $this->setTokenCookie($token);

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $this->tokenExpiration
        ];
    }

    /**
     * Gera o token JWT
     */
    private function generateToken(User $user)
    {
        $payload = [
            'iss' => config('app.url'),
            'sub' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'iat' => time(),
            'exp' => time() + $this->tokenExpiration,
        ];

        return JWT::encode($payload, $this->key, $this->algorithm);
    }

    /**
     * Valida e decodifica o token JWT
     */
    public function validateToken($token)
    {
        try {
            $decoded = JWT::decode($token, new Key($this->key, $this->algorithm));

            $user = User::find($decoded->sub);

            if (!$user) {
                return null;
            }

            return $user;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Obtém o usuário do token
     */
    public function getUserFromToken($token = null)
    {
        // Se não foi passado token, tenta pegar do cookie
        if (!$token) {
            $token = $this->getTokenFromCookie();
        }

        if (!$token) {
            return null;
        }

        return $this->validateToken($token);
    }

    /**
     * Obtém o usuário autenticado atual
     */
    public function getCurrentUser()
    {
        $token = $this->getTokenFromCookie();

        if (!$token) {
            return null;
        }

        return $this->validateToken($token);
    }

    /**
     * Faz logout (remove o cookie)
     */
    public function logout()
    {
        $this->removeTokenCookie();

        return ['message' => 'Logout realizado com sucesso'];
    }

    /**
     * Refresh do token
     */
    public function refreshToken($token = null)
    {
        // Se não foi passado token, tenta pegar do cookie
        if (!$token) {
            $token = $this->getTokenFromCookie();
        }

        $user = $this->validateToken($token);

        if (!$user) {
            return null;
        }

        $newToken = $this->generateToken($user);

        // Atualiza o cookie com o novo token
        $this->setTokenCookie($newToken);

        return [
            'user' => $user,
            'token' => $newToken,
            'token_type' => 'Bearer',
            'expires_in' => $this->tokenExpiration
        ];
    }

    /**
     * Salva o token no cookie
     */
    private function setTokenCookie($token)
    {
        $minutes = $this->tokenExpiration / 60; // Converte segundos para minutos

        cookie()->queue(
            $this->cookieName,
            $token,
            $minutes,
            '/', // path
            null, // domain
            true, // secure (HTTPS)
            true, // httpOnly
            false, // raw
            'lax' // sameSite
        );
    }

    /**
     * Obtém o token do cookie
     */
    private function getTokenFromCookie()
    {
        return request()->cookie($this->cookieName);
    }

    /**
     * Remove o token do cookie
     */
    private function removeTokenCookie()
    {
        cookie()->queue(
            cookie()->forget($this->cookieName)
        );
    }

    /**
     * Verifica se o usuário está autenticado
     */
    public function isAuthenticated()
    {
        return $this->getCurrentUser() !== null;
    }
}
