<?php

namespace App\DTOs\User;

class UserUpdateDTO
{

    public function __construct(
        public ?string $name,
        public ?string $email,

    ){}
}
