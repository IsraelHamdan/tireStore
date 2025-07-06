<?php

namespace App\repositories;
use App\DTOs\User\UserUpdateDTO;
use App\Helpers\Helpers;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserRepository
{
    public function all()
    {
        return User::all();
    }
    public function findById(string $id): User
    {
        return User::findOrFail($id);
    }

    public function create(array $data): User
    {
        log::info($data['name']);
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'cpf' => $data['cpf'],
            'password' => bcrypt($data['password']),
        ]);
        return $user;

    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();

    }

    public function searchByName(string $name): array
    {
        $user =User::where('name', 'ILIKE', "%$name%")->get()->all();
        return $user->map(fn($user) => Helpers::fromUserModel($user))->all();
    }

    public function deleteUser(string $id):void
    {
        $user = User::findOrFail($id);
        $user->delete();
    }

    public function update(string $id, UserUpdateDTO $data): User
    {
        $user = User::findOrFail($id);
        $user->update([
            'name' => $data->name,
            'email' => $data->email,
        ]);
        return $user;
    }


}
