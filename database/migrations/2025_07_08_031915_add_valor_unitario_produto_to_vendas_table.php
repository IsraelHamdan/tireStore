<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Apaga todas as vendas para evitar problemas
        DB::table('vendas')->delete();

        // Adiciona a nova coluna
        Schema::table('vendas', function (Blueprint $table) {
            $table->decimal('valor_unitario_produto', 10, 2)->after('qtd_produto');
        });
    }

    public function down(): void
    {
        Schema::table('vendas', function (Blueprint $table) {
            $table->dropColumn('valor_unitario_produto');
        });
    }
};
