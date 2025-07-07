<?php


namespace App\Http\Controllers;


use App\DTOs\User\UserUpdateDTO;
use App\services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\DTOs\User\CreateUserDTO;
use App\services\UserService;
use Illuminate\Routing\Redirector;

class UserController extends Controller
{
    private $userService;
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }


    public function createUser(Request $request, AuthService $authService): JsonResponse
    {
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

        return response()->json([
            'message' => 'Usuário criado com sucesso',
            'user' => $userResponse,
        ], 201);
    }

    public function findAll(Request $request): JsonResponse
    {
        $users = $this->userService->findAll();
        return response()->json($users, 200);
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


    public function updateUser(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email',
        ]);
        $dto = new UserUpdateDTO(
            name: $validated['name'] ?? null,
            email: $validated['email'] ?? null,
            cpf: $request->cpf ?? null,
        );
        $updatedUser = $this->userService->updateUser($id, $dto);
        return response()->json($updatedUser, 200);
    }


}
