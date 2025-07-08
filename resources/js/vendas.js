const API_BASE_URL = window.ENV?.API_BASE_URL || 'http://localhost:8000/api';

//global functions
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});



let vendasData = [];

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
    // Pode ser implementado para limpar loading, se necessário
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
        const response = await api.get('/vendas/findAll');

        if (response.data) {
            if (response.data.success && response.data.data) {
                vendasData = response.data.data;
            } else if (Array.isArray(response.data)) {
                vendasData = response.data;
            } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
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
        showError('Erro ao carregar vendas: ' + error.message);
        hideLoading();
        return [];
    }
}

async function getUserName(id) {
    try {
        const response = await api.get(`/user/findById/${id}`);
        return response.data.name;
    } catch (err) {
        console.error(err);
        return 'Usuário não encontrado';
    }
}

async function getProductInfo(id) {
    try {
        const response = await api.get(`/product/findById/${id}`);
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar produto:', err);
        return null;
    }
}

function renderVendasTable(vendas) {
    const container = document.getElementById('vendas-table-container');
    const totalVendas = document.getElementById('total-vendas');

    totalVendas.textContent = `Total: ${vendas.length} vendas`;
    vendas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

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
                        <th>Valor Unitário</th>
                        <th>Valor Total</th>
                        <th>Parcelas</th>
                        <th>Vencimentos</th>
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

        const parcelasInfo = venda.parcelas ? `${venda.parcelas}x` : 'À vista';

        const rowId = `venda-row-${index}`;
        const userIdCellId = `user-${index}`;
        const productIdCellId = `produto-nome-${venda.id}`;
        const valorTotalCellId = `valor-total-${venda.id}`;

        tableHTML += `
            <tr id="${rowId}">
                <td id="${userIdCellId}">Carregando...</td>
                <td id="${productIdCellId}">Carregando...</td>
                <td>${venda.qtd_produto || 0}</td>
                <td id="${valorTotalCellId}">Calculando...</td>
                <td><span title="Parcelas">${parcelasInfo}</span></td>
                <td>
                  ${renderVencimentoParcelas(venda.vencimento_parcelas)}
                </td>
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

        getUserName(venda.user_id).then(nome => {
            const el = document.getElementById(userIdCellId);
            if(el) el.textContent = nome;
        });

        getProductInfo(venda.produto_id).then(produto => {
            const produtoCell = document.getElementById(productIdCellId);
            const valorTotalCell = document.getElementById(valorTotalCellId);

            if (produto) {
                if (produtoCell) produtoCell.textContent = produto.name;

                const valorUnitario = parseFloat(produto.valor) || 0;
                const quantidade = parseInt(venda.qtd_produto) || 0;
                const valorTotal = valorUnitario * quantidade;

                if (valorTotalCell) {
                    valorTotalCell.textContent = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(valorTotal);
                }
            } else {
                if (produtoCell) produtoCell.textContent = 'Produto não encontrado';
                if (valorTotalCell) valorTotalCell.textContent = 'R$ 0,00';
            }
        });
    });

    tableHTML += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = tableHTML;
}


function renderVencimentoParcelas(parcelas) {
    if (!parcelas || !Array.isArray(parcelas) || parcelas.length === 0) {
        return 'N/A';
    }

    // monta a tabela interna
    let subTable = `
      <table class="table table-sm table-bordered mb-0">
        <thead>
          <tr>
            <th>Data</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
    `;

    parcelas.forEach(p => {
        // Se os valores forem string, só mostrar mesmo
        const data = p.data || p;  // se for string simples, cai aqui
        const valor = p.valor ?? '-';

        // Formata valor como moeda BRL
        const valorFormatado = typeof valor === 'number'
            ? new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(valor)
            : valor;

        subTable += `
          <tr>
            <td>${data}</td>
            <td>${valorFormatado}</td>
          </tr>
        `;
    });

    subTable += `
        </tbody>
      </table>
    `;

    return subTable;
}


// funções auxiliares para a parte de busca e edição
function renderParcelasInput(containerId, datas = [], valorTotal = 0) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const qtdParcelas = Math.max(datas.length, 1);
    const valorBase = Math.floor((valorTotal / qtdParcelas) * 100) / 100;
    let restante = valorTotal;

    container.innerHTML = '';

    for (let i = 0; i < qtdParcelas; i++) {
        const data = datas[i] || '';
        let valorParcela = (i === qtdParcelas - 1) ? restante : valorBase;
        valorParcela = Math.round(valorParcela * 100) / 100;
        restante -= valorParcela;

        const row = document.createElement('div');
        row.className = 'row mb-2';

        const dataId = `${containerId}-data-parcela-${i}`;
        const valorId = `${containerId}-valor-parcela-${i}`;

        row.innerHTML = `
            <div class="col-6">
                <input type="text" class="form-control vencimento-data" id="${dataId}" value="${data}" placeholder="Data (dd/mm/yyyy)" autocomplete="off">
            </div>
            <div class="col-6">
                <input type="text" class="form-control vencimento-valor" id="${valorId}" value="${valorParcela.toFixed(2).replace('.', ',')}" placeholder="Valor da Parcela" autocomplete="off">
            </div>
        `;

        container.appendChild(row);

        IMask(document.getElementById(dataId), { mask: '00/00/0000' });
        IMask(document.getElementById(valorId), {
            mask: Number,
            scale: 2,
            signed: false,
            thousandsSeparator: '',
            padFractionalZeros: true,
            normalizeZeros: true,
            radix: ',',
            mapToRadix: ['.']
        });
    }

    addValorParcelaListeners(container, valorTotal);
}

async function getProductInfoById(productId) {
    try {
        const res = await api.get(`/product/findById/${productId}`);
        return res.data;
    } catch (error) {
        console.error('Erro ao buscar produto por nome:', error);
        return null;
    }
}

function addValorParcelaListeners(container, total) {
    const valores = container.querySelectorAll('.vencimento-valor');

    valores.forEach((input, index) => {
        input.addEventListener('input', () => {
            let soma = 0;
            for (let i = 0; i <= index; i++) {
                let valStr = valores[i].value.trim().replace(',', '.');
                soma += parseFloat(valStr) || 0;
            }

            let restante = total - soma;
            const parcelasRestantes = valores.length - (index + 1);

            if (parcelasRestantes <= 0) return;

            const valorRestante = Math.floor((restante / parcelasRestantes) * 100) / 100;

            for (let i = index + 1; i < valores.length; i++) {
                if (i === valores.length - 1) {
                    valores[i].value = restante.toFixed(2).replace('.', ',');
                } else {
                    valores[i].value = valorRestante.toFixed(2).replace('.', ',');
                    restante -= valorRestante;
                }
            }
        });
    });
}

async function initBuscaParcialProduto(callback, inputId = 'produto-busca', sugestoesId = 'produto-sugestoes') {
    const input = document.getElementById(inputId);
    const sugestoes = document.getElementById(sugestoesId);

    if (!input || !sugestoes) return;

    let timeout;

    input.addEventListener('input', async function () {
        clearTimeout(timeout);
        const query = this.value.trim();

        if (query.length < 2) {
            sugestoes.innerHTML = '';
            return;
        }

        timeout = setTimeout(async () => {
            try {
                const response = await api.get(`/product/findByName/${encodeURIComponent(query)}`);
                const produtos = response.data;

                sugestoes.innerHTML = '';

                if (produtos && produtos.length > 0) {
                    produtos.forEach(produto => {
                        const item = document.createElement('div');
                        item.className = 'list-group-item list-group-item-action';
                        item.innerHTML = `
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">${produto.name}</h6>
                                <small>R$ ${parseFloat(produto.valor).toFixed(2).replace('.', ',')}</small>
                            </div>
                        `;
                        item.addEventListener('click', () => {
                            input.value = produto.name;
                            sugestoes.innerHTML = '';
                            callback(produto.id, produto); // envia também o produto completo
                        });
                        sugestoes.appendChild(item);
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        }, 300);
    });
}

async function initBuscaParcialUsuario(callback, inputId = 'usuario-busca', sugestoesId = 'usuario-sugestoes') {
    const input = document.getElementById(inputId);
    const sugestoes = document.getElementById(sugestoesId);

    if (!input || !sugestoes) return;

    let timeout;

    input.addEventListener('input', async function () {
        clearTimeout(timeout);
        const query = this.value.trim();

        if (query.length < 2) {
            sugestoes.innerHTML = '';
            return;
        }

        timeout = setTimeout(async () => {
            try {
                const response = await api.get(`/user/findByName/${encodeURIComponent(query)}`);
                const usuarios = response.data;

                sugestoes.innerHTML = '';

                if (usuarios && usuarios.length > 0) {
                    usuarios.forEach(usuario => {
                        const item = document.createElement('div');
                        item.className = 'list-group-item list-group-item-action';
                        item.innerHTML = `
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">${usuario.name}</h6>
                                <small>${usuario.email}</small>
                            </div>
                        `;
                        item.addEventListener('click', () => {
                            input.value = usuario.name;
                            sugestoes.innerHTML = '';
                            callback(usuario.id, usuario); // envia também o usuário completo
                        });
                        sugestoes.appendChild(item);
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        }, 300);
    });
}

//Nova venda
async function atualizarValorTotalNovaVenda(produtoId, qtdProduto) {
    if (!produtoId) return 0;

    try {
        const produto = await getProductInfo(produtoId);
        if (!produto) return 0;

        const valorUnitario = parseFloat(produto.valor) || 0;
        return valorUnitario * qtdProduto;
    } catch {
        return 0;
    }
}

function getNovaVendaFormHTML() {
    return `
    <form id="form-nova-venda" autocomplete="off">
        <div class="mb-3">
            <label for="produto-busca" class="form-label">Produto</label>
            <input type="text" class="form-control" id="produto-busca" placeholder="Buscar produto pelo nome" autocomplete="off">
            <div id="produto-sugestoes" class="list-group mt-1"></div>
        </div>

        <div class="mb-3">
            <label for="usuario-busca" class="form-label">Usuário</label>
            <input type="text" class="form-control" id="usuario-busca" placeholder="Buscar usuário pelo nome" autocomplete="off">
            <div id="usuario-sugestoes" class="list-group mt-1"></div>
        </div>

        <div class="mb-3">
            <label for="qtd_produto" class="form-label">Quantidade</label>
            <input type="number" class="form-control" id="qtd_produto" value="1" min="1">
        </div>

         <div class="mb-3">
            <label for="valor_produto" class="form-label">Valor Unitário</label>
            <input type="number" class="form-control" id="valor_produto" value="1" min="1">
        </div>

        <div class="mb-3">
            <label for="parcelas" class="form-label">Parcelas</label>
            <input type="number" class="form-control" id="parcelas" value="1" min="1">
        </div>

        <div class="mb-3">
            <label for="pagamento" class="form-label">Forma de Pagamento</label>
            <input type="text" class="form-control" id="pagamento" placeholder="Ex: Cartão de Crédito">
        </div>

        <div class="mb-3">
            <label class="form-label">Vencimentos das Parcelas</label>
            <div id="nova-venda-parcelas-container"></div>
            <small class="text-muted">Informe as datas de vencimento das parcelas (dd/mm/yyyy)</small>
        </div>
    </form>
    `;
}

function configurarEventosNovaVenda(modal, callbacks = {}) {
    const selectedProdutoIdRef = { value: null };
    const selectedUsuarioIdRef = { value: null };
    const valorTotalRef = { value: 0 };

    const qtdProdutoInput = document.getElementById('qtd_produto');
    const parcelasInput = document.getElementById('parcelas');
    const valorUnitarioInput = document.getElementById('valor_produto');

    let valorUnitarioEditado = false;

    valorUnitarioInput.addEventListener('input', () => {
        valorUnitarioEditado = true;
        atualizarTudo();
    });

    initBuscaParcialProduto(async (produtoId) => {
        selectedProdutoIdRef.value = produtoId;
        callbacks.onProdutoSelecionado?.(produtoId);

        const produto = await getProductInfo(produtoId);
        if (produto && !valorUnitarioEditado) {
            valorUnitarioInput.value = parseFloat(produto.valor).toFixed(2); // usa ponto (.) para manter compatibilidade com parseFloat
        }

        atualizarTudo();
    });

    initBuscaParcialUsuario((usuarioId) => {
        selectedUsuarioIdRef.value = usuarioId;
        callbacks.onUsuarioSelecionado?.(usuarioId);
    });

    function atualizarTudo() {
        const qtdProduto = parseInt(qtdProdutoInput.value) || 1;
        const parcelas = Math.max(parseInt(parcelasInput.value) || 1, 1);
        const valorUnitario = parseFloat(valorUnitarioInput.value) || 0;
        const valorTotal = valorUnitario * qtdProduto;

        valorTotalRef.value = valorTotal;

        renderParcelasInput('nova-venda-parcelas-container', Array(parcelas).fill(''), valorTotal);

        callbacks.onValorTotalAtualizado?.(valorTotal);
    }

    qtdProdutoInput.addEventListener('input', atualizarTudo);
    parcelasInput.addEventListener('input', atualizarTudo);

    atualizarTudo();

    return {
        getSelectedProdutoId: () => selectedProdutoIdRef.value,
        getSelectedUsuarioId: () => selectedUsuarioIdRef.value,
        getValorTotal: () => valorTotalRef.value,
    };
}


function validarDadosVenda(produtoId, usuarioId, pagamento) {
    if (!produtoId) {
        alert('Selecione um produto válido.');
        return false;
    }
    if (!usuarioId) {
        alert('Selecione um usuário válido.');
        return false;
    }
    if (!pagamento) {
        alert('Selecione uma forma de pagamento.');
        return false;
    }
    return true;
}


function obterDadosFormulario() {
    const qtdProduto = parseInt(document.getElementById('qtd_produto').value) || 1;
    const parcelas = parseInt(document.getElementById('parcelas').value) || 1;
    const pagamento = document.getElementById('pagamento').value.trim();
    const valorUnitarioProduto = parseFloat(document.getElementById('valor_produto').value.replace(',', '.')) || 0;

    return { qtdProduto, parcelas, pagamento, valorUnitarioProduto };
}


function obterDadosParcelas() {
    const container = document.getElementById('nova-venda-parcelas-container');
    const datas = Array.from(container.querySelectorAll('.vencimento-data'))
        .map(input => input.value.trim());
    const valores = Array.from(container.querySelectorAll('.vencimento-valor'))
        .map(input => parseFloat(input.value.trim().replace(',', '.')) || 0);

    return { datas, valores };
}


async function calcularValorTotal(produtoId, qtdProduto) {
    try {
        const produtoInfo = await getProductInfo(produtoId);
        const valorUnitario = parseFloat(produtoInfo?.valor) || 0;
        return valorUnitario * qtdProduto;
    } catch (error) {
        console.error('Erro ao buscar informações do produto:', error);
        return 0;
    }
}


async function montarPayloadVenda(produtoId, usuarioId, dadosFormulario, dadosParcelas) {
    const { qtdProduto, parcelas, pagamento, valorUnitarioProduto } = dadosFormulario;
    const { datas, valores } = dadosParcelas;

    const valorTotal = valorUnitarioProduto * qtdProduto;

    const vencimento_parcelas = datas.map((data, index) => ({
        data,
        valor: valores[index]?.toString() ?? "0"
    }));

    return {
        produto_id: produtoId,
        user_id: usuarioId,
        qtd_produto: qtdProduto,
        parcelas,
        vencimento_parcelas,
        valor_total: valorTotal,
        pagamento,
        valor_unitario_produto: valorUnitarioProduto,
    };
}


async function criarVenda(vendaPayload) {
    try {
        console.log('Payload sendo enviado:', vendaPayload);

        const res = await api.post('/vendas/createVenda', vendaPayload);

        // Debug completo da resposta
        console.log('Resposta completa:', res);
        console.log('Status:', res.status);
        console.log('Data:', res.data);
        console.log('Headers:', res.headers);

        // Verificar se a requisição foi bem-sucedida
        if (res.status >= 200 && res.status < 300) {
            await getData();
            return true;
        }

        // Se chegou aqui, algo deu errado
        alert('Erro ao criar venda: Status ' + res.status);
        return false;

    } catch (err) {
        // Debug completo do erro
        console.error('=== DEBUG DO ERRO ===');
        console.error('Erro completo:', err);
        console.error('Erro message:', err.message);
        console.error('Erro response:', err.response);

        if (err.response) {
            console.error('Status do erro:', err.response.status);
            console.error('Data do erro:', err.response.data);
            console.error('Headers do erro:', err.response.headers);
        }

        // Verificar se mesmo com "erro", a venda foi criada (status 2xx)
        if (err.response && err.response.status >= 200 && err.response.status < 300) {
            console.log('Venda criada com sucesso mesmo com erro!');
            alert('Venda criada com sucesso!');
            await getData();
            return true;
        }

        alert('Erro ao criar venda: ' + (err.message || 'Erro desconhecido'));
        return false;
    }
}

// Função principal refatorada
window.openNovaVendaModal = function() {
    const modalEl = document.getElementById('modal-nova-venda');
    const modal = new bootstrap.Modal(modalEl);

    document.getElementById('modal-nova-venda-body').innerHTML = getNovaVendaFormHTML();

    const stateRefs = configurarEventosNovaVenda(modal);

    modal.show();

    const btnSalvar = document.getElementById('btn-salvar-nova-venda');
    if (btnSalvar) {
        btnSalvar.onclick = async () => {
            const produtoId = stateRefs.getSelectedProdutoId();
            const usuarioId = stateRefs.getSelectedUsuarioId();

            // Validar dados básicos
            if (!validarDadosVenda(produtoId, usuarioId, document.getElementById('pagamento').value.trim())) {
                return;
            }

            try {
                // Obter dados do formulário
                const dadosFormulario = obterDadosFormulario();
                const dadosParcelas = obterDadosParcelas();
                const vendaPayload = await montarPayloadVenda(produtoId, usuarioId, dadosFormulario, dadosParcelas);

                // Criar venda
                const sucesso = await criarVenda(vendaPayload);

                if (sucesso) {
                    modal.hide();
                }
            } catch (error) {
                console.error('Erro no processo de criação da venda:', error);
                alert('Erro inesperado ao criar venda.');
            }
        };
    }
};

//editar venda
function getEditVendaFormHTML(dados) {
    return `
    <form id="form-edit-venda" autocomplete="off">
        <div class="form-group">
            <label for="produto-busca-edit">Produto:</label>
            <input type="text" id="produto-busca-edit" class="form-control" placeholder="Digite o nome do produto">
            <div id="produto-sugestoes-edit" class="autocomplete-dropdown"></div>
        </div>

        <div class="form-group">
            <label for="usuario-busca-edit">Usuário:</label>
            <input type="text" id="usuario-busca-edit" class="form-control" placeholder="Digite o nome do usuário">
            <div id="usuario-sugestoes-edit" class="autocomplete-dropdown"></div>
        </div>

        <div class="mb-3">
            <label for="qtd_produto_edit" class="form-label">Quantidade</label>
            <input type="number" class="form-control" id="qtd_produto_edit" value="${dados.qtd_produto || 1}" min="1">
        </div>

        <div class="mb-3">
            <label for="parcelas_edit" class="form-label">Parcelas</label>
            <input type="number" class="form-control" id="parcelas_edit" value="${dados.parcelas || 1}" min="1">
        </div>

        <div class="mb-3">
            <label for="pagamento_edit" class="form-label">Forma de Pagamento</label>
            <input type="text" class="form-control" id="pagamento_edit" value="${dados.pagamento || ''}">
        </div>

        <div class="mb-3">
            <label class="form-label">Vencimentos das Parcelas</label>
            <div id="edit-venda-parcelas-container"></div>
            <small class="text-muted">Informe as datas de vencimento das parcelas (dd/mm/yyyy)</small>
        </div>
    </form>
    `;
}

async function configurarEventosEditVenda(modal, dados) {
    const selectedProdutoIdRef = { value: dados.produto_id };
    const selectedUsuarioIdRef = { value: dados.user_id };
    const valorTotalRef = { value: 0 };

    const qtdProdutoInput = document.getElementById('qtd_produto_edit');
    const parcelasInput = document.getElementById('parcelas_edit');
    const pagamentoInput = document.getElementById('pagamento_edit');
    const produtoBuscaInput = document.getElementById('produto-busca-edit');
    const usuarioBuscaInput = document.getElementById('usuario-busca-edit');
    const btnSalvar = document.getElementById('btn-salvar-edicao');
    const containerParcelas = document.getElementById('edit-venda-parcelas-container');

    // Preencher os campos com dados existentes
    const produtoInfo = await getProductInfoById(dados.produto_id);
    const usuarioNome = await getUserName(dados.user_id);

    produtoBuscaInput.value = produtoInfo?.name || '';
    produtoBuscaInput.placeholder = produtoInfo?.name || 'Produto não encontrado';

    usuarioBuscaInput.value = usuarioNome || '';
    usuarioBuscaInput.placeholder = usuarioNome || 'Usuário não encontrado';

    // Inicializa busca parcial reutilizando funções da criação
    initBuscaParcialProduto((produtoId, produtoData) => {
        selectedProdutoIdRef.value = produtoId;
        valorTotalRef.value = parseFloat(produtoData?.valor || 0) * (parseInt(qtdProdutoInput.value) || 1);
        atualizarParcelas();
    }, 'produto-busca-edit', 'produto-sugestoes-edit');

    initBuscaParcialUsuario((usuarioId) => {
        selectedUsuarioIdRef.value = usuarioId;
    }, 'usuario-busca-edit', 'usuario-sugestoes-edit');


    // Atualiza parcelas baseado nos campos atuais
    async function atualizarParcelas() {
        const qtdProduto = parseInt(qtdProdutoInput.value) || 1;
        const parcelas = Math.max(parseInt(parcelasInput.value) || 1, 1);

        const produtoId = selectedProdutoIdRef.value;
        const produtoInfo = await getProductInfoById(produtoId);
        const valorUnitario = parseFloat(produtoInfo?.valor || 0);
        const valorTotal = valorUnitario * qtdProduto;
        valorTotalRef.value = valorTotal;

        // Preserva as datas atuais se já existirem
        let datasAtuais = dados.vencimento_parcelas || [];
        while (datasAtuais.length < parcelas) datasAtuais.push('');
        datasAtuais = datasAtuais.slice(0, parcelas);

        renderParcelasInput('edit-venda-parcelas-container', datasAtuais, valorTotal);
    }

    qtdProdutoInput.addEventListener('input', atualizarParcelas);
    parcelasInput.addEventListener('input', atualizarParcelas);

    // Render inicial
    await atualizarParcelas();

    if (btnSalvar) {
        btnSalvar.onclick = async () => {
            const qtdProduto = parseInt(qtdProdutoInput.value) || 1;
            const parcelas = parseInt(parcelasInput.value) || 1;
            const pagamento = pagamentoInput.value.trim();
            const datas = Array.from(containerParcelas.querySelectorAll('.vencimento-data')).map(i => i.value.trim());
            const valores = Array.from(containerParcelas.querySelectorAll('.vencimento-valor')).map(i => parseFloat(i.value.trim().replace(',', '.')) || 0);

            const produtoId = selectedProdutoIdRef.value;
            const usuarioId = selectedUsuarioIdRef.value;

            if (!validarDadosVenda(produtoId, usuarioId, pagamento)) return;

            if (parcelas !== datas.length || parcelas !== valores.length) {
                alert('Número de parcelas não corresponde ao número de datas/valores informados.');
                return;
            }

            for (const data of datas) {
                if (!/\d{2}\/\d{2}\/\d{4}/.test(data)) {
                    alert('Por favor, insira as datas no formato dd/mm/yyyy.');
                    return;
                }
            }

            if (valores.some(v => isNaN(v) || v <= 0)) {
                alert('Insira valores válidos e positivos para todas as parcelas.');
                return;
            }

            const valorTotal = valorTotalRef.value;
            const somaParcelas = valores.reduce((acc, curr) => acc + curr, 0);
            if (Math.abs(somaParcelas - valorTotal) > 0.01) {
                alert(`A soma das parcelas (${somaParcelas.toFixed(2)}) deve ser igual ao valor total (${valorTotal.toFixed(2)}).`);
                return;
            }

            const vendaPayload = {
                id: dados.id,
                produto_id: produtoId,
                user_id: usuarioId,
                qtd_produto: qtdProduto,
                parcelas: parcelas,
                vencimento_parcelas: datas,
                valor_parcelas: valores,
                pagamento: pagamento,
            };

            console.log('Payload sendo enviado:', vendaPayload);
            await updateVenda(dados.id, vendaPayload);
            modal.hide();
        };
    }
}

async function updateVenda(vendaId, vendaPayload) {
    try {
        const res = await api.patch(`/vendas/updateVenda/${vendaId}`, vendaPayload);

        if (res.data.success) {
            alert('Venda atualizada com sucesso!');
            await getData();
            return true;
        } else {
            alert('Erro ao atualizar venda: ' + (res.data.message || 'Erro desconhecido'));
            return false;
        }
    } catch (err) {
        console.error('Erro ao atualizar venda:', err);
        alert('Erro ao atualizar venda.');
        return false;
    }
}



// Torna a função global
window.editVenda = async function(vendaId) {
    try {
        const response = await api.get(`/vendas/findById/${vendaId}`);
        const dados = response.data;

        if (!dados) {
            alert('Venda não encontrada');
            return;
        }

        const modalEl = document.getElementById('modal-editar-venda');
        const modal = new bootstrap.Modal(modalEl);

        document.getElementById('modal-editar-venda-body').innerHTML = getEditVendaFormHTML(dados);

        await configurarEventosEditVenda(modal, dados);

        modal.show();
    } catch (err) {
        console.error('Erro ao carregar venda para edição:', err);
        alert('Erro ao carregar venda para edição.');
    }
};

window.deleteVenda = async function(vendaId) {
    if (!confirm('Tem certeza que deseja excluir essa venda?')) return;

    try {
        const res = await api.delete(`/vendas/deleteVenda/${vendaId}`);

        if (res.data.success) {
            alert('Venda excluída com sucesso!');
            await getData();
        } else {
            alert('Erro ao excluir venda: ' + (res.data.message || 'Erro desconhecido'));
        }
    } catch (err) {
        console.error('Erro ao excluir venda:', err);
        alert('Erro ao excluir venda.');
    }
};

window.addEventListener('load', () => {
    console.log('API_BASE_URL:', API_BASE_URL);
    getData();

});

document.addEventListener('DOMContentLoaded', () => {
    configurarEventosFiltroVendas();
});

// Filtragem das vendas

//Filtra por data
async function filterByData(dataInicial, dataFinal) {
    try {
        const res = await api.get(`/vendas/filterByDate/${dataInicial}/${dataFinal}`);
        const vendasFiltradas = res.data;
        renderVendasTable(vendasFiltradas);
    } catch (err) {
        alert("Não há vendas desse produto")
        alert("nenhuma venda encontrada neste intervalo")
    }
}

// filtragem por nome
function initFiltroUsuarioBuscaParcial() {
    const input = document.getElementById('filter-user-name');
    const sugestoes = document.getElementById('filter-user-sugestoes');

    if (!input || !sugestoes) return;

    let timeout;

    input.addEventListener('input', async function () {
        clearTimeout(timeout);
        const query = this.value.trim();

        if (query.length < 2) {
            sugestoes.innerHTML = '';
            return;
        }

        timeout = setTimeout(async () => {
            try {
                const res = await api.get(`/user/findByName/${encodeURIComponent(query)}`);
                const usuarios = res.data;

                sugestoes.innerHTML = '';

                if (usuarios && usuarios.length > 0) {
                    usuarios.forEach(usuario => {
                        const item = document.createElement('div');
                        item.className = 'list-group-item list-group-item-action';
                        item.innerHTML = `
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">${usuario.name}</h6>
                                <small>${usuario.email}</small>
                            </div>
                        `;
                        item.addEventListener('click', () => {
                            input.value = usuario.name;
                            sugestoes.innerHTML = '';
                            filterByUser(usuario.id);
                        });
                        sugestoes.appendChild(item);
                    });
                }
            } catch (err) {
                console.error('Erro ao buscar usuários (filtro):', err);
            }
        }, 300);
    });
}

function initFiltroProdutoBuscaParcial() {
    const input = document.getElementById('filter-product-name');
    const sugestoes = document.getElementById('filter-product-sugestoes');

    if (!input || !sugestoes) return;

    let timeout;

    input.addEventListener('input', async function () {
        clearTimeout(timeout);
        const query = this.value.trim();

        if (query.length < 2) {
            sugestoes.innerHTML = '';
            return;
        }

        timeout = setTimeout(async () => {
            try {
                const res = await api.get(`/product/findByName/${encodeURIComponent(query)}`);
                const produtos = res.data;

                sugestoes.innerHTML = '';

                if (produtos && produtos.length > 0) {
                    produtos.forEach(produto => {
                        const item = document.createElement('div');
                        item.className = 'list-group-item list-group-item-action';
                        item.innerHTML = `
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">${produto.name}</h6>
                                <small>R$ ${parseFloat(produto.valor).toFixed(2).replace('.', ',')}</small>
                            </div>
                        `;
                        item.addEventListener('click', () => {
                            input.value = produto.name;
                            sugestoes.innerHTML = '';
                            filterByProduct(produto.id);
                        });
                        sugestoes.appendChild(item);
                    });
                }
            } catch (err) {
                console.error('Erro ao buscar produtos (filtro):', err);
            }
        }, 300);
    });
}


async function filterByUser(userId) {
    try {
        const res = await api.get(`/vendas/filterByUser/${userId}`);
        const vendasFiltradas = res.data;
        renderVendasTable(vendasFiltradas);
    } catch (err) {
        alert("Não há vendas desse usuário")
        getData()
    }
}

async function filterByProduct(productId) {
    try {
        const res = await api.get(`/vendas/filterByProduct/${productId}`);
        const vendasFiltradas = res.data;
        renderVendasTable(vendasFiltradas);
    }catch (err) {
        console.error('Erro ao buscar vendas filtradas:', err);
        getData()
    }
}
//função pricipal da filtragem
let selectedUserId = null;
let selectedProductId = null;

function filterVendas() {
    const dataInicial = document.getElementById('filter-date-start').value;
    const dataFinal = document.getElementById('filter-date-end').value;
    const nomeUsuario = document.getElementById('filter-user-name').value.trim().toLowerCase();
    const nomeProduto = document.getElementById('filter-product-name').value.trim().toLowerCase();

    let vendasFiltradas = [...vendasData]; // começa com todas

    if (dataInicial && dataFinal) {
        const inicio = new Date(dataInicial);
        const fim = new Date(dataFinal);
        vendasFiltradas = vendasFiltradas.filter(venda => {
            const dataVenda = new Date(venda.created_at);
            return dataVenda >= inicio && dataVenda <= fim;
        });
    }

    if (selectedUserId) {
        vendasFiltradas = vendasFiltradas.filter(venda => venda.user_id === selectedUserId);
    }

    if (selectedProductId) {
        vendasFiltradas = vendasFiltradas.filter(venda => venda.produto_id === selectedProductId);
    }

    // Filtros de texto como fallback (caso o id não tenha sido selecionado ainda)
    if (nomeUsuario && !selectedUserId) {
        vendasFiltradas = vendasFiltradas.filter(venda =>
            venda.user_name?.toLowerCase().includes(nomeUsuario)
        );
    }

    if (nomeProduto && !selectedProductId) {
        vendasFiltradas = vendasFiltradas.filter(venda =>
            venda.produto_nome?.toLowerCase().includes(nomeProduto)
        );
    }

    renderVendasTable(vendasFiltradas);
}


function configurarEventosFiltroVendas() {
    initBuscaParcialProduto((produtoId) => {
        selectedProductId = produtoId;
        filterVendas();
    }, 'filter-product-name', 'filter-product-sugestoes');

    initBuscaParcialUsuario((usuarioId) => {
        selectedUserId = usuarioId;
        filterVendas();
    }, 'filter-user-name', 'filter-user-sugestoes');
}



// Criação de um novo usuário e de um novo produto

// novo usuário
function openModalNovoUsuario() {

}

function aplicarMascaraCPF(campo) {
    campo.addEventListener('input', () => {
        let valor = campo.value.replace(/\D/g, '');

        if (valor.length > 11) valor = valor.slice(0, 11);

        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        campo.value = valor;
    });
}

async  function doRequestRegister(payload) {
    try {
        console.log(payload);
        const response = await api.post('/user/create', {
            name:payload.name,
            email:payload.email,
            cpf:payload.cpf,
            password:payload.password,
        });
        console.log(`Status da requisição ${response.status}`);
        if(response.status === 201){
            window.location.href = '/';
        }

    } catch (error) {
        console.error(error);
        if (error.response?.data?.message) {
            console.error(error.response.data.message)
        } else if (error.response?.data?.errors) {
            const firstError = Object.values(error.response.data.errors)[0][0];
            console.error(firstError)
        } else {
            console.error("Erro ao criar conta. Tente novamente.") ;
        }
    }

}


// novo produto
function openModalNovoProduto() {
}
