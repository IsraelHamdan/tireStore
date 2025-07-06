public function up(): void
{
    // 1) habilita o gerador de UUID no Postgres
    DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    Schema::create('users', function (Blueprint $table) {
        // 2) usa o uuid_generate_v4() como default
        $table->uuid('id')
              ->default(DB::raw('uuid_generate_v4()'))
              ->primary();

        $table->string('name');
        $table->string('email')->unique();
        $table->string('password');
        $table->string('cpf');
        $table->timestamps();
    });
}
