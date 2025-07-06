<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Este comando é robusto. Ele remove a tabela 'vendas' e,
        // consequentemente, qualquer chave estrangeira associada a ela.
        Schema::dropIfExists('vendas');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Não precisamos fazer nada aqui. Esta é uma migration de sentido único.
    }
};
