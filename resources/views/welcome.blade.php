<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="<KEY>" crossorigin="anonymous">>
    <!-- Font Awesome 6 CDN -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">

    <title>Dashboard</title>
</head>
<body style="background-color: #fefefe">
    <header>
        <nav class="navbar navbar-expand-lg px-4" style="background-color: #fefefe; border-bottom: 1px solid #e0e0e0;">
            <a class="navbar-brand fw-bold" href="#" style="color: #1e1e1e;">TireStore</a>

            <!-- Botão hamburger para mobile -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
                    style="background-color: #1e1e1e; border: 2px solid #1e1e1e;">
                <span class="navbar-toggler-icon" style="background-image: url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 30 30\'%3e%3cpath stroke=\'rgba%28255, 255, 255, 1%29\' stroke-linecap=\'round\' stroke-miterlimit=\'10\' stroke-width=\'2\' d=\'m4 7h22M4 15h22M4 23h22\'/%3e%3c/svg%3e');"></span>
            </button>

            <!-- Menu colapsável -->
            <div class="collapse navbar-collapse" id="navbarNav">

            </div>
        </nav>
    </header>
    <main class="container-fluid mt-4">
        <div id="alerts-container"></div>
        <div class="row mb-4">
            <div class="col-md-8">
                <h1 class="h3 mb-0">
                    <i class="fas fa-shopping-cart text-primary"></i>
                    Gestão de Vendas
                </h1>
                <p class="text-muted">Visualize e gerencie todas as vendas do sistema</p>
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Gestão de Vendas</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                </head>
                <body>
                            <div class="btn-group-vertical w-100" role="group">
                                <button class="btn btn-primary mb-2" id="btn-nova-venda" onclick="openNovaVendaModal()">
                                    <i class="fas fa-plus"></i> Nova Venda
                                </button>
                                <button class="btn btn-success mb-2" id="btn-listar-produtos" onclick="openListarProdutosModal()" data-bs-toggle="modal" data-bs-target="#modal-listar-produtos">
                                    <i class="fas fa-box"></i> Listar Produtos
                                </button>
                                <button class="btn btn-info mb-2" id="btn-listar-usuarios" onclick="openListarUsuariosModal()" data-bs-toggle="modal" data-bs-target="#modal-listar-usuarios">
                                    <i class="fas fa-users"></i> Listar Usuários
                                </button>
                                <button class="btn btn-warning mb-2" id="btn-novo-usuario" onclick="openModalNovoUsuario()" data-bs-toggle="modal" data-bs-target="#modal-novo-usuario">
                                    <i class="fas fa-user-plus"></i> Novo Usuário
                                </button>
                                <button class="btn btn-secondary" id="btn-novo-produto" onclick="openModalNovoProduto()" data-bs-toggle="modal" data-bs-target="#modal-novo-produto">
                                    <i class="fas fa-plus-circle"></i> Novo Produto
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Nova Venda -->
                    <div class="modal fade" id="modal-nova-venda" tabindex="-1" aria-labelledby="modalNovaVendaLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalNovaVendaLabel">
                                        <i class="fas fa-shopping-cart"></i> Nova Venda
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                                </div>
                                <div class="modal-body" id="modal-nova-venda-body">
                                    <!-- Conteúdo do modal via JS -->
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="button" class="btn btn-primary" id="btn-salvar-nova-venda">Salvar Venda</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Novo Usuário -->
                    <div class="modal fade" id="modal-novo-usuario" tabindex="-1" aria-labelledby="modalNovoUsuarioLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalNovoUsuarioLabel">
                                        <i class="fas fa-user-plus"></i> Novo Usuário
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                                </div>
                                <div class="modal-body" id="modal-novo-usuario-body">
                                    <form id="form-novo-usuario">
                                        <div class="mb-3">
                                            <label for="usuario-name" class="form-label">Nome</label>
                                            <input type="text" class="form-control" id="usuario-name" name="name" placeholder="Digite o nome" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="usuario-email" class="form-label">Email</label>
                                            <input type="email" class="form-control" id="usuario-email" name="email" placeholder="Digite o email" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="usuario-cpf" class="form-label">CPF</label>
                                            <input type="text" class="form-control" id="usuario-cpf" name="cpf" placeholder="Digite o CPF" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="usuario-password" class="form-label">Senha</label>
                                            <input type="password" class="form-control" id="usuario-password" name="password" placeholder="Digite a senha" required>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="button" class="btn btn-primary" id="btn-salvar-novo-usuario">Salvar Usuário</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Novo Produto -->
                    <div class="modal fade" id="modal-novo-produto" tabindex="-1" aria-labelledby="modalNovoProdutoLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalNovoProdutoLabel">
                                        <i class="fas fa-plus-circle"></i> Novo Produto
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                                </div>
                                <div class="modal-body" id="modal-novo-produto-body">
                                    <!-- Conteúdo do modal via JS -->
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="button" class="btn btn-primary" id="btn-salvar-novo-produto">Salvar Produto</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Listar Produtos -->
                    <div class="modal fade" id="modal-listar-produtos" tabindex="-1" aria-labelledby="modalListarProdutosLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalListarProdutosLabel">
                                        <i class="fas fa-box"></i> Lista de Produtos
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <h6 class="mb-0" id="total-produtos">Total: 0 produtos</h6>
                                        </div>
                                        <div>
                                            <button class="btn btn-success btn-sm" onclick="refreshProdutos()">
                                                <i class="fas fa-sync-alt"></i> Atualizar
                                            </button>
                                        </div>
                                    </div>
                                    <div id="produtos-table-container">
                                        <!-- Tabela de produtos será inserida aqui -->
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Listar Usuários -->
                    <div class="modal fade" id="modal-listar-usuarios" tabindex="-1" aria-labelledby="modalListarUsuariosLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalListarUsuariosLabel">
                                        <i class="fas fa-users"></i> Lista de Usuários
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <h6 class="mb-0" id="total-usuarios">Total: 0 usuários</h6>
                                        </div>
                                        <div>
                                            <button class="btn btn-info btn-sm" onclick="refreshUsuarios()">
                                                <i class="fas fa-sync-alt"></i> Atualizar
                                            </button>
                                        </div>
                                    </div>
                                    <div id="usuarios-table-container">
                                        <!-- Tabela de usuários será inserida aqui -->
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


        <!-- Filtros -->
        <div class="row mb-3">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-4">
                                <label class="form-label">Data Inicial</label>
                                <input type="date" class="form-control" id="filter-date-start" onchange="filterVendas()">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Data Final</label>
                                <input type="date" class="form-control" id="filter-date-end" onchange="filterVendas()">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Usuário</label>
                                <input type="text" class="form-control" id="filter-user-name" placeholder="Buscar usuário pelo nome" autocomplete="off">
                                <div id="filter-user-sugestoes" class="list-group mt-1"></div>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Produto</label>
                                <input type="text" class="form-control" id="filter-product-name" placeholder="Buscar produto pelo nome" autocomplete="off">
                                <div id="filter-product-sugestoes" class="list-group mt-1"></div>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">&nbsp;</label>
                                <div class="d-grid">
                                    <button class="btn btn-outline-secondary" onclick="clearFilters()">
                                        <i class="fas fa-filter"></i> Limpar Filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Edição Venda -->
        <div class="modal fade" id="modal-editar-venda" tabindex="-1" aria-labelledby="modal-editar-venda-label" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Editar Venda</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body" id="modal-editar-venda-body">
                        <!-- Conteúdo será gerado dinamicamente via JS -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btn-salvar-edicao">Salvar Alterações</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-list"></i> Lista de Vendas
                        </h5>
                        <small class="text-muted" id="total-vendas">Total: 0 vendas</small>
                    </div>
                    <div class="card-body">
                        <div id="vendas-table-container">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>


    @vite(['resources/js/vendas.js', 'resources/js/modals.js'])
    <script>
        window.ENV = {
            API_BASE_URL: "{{ url('/api') }}"
        };
    </script>
    <script src="https://unpkg.com/imask"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.0/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>


    <script>
        function filterVendas() {
            console.log('Aplicando filtros...');
            // Implementar lógica de filtro
        }

        function clearFilters() {
            document.getElementById('filter-status').value = '';
            document.getElementById('filter-date-start').value = '';
            document.getElementById('filter-date-end').value = '';
            getData();
        }
    </script>
</body>

</html>
