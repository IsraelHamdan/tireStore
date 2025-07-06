<?php

namespace App\services;

use App\DTOs\User\CreateUserDTO;
use App\DTOs\User\UserResponseDTO;
use App\DTOs\User\UserUpdateDTO;
use App\Helpers\Helpers;
use App\Models\User;
use App\repositories\UserRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserService
{
    private UserRepository $userRepository;
    public  function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function create(CreateUserDTO $dto):User
    {
        try {
            $user = $this->userRepository->create((array)$dto);

            Log::info('Usuário salvo com sucesso', [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'cpf' => $user->cpf,
            ]);

            return $user;

        } catch (QueryException $e) {
            $sqlState = $e->errorInfo[0] ?? null;
            if ($sqlState === '23505') {
                throw new HttpException(409, 'Usuário já existe');
            }

            Log::error('Erro ao criar usuário', [
                'message'   => $e->getMessage(),
                'errorInfo' => $e->errorInfo,
            ]);

            throw new HttpException(500, 'Erro interno no servidor'. $e->getMessage());
        }


    }

    public function findById(string $id): UserResponseDTO
    {
        try {
            $user = $this->userRepository->findById($id);
            return Helpers::fromUserModel($user);
        } catch (ModelNotFoundException $e) {
            throw new HttpException('404', 'User not found'. $e->getMessage());
        }
    }

    public  function  findAll(): UserResponseDTO
    {
        try {
            $users = $this->userRepository->all();
            return Helpers::fromUserModelArray($users);
        } catch (ModelNotFoundException $e) {
            throw new HttpException('404', 'Users not found');
        }
    }

    public function deleteUser(string $id):void
    {
        try {
            $this->userRepository->deleteUser($id);
        } catch (NotFoundHttpException $exception) {
            throw new HttpException('404', 'User not found');
        }
    }

    public function searchByName(string $nome): array
    {
        try {
            return $this->userRepository->searchByName($nome);
        } catch (NotFoundHttpException $exception) {
            throw new HttpException('404', 'User not found');
        } catch (QueryException $e) {
            throw new HttpException('500', 'Internal server error');
        }
    }

    public function updateUser(string $id, UserUpdateDTO $data): User
    {
        try {
            return $this->userRepository->update($id, $data);
        } catch (NotFoundHttpException $exception) {
            throw new HttpException('404', 'User not found');
        } catch (QueryException $e) {
            throw new HttpException('500', 'Internal server error' . $e->getMessage());
        }
    }

    public  function  findByEmail(string $email): UserResponseDTO
    {
        try {
            $user = $this->userRepository->findByEmail($email);
            echo $user;
            return Helpers::fromUserModel($user);
        } catch (NotFoundHttpException $e) {
            throw new HttpException('404', 'User not found' . $e->getMessage());
        } catch (QueryException $e) {
            throw new HttpException($e->getCode(), 'Internal server error' . $e->getMessage());
        }catch (\Exception $e){
            throw new HttpException(500, 'Internal server error');
        }
    }


}
