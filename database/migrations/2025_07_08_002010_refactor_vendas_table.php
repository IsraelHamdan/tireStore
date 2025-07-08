<?php
// 1. Migration para atualizar a estrutura da coluna vencimento_parcelas
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
    // Limpa a tabela para evitar problemas com dados antigos
    DB::table('vendas')->delete();

    // Altera a estrutura da coluna
    Schema::table('vendas', function (Blueprint $table) {
    $table->json('vencimento_parcelas')->nullable()->change();
    });
    }

    public function down(): void
    {
    Schema::table('vendas', function (Blueprint $table) {
    $table->json('vencimento_parcelas')->change();
    });
    }
};
