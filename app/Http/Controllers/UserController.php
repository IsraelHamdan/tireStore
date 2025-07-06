<?php


namespace App\Http\Controllers;

use App\DTOs\User\UserResponseDTO;
use App\DTOs\User\UserUpdateDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\DTOs\User\CreateUserDTO;
use App\services\UserService;
class UserController extends Controller
{
    private $userService;
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function createUser(Request $request): JsonResponse
    {
        $log = "
            Dados vindos da requisição:

            nome: {$request-> nome},
            email: {$request-> email},
            cpf: {$request->cpf}
        ";
        echo $log;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'cpf' => 'required|string|size:11|unique:users,cpf',
            'password' => 'required|string|min:6',
        ]);
        $dto = new CreateUserDTO(
            name: $validated['name'],
            email: $validated['email'],
            cpf: $validated['cpf'],
            password: $validated['password'],
        );

        $userResponse = $this->userService->create($dto);

        return response()->json($userResponse, 201);
    }


    public function findById(Request $request): JsonResponse
    {
       $user = $this->userService->findById($request->id);
       return response()->json($user, 200);
    }

    public function deleteUser(Request $request): JsonResponse
    {
        $user = $this->userService->deleteUser($request->id);
        return response()->json($user, 200);
    }

    public function searchUserByName(Request $request): JsonResponse
    {
        $user = $this->userService->searchByName($request->name);
        return response()->json($user, 200);
    }

    public function updateUser(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email',
        ]);
        $dto = new UserUpdateDTO(
            name: $validated['name'] ?? null,
            email: $validated['email'] ?? null,
        );
        $updatedUser = $this->userService->updateUser($id, $dto);
        return response()->json($updatedUser, 200);
    }

    public function findAll(Request $request): JsonResponse
    {
        $users = $this->userService->findAll();
        return response()->json($users, 200);
    }

    public function searchByName(Request $request, string $nome):JsonResponse
    {
        $user = $this->userService->searchByName($nome);
        return response()->json($user, 200);
    }
}
