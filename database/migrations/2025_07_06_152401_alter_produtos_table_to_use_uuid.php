<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Garante que a extensão de UUID está disponível
        DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        // Limpa a tabela para evitar problemas de conversão de dados
        DB::table('produtos')->truncate();

        // 1. **(A CORREÇÃO)** Remove o valor padrão antigo (a sequência de autoincremento)
        DB::statement('ALTER TABLE produtos ALTER COLUMN id DROP DEFAULT');

        // 2. Agora, altera o tipo da coluna para UUID com segurança
        DB::statement('ALTER TABLE produtos ALTER COLUMN id TYPE UUID USING (uuid_generate_v4())');

        // 3. Define o novo valor padrão para gerar UUIDs
        DB::statement('ALTER TABLE produtos ALTER COLUMN id SET DEFAULT uuid_generate_v4()');
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE produtos ALTER COLUMN id DROP DEFAULT');
        DB::statement('ALTER TABLE produtos ALTER COLUMN id TYPE integer USING (0)');
    }
};
