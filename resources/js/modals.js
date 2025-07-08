const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});



// Função para renderizar tabela de produtos
function renderProdutosTable(produtos) {
    const container = document.getElementById('produtos-table-container');
    const totalProdutos = document.getElementById('total-produtos');

    totalProdutos.textContent = `Total: ${produtos.length} produtos`;
    produtos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (!produtos || produtos.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info" role="alert">
                <i class="fas fa-info-circle"></i>
                Nenhum produto encontrado.
            </div>
        `;
        return;
    }

    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Valor</th>
                        <th>Data de Criação</th>
                        <th>Última Atualização</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
    `;

    produtos.forEach((produto) => {
        const dataCriacao = produto.created_at ?
            new Date(produto.created_at).toLocaleDateString('pt-BR') : 'N/A';
        const dataAtualizacao = produto.updated_at ?
            new Date(produto.updated_at).toLocaleDateString('pt-BR') : 'N/A';

        const valor = parseFloat(produto.valor) || 0;
        const valorFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);

        tableHTML += `
            <tr>
                <td><small class="text-muted">${produto.id}</small></td>
                <td><strong>${produto.name}</strong></td>
                <td>${valorFormatado}</td>
                <td>${dataCriacao}</td>
                <td>${dataAtualizacao}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm btn-warning text-white"
                                onclick="editProduto('${produto.id}')" title="Editar">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-danger"
                                onclick="deleteProduto('${produto.id}')" title="Excluir">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tableHTML += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = tableHTML;
}

// Função para renderizar tabela de usuários
function renderUsuariosTable(usuarios) {
    const container = document.getElementById('usuarios-table-container');
    const totalUsuarios = document.getElementById('total-usuarios');

    totalUsuarios.textContent = `Total: ${usuarios.length} usuários`;
    usuarios.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (!usuarios || usuarios.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info" role="alert">
                <i class="fas fa-info-circle"></i>
                Nenhum usuário encontrado.
            </div>
        `;
        return;
    }

    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>Data de Criação</th>
                        <th>Última Atualização</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
    `;

    usuarios.forEach((usuario) => {
        const dataCriacao = usuario.created_at ?
            new Date(usuario.created_at).toLocaleDateString('pt-BR') : 'N/A';
        const dataAtualizacao = usuario.updated_at ?
            new Date(usuario.updated_at).toLocaleDateString('pt-BR') : 'N/A';

        // Formatação do CPF
        const cpfFormatado = usuario.cpf ?
            usuario.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : 'N/A';

        tableHTML += `
            <tr>
                <td><small class="text-muted">${usuario.id}</small></td>
                <td><strong>${usuario.name}</strong></td>
                <td>${usuario.email}</td>
                <td>${cpfFormatado}</td>
                <td>${dataCriacao}</td>
                <td>${dataAtualizacao}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm btn-warning text-white"
                                onclick="editUsuario('${usuario.id}')" title="Editar">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-danger"
                                onclick="deleteUsuario('${usuario.id}')" title="Excluir">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tableHTML += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = tableHTML;
}

// Funções para abrir as modais
function openListarProdutosModal() {
    // Aqui você pode chamar a função para carregar os produtos
    // Por exemplo: loadProdutos();
    console.log('Modal de produtos aberta');
}

function openListarUsuariosModal() {
    // Aqui você pode chamar a função para carregar os usuários
    // Por exemplo: loadUsuarios();
    console.log('Modal de usuários aberta');
}

function openModalNovoUsuario() {
    // Limpar o formulário
    document.getElementById('form-novo-usuario').reset();
    console.log('Modal de novo usuário aberta');
}

function openModalNovoProduto() {
    // Aqui você pode carregar o conteúdo do modal
    console.log('Modal de novo produto aberta');
}

function openNovaVendaModal() {
    // Carregar o conteúdo do modal
    const modalBody = document.getElementById('modal-nova-venda-body');

    modalBody.innerHTML = `
        <form id="form-nova-venda">
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="venda-usuario" class="form-label">Usuário</label>
                        <select class="form-select" id="venda-usuario" name="user_id" required>
                            <option value="">Selecione um usuário</option>
                            <!-- Usuários serão carregados via JS -->
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="venda-produto" class="form-label">Produto</label>
                        <select class="form-select" id="venda-produto" name="produto_id" required>
                            <option value="">Selecione um produto</option>
                            <!-- Produtos serão carregados via JS -->
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="venda-quantidade" class="form-label">Quantidade</label>
                        <input type="number" class="form-control" id="venda-quantidade" name="qtd_produto" min="1" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="venda-parcelas" class="form-label">Parcelas</label>
                        <input type="number" class="form-control" id="venda-parcelas" name="parcelas" min="1" value="1" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="venda-pagamento" class="form-label">Forma de Pagamento</label>
                        <select class="form-select" id="venda-pagamento" name="pagamento" required>
                            <option value="">Selecione a forma de pagamento</option>
                            <option value="CRED">Cartão de Crédito</option>
                            <option value="DEB">Cartão de Débito</option>
                            <option value="PIX">PIX</option>
                            <option value="DINHEIRO">Dinheiro</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="venda-valor-total" class="form-label">Valor Total</label>
                        <input type="text" class="form-control" id="venda-valor-total" name="valor_total" readonly>
                    </div>
                </div>
            </div>
            <div id="parcelas-container" class="mt-3">
                <!-- Campos de vencimento das parcelas serão inseridos aqui -->
            </div>
        </form>
    `;

    // Abrir o modal
    const modal = new bootstrap.Modal(document.getElementById('modal-nova-venda'));
    modal.show();

    // Carregar usuários e produtos
    loadUsuariosSelect();
    loadProdutosSelect();

    // Adicionar event listeners
    setupVendaFormListeners();

    console.log('Modal de nova venda aberta');
}

// Funções de refresh
function refreshProdutos() {
    // Aqui você pode recarregar os produtos
    console.log('Atualizando produtos...');
    // loadProdutos();
}

function refreshUsuarios() {
    // Aqui você pode recarregar os usuários
    console.log('Atualizando usuários...');
    // loadUsuarios();
}

// Funções de edição e exclusão (você deve implementar de acordo com sua API)
function editProduto(id) {
    console.log('Editando produto:', id);
    // Implementar a lógica de edição
}

function deleteProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        console.log('Excluindo produto:', id);
        // Implementar a lógica de exclusão
    }
}

function editUsuario(id) {
    console.log('Editando usuário:', id);
    // Implementar a lógica de edição
}

function deleteUsuario(id) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        console.log('Excluindo usuário:', id);
        // Implementar a lógica de exclusão
    }
}

// Funções auxiliares para o modal de nova venda
function loadUsuariosSelect() {
    const select = document.getElementById('venda-usuario');
    if (!select) return;

    // Aqui você deve fazer a chamada para sua API para carregar os usuários
    // Por enquanto, vou deixar um exemplo:
    /*
    fetch('/api/usuarios')
        .then(response => response.json())
        .then(usuarios => {
            select.innerHTML = '<option value="">Selecione um usuário</option>';
            usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.id;
                option.textContent = usuario.name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar usuários:', error));
    */

    console.log('Carregando usuários para o select...');
}

function loadProdutosSelect() {
    const select = document.getElementById('venda-produto');
    if (!select) return;

    // Aqui você deve fazer a chamada para sua API para carregar os produtos
    // Por enquanto, vou deixar um exemplo:
    /*
    fetch('/api/produtos')
        .then(response => response.json())
        .then(produtos => {
            select.innerHTML = '<option value="">Selecione um produto</option>';
            produtos.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.id;
                option.textContent = `${produto.name} - ${formatCurrency(produto.valor)}`;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
    */

    console.log('Carregando produtos para o select...');
}

function setupVendaFormListeners() {
    const produtoSelect = document.getElementById('venda-produto');
    const quantidadeInput = document.getElementById('venda-quantidade');
    const parcelasInput = document.getElementById('venda-parcelas');
    const valorTotalInput = document.getElementById('venda-valor-total');

    // Calcular valor total quando produto ou quantidade mudar
    function calcularValorTotal() {
        const produtoId = produtoSelect.value;
        const quantidade = parseInt(quantidadeInput.value) || 0;

        if (produtoId && quantidade > 0) {
            // Aqui você deve buscar o valor do produto pela API
            // Por enquanto, vou simular:
            const valorUnitario = 100; // Simular valor
            const valorTotal = valorUnitario * quantidade;
            valorTotalInput.value = formatCurrency(valorTotal);
        } else {
            valorTotalInput.value = '';
        }
    }

    // Gerar campos de vencimento das parcelas
    function gerarCamposParcelas() {
        const numParcelas = parseInt(parcelasInput.value) || 1;
        const container = document.getElementById('parcelas-container');

        if (numParcelas <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '<h6>Vencimento das Parcelas:</h6>';
        for (let i = 1; i <= numParcelas; i++) {
            html += `
                <div class="row mb-2">
                    <div class="col-md-6">
                        <label for="vencimento-${i}" class="form-label">Parcela ${i} - Data</label>
                        <input type="date" class="form-control" id="vencimento-${i}" name="vencimento_${i}" required>
                    </div>
                    <div class="col-md-6">
                        <label for="valor-parcela-${i}" class="form-label">Valor da Parcela</label>
                        <input type="text" class="form-control" id="valor-parcela-${i}" name="valor_parcela_${i}" required>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    }

    // Event listeners
    if (produtoSelect) produtoSelect.addEventListener('change', calcularValorTotal);
    if (quantidadeInput) quantidadeInput.addEventListener('input', calcularValorTotal);
    if (parcelasInput) parcelasInput.addEventListener('input', gerarCamposParcelas);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Exemplo de como usar as funções (você deve chamar com dados reais)
/*
// Exemplo de dados para teste
const produtosExemplo = [
    {
        "id": "0197e0a0-5140-715a-ae9e-8a54fb84ad28",
        "name": "Peneu Pirelli 255/45/R18",
        "valor": "300.00",
        "created_at": "2025-07-06T16:44:52.000000Z",
        "updated_at": "2025-07-06T17:20:43.000000Z"
    }
];

const usuariosExemplo = [
    {
        "id": "cbf4f6f5-8605-4225-8f2b-4747de94d5aa",
        "name": "Caio Lucas Santos Silva",
        "email": "caioLucas5@example.com",
        "cpf": "61714391000",
        "created_at": "2025-07-05T21:40:41.000000Z",
        "updated_at": "2025-07-05T21:40:41.000000Z"
    }
];

// Para testar, descomente as linhas abaixo:
// renderProdutosTable(produtosExemplo);
// renderUsuariosTable(usuariosExemplo);
*/
