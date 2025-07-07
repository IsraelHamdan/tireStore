<?php

namespace App\services;

use App\DTOs\User\CreateUserDTO;
use App\DTOs\User\UserUpdateDTO;
use App\Models\User;
use App\repositories\UserRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\Collection;

class UserService
{
    private UserRepository $userRepository;
    public  function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @param CreateUserDTO | UserUpdateDTO $dto
     * @return array
     * @throws ValidationException
     */

    private function validateUser(CreateUserDTO | UserUpdateDTO $dto, string $userId = null):array
    {
        $data = array_filter(get_object_vars($dto), fn($value) => !is_null($value));
        $ruleType = ($dto instanceof CreateUserDTO) ? 'required' : 'sometimes|required';
        $rules = [
            'name' => $ruleType . '|string|max:255',
            'email' => $ruleType . '|email|unique:users,email' . ($userId ? ",$userId" : ''),
            'cpf' => $ruleType . '|string|size:11|unique:users,cpf' . ($userId ? ",$userId" : ''),
            'password' => $ruleType . '|string|min:6',

        ];

        if ($dto instanceof CreateUserDTO) {
            $rules['password'] = 'required|string|min:6';
        }

        $validator = Validator::make($data, $rules);

        if($validator->fails()) {
            throw new ValidationException($validator);
        }
        return $validator->validated();

    }

    public function create(CreateUserDTO $dto):User
    {
        try {
            $validatedData = $this->validateUser($dto, null);
            $validatedData['password'] = bcrypt($validatedData['password']);

            $user = User::create($validatedData);

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
        } catch (ValidationException $e) {
            throw ValidationException::withMessages($e->validator->errors()->toArray());
        }


    }

    public function findById(string $id): User
    {
        try {
            return User::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            throw new HttpException('404', 'User not found'. $e->getMessage());
        }
    }

    public  function  findAll(): Collection
    {
        try {
            return User::all();
        } catch (QueryException $e) {
            throw new HttpException($e->getCode(), "{$e->getMessage()}");
        } catch (NotFoundHttpException $e) {
            throw new HttpException($e->getCode(), "{$e->getMessage()}");
        }
    }


    public function searchByName(string $nome): array
    {
        try {
            return User::where('name', 'ILIKE', "%$nome%")
                ->get()->map(fn($user) => $user->only(['id', 'name', 'email', 'cpf']))
                ->toArray();
        } catch (NotFoundHttpException $exception) {
            throw new HttpException('404', 'User not found');
        } catch (QueryException $e) {
            throw new HttpException('500', 'Internal server error');
        }
    }



    public function deleteUser(string $id):void
    {
        try {
           $user = $this->findById($id);
           $user->delete();
        } catch (NotFoundHttpException $exception) {
            throw new HttpException($exception->getCode(), 'User not found');
        }

    }

    public function updateUser(string $id, UserUpdateDTO $dto): User
    {
        try {
            $validatedData = $this->validateUser($dto, $id);

            $user = $this->findById($id);
            $user->update($validatedData);

            return $user;

        } catch (NotFoundHttpException $exception) {
            throw new HttpException('404', 'User not found');
        } catch (QueryException $e) {
            throw new HttpException('500', 'Internal server error' . $e->getMessage());
        } catch (ValidationException $e) {
            throw new ValidationException($e->validator);
        }
    }

}
