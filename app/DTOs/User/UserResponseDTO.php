<?php

namespace App\DTOs\User;

class UserResponseDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public string $email,
        public string $cpf,
        public string $created_at,
        public string $updated_at,
    ) {}
}
