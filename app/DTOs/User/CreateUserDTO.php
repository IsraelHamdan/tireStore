<?php

namespace App\DTOs\User;

class CreateUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $cpf,
        public string $password,
    ) {}
}
