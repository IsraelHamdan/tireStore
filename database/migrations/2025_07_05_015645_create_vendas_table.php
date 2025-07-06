<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendas', function (Blueprint $table) {
            // id auto-increment
            $table->uuid('id')->primary();

            // FK para produtos (id INTEGER)
            $table->unsignedInteger('produto_id');

            $table->integer('parcelas');
            $table->date('vencimento');
            $table->timestamps();

            // constraints
            $table->foreign('produto_id')
                ->references('id')
                ->on('produtos')
                ->onDelete('cascade');

            $table->foreignUuid('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendas');
    }
};
