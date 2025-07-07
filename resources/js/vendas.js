// Configuração da API - usando URL absoluta como fallback
const API_BASE_URL = window.ENV?.API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});


let vendasData = [];
let selectedProdutoId = null;
let selectedUsuarioId = null;



function showLoading() {
    const container = document.getElementById('vendas-table-container');
    container.innerHTML = `
        <div class="d-flex justify-content-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>
    `;
}

function hideLoading() {
    // Loading será substituído pela tabela
}

function showError(message) {
    const container = document.getElementById('vendas-table-container');
    container.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        </div>
    `;
}

async function getData() {
    try {
        showLoading();
        console.log('Fazendo requisição para:', `${API_BASE_URL}/vendas/findAll`);

        const response = await api.get('/vendas/findAll');

        console.log('Resposta da API:', response.data);

        // Verificar se a resposta tem o formato esperado
        if (response.data) {
            // Se a resposta tem success, usar response.data.data
            if (response.data.success && response.data.data) {
                vendasData = response.data.data;
            }
            // Se a resposta é um array direto
            else if (Array.isArray(response.data)) {
                vendasData = response.data;
            }
            // Se a resposta é um objeto único, transformar em array
            else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
                vendasData = [response.data];
            }

            renderVendasTable(vendasData);
            hideLoading();
            return vendasData;
        } else {
            throw new Error('Resposta vazia da API');
        }
    } catch (error) {
        console.error('Erro ao buscar vendas:', error);
        console.error('URL tentada:', `${API_BASE_URL}/vendas/findAll`);
        showError('Erro ao carregar vendas: ' + error.message);
        hideLoading();
        return [];
    }
}

async function  getUserName(id) {
    try {
        const response = await api.get(`/user/findById/${id}`);
        return response.data.name
    }catch (err) {
        console.log(err)
    }

}

async function getProductName(id) {
    try{
        const response = await api.get(`/product/findById/${id}`);
        return response.data.name
    } catch (err) {
        return 'Erro ao buscar usuário';
    }
}


function renderVendasTable(vendas) {
    const container = document.getElementById('vendas-table-container');
    const totalVendas = document.getElementById('total-vendas');

    // Atualizar contador
    totalVendas.textContent = `Total: ${vendas.length} vendas`;

    if (!vendas || vendas.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info" role="alert">
                <i class="fas fa-info-circle"></i>
                Nenhuma venda encontrada.
            </div>
        `;
        return;
    }

    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Usuário</th>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Valor Total</th>
                        <th>Parcelas</th>
                        <th>Pagamento</th>
                        <th>Data</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
    `;

    vendas.forEach((venda, index) => {
        const dataVenda = venda.created_at ?
            new Date(venda.created_at).toLocaleDateString('pt-BR') : 'N/A';

        const valorFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(parseFloat(venda.valor_total) || 0);

        const idFormatado = venda.id ? venda.id.substring(0, 8) + '...' : 'N/A';

        const parcelasInfo = venda.parcelas ?
            `${venda.parcelas}x` : 'À vista';

        const vencimentosInfo = venda.vencimento_parcelas && Array.isArray(venda.vencimento_parcelas) ?
            venda.vencimento_parcelas.join(', ') : 'N/A';

        const rowId = `venda-row-${index}`;
        const userIdCellId = `user-${index}`;
        const productIdCellId = `product-${index}`;

        tableHTML += `
        <tr id="${rowId}">
            <td id="${userIdCellId}">Carregando...</td>
            <td id="${productIdCellId}">Carregando...</td>
            <td>${venda.qtd_produto || 0}</td>
            <td>${valorFormatado}</td>
            <td><span title="Vencimentos: ${vencimentosInfo}">${parcelasInfo}</span></td>
            <td>${venda.pagamento || 'N/A'}</td>
            <td>${dataVenda}</td>
            <td>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-sm btn-warning text-white"
                            onclick="editVenda('${venda.id}')" title="Editar">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-danger"
                            onclick="deleteVenda('${venda.id}')" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;

        // Chamada assíncrona para buscar nome e atualizar a célula depois que a tabela for renderizada
        getUserName(venda.user_id).then(nome => {
            document.getElementById(userIdCellId).textContent = nome;
        });

        getProductName(venda.produto_id).then(nome => {
            document.getElementById(productIdCellId).textContent = nome;
        });
    });


    tableHTML += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = tableHTML;
}


function deleteVenda(id) {
    if (confirm('Tem certeza que deseja excluir esta venda?')) {
        console.log('Excluir venda:', id);
        deleteVendaAPI(id);
    }
}

async function deleteVendaAPI(id) {
    try {
        const response = await api.delete(`/vendas/deleteVenda/${id}`);

        if (response.data.success) {

            vendasData = vendasData.filter(venda => venda.id !== id);

            renderVendasTable(vendasData);

            showAlert('Venda excluída com sucesso!', 'success');
        } else {
            throw new Error(response.data.message || 'Erro ao excluir venda');
        }
    } catch (error) {
        console.error('Erro ao excluir venda:', error);
        showAlert('Erro ao excluir venda: ' + error.message, 'danger');
    }
}

async function buscarProdutosPorNome(termo) {
    try {
        const res = await api.get(`/product/searchByName/${termo}`);
        return res.data;
    } catch (err) {
        console.error('Erro ao buscar produto:', err);
        return [];
    }
}

async function buscarUsuariosPorNome(termo) {
    try {
        const res = await api.get(`/user/searchByName/${termo}`);
        return res.data;
    } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        return [];
    }
}

function initBuscaParcialProduto() {
    const input = document.getElementById('produto-busca');
    const sugestoes = document.getElementById('produto-sugestoes');

    input.addEventListener('input', async () => {
        const termo = input.value.trim();
        sugestoes.innerHTML = '';
        if (termo.length < 2) return;

        const produtos = await buscarProdutosPorNome(termo);
        produtos.forEach(produto => {
            const item = document.createElement('button');
            item.className = 'list-group-item list-group-item-action';
            item.textContent = produto.nome;
            item.onclick = () => {
                selectedProdutoId = produto.id;
                input.value = produto.nome;
                sugestoes.innerHTML = '';
            };
            sugestoes.appendChild(item);
        });
    });
}

function initBuscaParcialUsuario() {
    const input = document.getElementById('usuario-busca');
    const sugestoes = document.getElementById('usuario-sugestoes');

    input.addEventListener('input', async () => {
        const termo = input.value.trim();
        sugestoes.innerHTML = '';
        if (termo.length < 2) return;

        const usuarios = await buscarUsuariosPorNome(termo);
        usuarios.forEach(user => {
            const item = document.createElement('button');
            item.className = 'list-group-item list-group-item-action';
            item.textContent = `${user.name} (${user.email})`;
            item.onclick = () => {
                selectedUsuarioId = user.id;
                input.value = user.name;
                sugestoes.innerHTML = '';
            };
            sugestoes.appendChild(item);
        });
    });
}


function showVendaModal(venda) {
    const modalHTML = `
        <div class="modal fade" id="vendaModal" tabindex="-1" aria-labelledby="vendaModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="vendaModalLabel">Detalhes da Venda</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>ID:</strong> ${venda.id}</p>
                                <p><strong>Usuário ID:</strong> ${venda.user_id}</p>
                                <p><strong>Produto ID:</strong> ${venda.produto_id}</p>
                                <p><strong>Quantidade:</strong> ${venda.qtd_produto}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Valor Total:</strong> ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(parseFloat(venda.valor_total))}</p>
                                <p><strong>Parcelas:</strong> ${venda.parcelas}x</p>
                                <p><strong>Pagamento:</strong> ${venda.pagamento}</p>
                                <p><strong>Data:</strong> ${new Date(venda.created_at).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                        ${venda.vencimento_parcelas && venda.vencimento_parcelas.length > 0 ? `
                            <div class="row mt-3">
                                <div class="col-12">
                                    <h6>Vencimentos das Parcelas:</h6>
                                    <ul>
                                        ${venda.vencimento_parcelas.map(data => `<li>${data}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-primary" onclick="editVenda('${venda.id}')">Editar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remover modal existente se houver
    const existingModal = document.getElementById('vendaModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('vendaModal'));
    modal.show();
}

async function editVenda(vendaId) {
    const venda = await api.get(`/vendas/findById/${vendaId}`);
    const dados = venda.data;
    const modalBody = `
            <form id="form-editar-venda">
                <div class="mb-3">
                    <label for="produto-busca" class="form-label">Produto</label>
                    <input type="text" class="form-control" id="produto-busca" placeholder="Buscar produto pelo nome">
                    <div id="produto-sugestoes" class="list-group mt-1"></div>
                    <small class="text-muted">Atual: ${dados.produto_id}</small>
                </div>

                <div class="mb-3">
                    <label for="usuario-busca" class="form-label">Usuário</label>
                    <input type="text" class="form-control" id="usuario-busca" placeholder="Buscar usuário pelo nome">
                    <div id="usuario-sugestoes" class="list-group mt-1"></div>
                    <small class="text-muted">Atual: ${dados.user_id}</small>
                </div>

                <div class="mb-3">
                    <label for="qtd_produto" class="form-label">Quantidade</label>
                    <input type="number" class="form-control" id="qtd_produto" value="${dados.qtd_produto}">
                </div>

                <div class="mb-3">
                    <label for="parcelas" class="form-label">Parcelas</label>
                    <input type="number" class="form-control" id="parcelas" value="${dados.parcelas}">
                </div>

                <div class="mb-3">
                    <label for="pagamento" class="form-label">Forma de Pagamento</label>
                    <input type="text" class="form-control" id="pagamento" value="${dados.pagamento}">
                </div>
            </form>
        `;
    document.getElementById('modal-editar-venda-body').innerHTML = modalBody;
    initBuscaParcialProduto();
    initBuscaParcialUsuario();
    document.getElementById('btn-salvar-edicao').onclick = () => {
        const payload = {
            produto_id: selectedProdutoId,
            user_id: selectedUsuarioId,
            qtd_produto: document.getElementById('qtd_produto').value,
            parcelas: document.getElementById('parcelas').value,
            pagamento: document.getElementById('pagamento').value
        };
        updateVendaRequest(vendaId, payload);
    };

    // Mostrar o modal
    const modal = new bootstrap.Modal(document.getElementById('modal-editar-venda'));
    modal.show();
}

function showAlert(message, type = 'info') {
    const alertsContainer = document.getElementById('alerts-container');
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    alertsContainer.insertAdjacentHTML('beforeend', alertHTML);

    // Auto-remover após 5 segundos
    setTimeout(() => {
        const alert = alertsContainer.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

function filterVendas() {
    const dateStartFilter = document.getElementById('filter-date-start').value;
    const dateEndFilter = document.getElementById('filter-date-end').value;

    let filteredVendas = vendasData;

    // Filtro por data
    if (dateStartFilter || dateEndFilter) {
        filteredVendas = filteredVendas.filter(venda => {
            const vendaDate = new Date(venda.created_at);
            let match = true;

            if (dateStartFilter) {
                match = match && vendaDate >= new Date(dateStartFilter);
            }

            if (dateEndFilter) {
                match = match && vendaDate <= new Date(dateEndFilter);
            }

            return match;
        });
    }

    renderVendasTable(filteredVendas);
}


function clearFilters() {
    document.getElementById('filter-date-start').value = '';
    document.getElementById('filter-date-end').value = '';
    renderVendasTable(vendasData);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada, iniciando busca de dados...');
    window.editVenda = editVenda;
    getData();
});



