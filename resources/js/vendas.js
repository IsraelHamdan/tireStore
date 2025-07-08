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

        // Formatação dos valores monetários
        const valorUnitario = parseFloat(venda.valor_unitario_produto) || 0;
        const valorTotal = parseFloat(venda.valor_total) || 0;

        const valorUnitarioFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valorUnitario);

        const valorTotalFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valorTotal);

        const rowId = `venda-row-${index}`;
        const userIdCellId = `user-${index}`;
        const productIdCellId = `produto-nome-${venda.id}`;

        tableHTML += `
            <tr id="${rowId}">
                <td id="${userIdCellId}">Carregando...</td>
                <td id="${productIdCellId}">Carregando...</td>
                <td>${venda.qtd_produto || 0}</td>
                <td>${valorUnitarioFormatado}</td>
                <td>${valorTotalFormatado}</td>
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

        // Carrega o nome do usuário
        getUserName(venda.user_id).then(nome => {
            const el = document.getElementById(userIdCellId);
            if(el) el.textContent = nome;
        });

        // Carrega o nome do produto
        getProductInfo(venda.produto_id).then(produto => {
            const produtoCell = document.getElementById(productIdCellId);
            if (produto && produtoCell) {
                produtoCell.textContent = produto.name;
            } else if (produtoCell) {
                produtoCell.textContent = 'Produto não encontrado';
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

        // Aplicar máscaras
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

async function atualizarParcelasComValoresExistentes() {
    const qtdProduto = parseInt(qtdProdutoInput.value) || 1;
    const parcelas = Math.max(parseInt(parcelasInput.value) || 1, 1);
    const valorUnitario = parseFloat(valorUnitarioInput.value) || 0;
    const valorTotal = valorUnitario * qtdProduto;
    valorTotalRef.value = valorTotal;

    let datasAtuais = dados.vencimento_parcelas || [];
    let valoresAtuais = [];

    // Extrair datas e valores existentes
    if (Array.isArray(datasAtuais)) {
        valoresAtuais = datasAtuais.map(vp => parseFloat(vp.valor) || 0);
        datasAtuais = datasAtuais.map(vp => vp.data || '');
    }

    // Ajustar arrays para o novo número de parcelas
    while (datasAtuais.length < parcelas) datasAtuais.push('');
    while (valoresAtuais.length < parcelas) valoresAtuais.push(0);

    datasAtuais = datasAtuais.slice(0, parcelas);
    valoresAtuais = valoresAtuais.slice(0, parcelas);

    // Recalcular valores apenas se necessário
    const somaValoresAtuais = valoresAtuais.reduce((acc, val) => acc + val, 0);
    if (Math.abs(somaValoresAtuais - valorTotal) > 0.01) {
        // Redistribuir valores proporcionalmente
        const valorBase = Math.floor((valorTotal / parcelas) * 100) / 100;
        let restante = valorTotal;

        for (let i = 0; i < parcelas; i++) {
            if (i === parcelas - 1) {
                valoresAtuais[i] = restante;
            } else {
                valoresAtuais[i] = valorBase;
                restante -= valorBase;
            }
        }
    }

    // Renderizar campos
    renderParcelasInput('edit-venda-parcelas-container', datasAtuais, valorTotal);

    // Preencher com valores existentes após um pequeno delay para garantir que os campos foram criados
    setTimeout(() => {
        preencherValoresParcelas(document.getElementById('edit-venda-parcelas-container'), valoresAtuais);
    }, 100);
}

function preencherValoresParcelas(container, valoresParcelas) {
    const inputs = container.querySelectorAll('.vencimento-valor');
    inputs.forEach((input, index) => {
        if (valoresParcelas[index] !== undefined) {
            const valor = parseFloat(valoresParcelas[index].valor || valoresParcelas[index]);
            if (!isNaN(valor)) {
                input.value = valor.toFixed(2).replace('.', ',');
            }
        }
    });
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

// EDITAR VENDA

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
          <label for="valor_unitario_edit" class="form-label">Valor Unitário</label>
          <input type="number" class="form-control" id="valor_unitario_edit" value="" min="0" step="0.01">
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

// Função para debugar o botão salvar
async function configurarEventosEditVenda(modal, dados) {
    const selectedProdutoIdRef = { value: dados.produto_id };
    const selectedUsuarioIdRef = { value: dados.user_id };
    const valorTotalRef = { value: 0 };

    const qtdProdutoInput = document.getElementById('qtd_produto_edit');
    const parcelasInput = document.getElementById('parcelas_edit');
    const pagamentoInput = document.getElementById('pagamento_edit');
    const produtoBuscaInput = document.getElementById('produto-busca-edit');
    const usuarioBuscaInput = document.getElementById('usuario-busca-edit');
    const valorUnitarioInput = document.getElementById('valor_unitario_edit');
    const containerParcelas = document.getElementById('edit-venda-parcelas-container');

    // VERIFICAR SE O BOTÃO EXISTE
    const btnSalvar = document.getElementById('btn-salvar-edicao');
    console.log('Botão salvar encontrado:', btnSalvar);

    if (!btnSalvar) {
        console.error('ERRO: Botão btn-salvar-edicao não encontrado!');
        // Tentar encontrar outros botões possíveis
        const botoesPossiveis = document.querySelectorAll('button[id*="salvar"], button[class*="salvar"]');
        console.log('Botões possíveis encontrados:', botoesPossiveis);
        return;
    }

    // ... resto do código de inicialização ...

    const produtoInfo = await getProductInfoById(dados.produto_id);
    const usuarioNome = await getUserName(dados.user_id);

    produtoBuscaInput.value = produtoInfo?.name || '';
    produtoBuscaInput.placeholder = produtoInfo?.name || 'Produto não encontrado';

    usuarioBuscaInput.value = usuarioNome || '';
    usuarioBuscaInput.placeholder = usuarioNome || 'Usuário não encontrado';

    valorUnitarioInput.value = parseFloat(produtoInfo?.valor_unitario_produto || produtoInfo?.valor || 0).toFixed(2);

    // Configurar autocomplete
    initBuscaParcialProduto((produtoId, produtoData) => {
        selectedProdutoIdRef.value = produtoId;
        if (!valorUnitarioInput.dataset.editado) {
            valorUnitarioInput.value = parseFloat(produtoData?.valor || 0).toFixed(2);
        }
        atualizarParcelas();
    }, 'produto-busca-edit', 'produto-sugestoes-edit');

    initBuscaParcialUsuario((usuarioId) => {
        selectedUsuarioIdRef.value = usuarioId;
    }, 'usuario-busca-edit', 'usuario-sugestoes-edit');

    valorUnitarioInput.addEventListener('input', () => {
        valorUnitarioInput.dataset.editado = "true";
        atualizarParcelas();
    });

    // Função para atualizar parcelas
    async function atualizarParcelas() {
        const qtdProduto = parseInt(qtdProdutoInput.value) || 1;
        const parcelas = Math.max(parseInt(parcelasInput.value) || 1, 1);
        const valorUnitario = parseFloat(valorUnitarioInput.value) || 0;
        const valorTotal = valorUnitario * qtdProduto;
        valorTotalRef.value = valorTotal;

        let datasAtuais = dados.vencimento_parcelas || [];
        let valoresAtuais = [];

        // Extrair datas e valores existentes
        if (Array.isArray(datasAtuais)) {
            valoresAtuais = datasAtuais.map(vp => parseFloat(vp.valor) || 0);
            datasAtuais = datasAtuais.map(vp => vp.data || '');
        }

        // Ajustar arrays para o novo número de parcelas
        while (datasAtuais.length < parcelas) datasAtuais.push('');
        while (valoresAtuais.length < parcelas) valoresAtuais.push(0);

        datasAtuais = datasAtuais.slice(0, parcelas);
        valoresAtuais = valoresAtuais.slice(0, parcelas);

        // Recalcular valores apenas se necessário
        const somaValoresAtuais = valoresAtuais.reduce((acc, val) => acc + val, 0);
        if (Math.abs(somaValoresAtuais - valorTotal) > 0.01) {
            const valorBase = Math.floor((valorTotal / parcelas) * 100) / 100;
            let restante = valorTotal;

            for (let i = 0; i < parcelas; i++) {
                if (i === parcelas - 1) {
                    valoresAtuais[i] = restante;
                } else {
                    valoresAtuais[i] = valorBase;
                    restante -= valorBase;
                }
            }
        }

        // Renderizar campos
        renderParcelasInput('edit-venda-parcelas-container', datasAtuais, valorTotal);

        // Preencher com valores existentes
        setTimeout(() => {
            const container = document.getElementById('edit-venda-parcelas-container');
            const inputs = container.querySelectorAll('.vencimento-valor');
            inputs.forEach((input, index) => {
                if (valoresAtuais[index] !== undefined) {
                    const valor = parseFloat(valoresAtuais[index]);
                    if (!isNaN(valor)) {
                        input.value = valor.toFixed(2).replace('.', ',');
                    }
                }
            });
        }, 100);
    }

    qtdProdutoInput.addEventListener('input', atualizarParcelas);
    parcelasInput.addEventListener('input', atualizarParcelas);

    await atualizarParcelas();

    // CONFIGURAR EVENTO DO BOTÃO SALVAR COM DEBUGGING
    console.log('Configurando evento do botão salvar...');

    // Remover event listeners anteriores
    btnSalvar.replaceWith(btnSalvar.cloneNode(true));
    const btnSalvarNovo = document.getElementById('btn-salvar-edicao');

    btnSalvarNovo.addEventListener('click', async (event) => {
        console.log('Botão salvar clicado!');
        event.preventDefault();

        try {
            // Coletar dados do formulário
            const qtdProduto = parseInt(qtdProdutoInput.value) || 1;
            const parcelas = parseInt(parcelasInput.value) || 1;
            const pagamento = pagamentoInput.value.trim();
            const produtoId = selectedProdutoIdRef.value;
            const usuarioId = selectedUsuarioIdRef.value;
            const valorUnitario = parseFloat(valorUnitarioInput.value) || 0;
            const valorTotal = valorUnitario * qtdProduto;

            console.log('Dados coletados:', {
                qtdProduto,
                parcelas,
                pagamento,
                produtoId,
                usuarioId,
                valorUnitario,
                valorTotal
            });

            // Validar dados básicos
            if (!produtoId || !usuarioId) {
                console.error('Produto ou usuário não selecionado');
                alert('Por favor, selecione um produto e um usuário.');
                return;
            }

            if (!pagamento) {
                console.error('Forma de pagamento não informada');
                alert('Por favor, informe a forma de pagamento.');
                return;
            }

            // Coletar dados das parcelas
            const datas = Array.from(containerParcelas.querySelectorAll('.vencimento-data')).map(i => i.value.trim());
            const valores = Array.from(containerParcelas.querySelectorAll('.vencimento-valor')).map(i => {
                const valor = parseFloat(i.value.trim().replace(',', '.'));
                return isNaN(valor) ? 0 : valor;
            });

            console.log('Dados das parcelas:', { datas, valores });

            // Validar parcelas
            if (parcelas !== datas.length || parcelas !== valores.length) {
                console.error('Número de parcelas não corresponde');
                alert('Número de parcelas não corresponde ao número de datas/valores informados.');
                return;
            }

            // Validar formato das datas
            for (const data of datas) {
                if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
                    console.error('Data inválida:', data);
                    alert('Por favor, insira as datas no formato dd/mm/yyyy.');
                    return;
                }
            }

            // Validar valores das parcelas
            if (valores.some(v => isNaN(v) || v <= 0)) {
                console.error('Valores inválidos:', valores);
                alert('Insira valores válidos e positivos para todas as parcelas.');
                return;
            }

            // Validar soma das parcelas
            const somaParcelas = valores.reduce((acc, curr) => acc + curr, 0);
            if (Math.abs(somaParcelas - valorTotal) > 0.01) {
                console.error(`Soma das parcelas (${somaParcelas}) !== valor total (${valorTotal})`);
                alert(`A soma das parcelas (${somaParcelas.toFixed(2)}) deve ser igual ao valor total (${valorTotal.toFixed(2)}).`);
                return;
            }

            // Montar payload
            const vencimento_parcelas = datas.map((data, i) => ({
                data,
                valor: valores[i].toFixed(2)
            }));

            const vendaPayload = {
                id: dados.id,
                produto_id: produtoId,
                user_id: usuarioId,
                qtd_produto: qtdProduto,
                parcelas: parcelas,
                pagamento: pagamento,
                valor_unitario_produto: valorUnitario,
                valor_total: valorTotal,
                vencimento_parcelas,
            };

            console.log('Payload para envio:', vendaPayload);

            // Desabilitar botão para evitar duplo clique
            btnSalvarNovo.disabled = true;
            btnSalvarNovo.innerHTML = 'Salvando...';

            // Enviar dados
            const sucesso = await updateVenda(dados.id, vendaPayload);

            if (sucesso) {
                console.log('Venda atualizada com sucesso!');
                modal.hide();
            } else {
                console.error('Falha ao atualizar venda');
            }

        } catch (error) {
            console.error('Erro no evento do botão salvar:', error);
            alert('Erro inesperado ao salvar. Verifique o console para mais detalhes.');
        } finally {
            // Reabilitar botão
            btnSalvarNovo.disabled = false;
            btnSalvarNovo.innerHTML = 'Salvar';
        }
    });

    console.log('Evento do botão salvar configurado com sucesso!');
}

// Função melhorada para atualizar venda com mais debugging
async function updateVenda(vendaId, vendaPayload) {
    console.log('Iniciando updateVenda com:', { vendaId, vendaPayload });

    try {
        console.log('Enviando requisição PATCH para:', `/vendas/updateVenda/${vendaId}`);
        const res = await api.patch(`/vendas/updateVenda/${vendaId}`, vendaPayload);

        console.log('Resposta da API:', res);
        console.log('Status da resposta:', res.status);
        console.log('Dados da resposta:', res.data);

        if (res.data && res.data.success) {
            console.log('Venda atualizada com sucesso!');
            alert('Venda atualizada com sucesso!');

            // Recarregar dados se a função existir
            if (typeof getData === 'function') {
                console.log('Recarregando dados...');
                await getData();
            } else {
                console.warn('Função getData não encontrada');
            }

            return true;
        } else {
            const errorMessage = res.data?.message || 'Erro desconhecido';
            console.error('Erro na resposta da API:', errorMessage);
            alert('Erro ao atualizar venda: ' + errorMessage);
            return false;
        }
    } catch (err) {
        console.error('Erro na requisição:', err);
        console.error('Status do erro:', err.response?.status);
        console.error('Dados do erro:', err.response?.data);

        let errorMessage = 'Erro ao atualizar venda.';
        if (err.response?.data?.message) {
            errorMessage += ' ' + err.response.data.message;
        }

        alert(errorMessage);
        return false;
    }
}

// Função para validar dados da venda (caso não exista)
function validarDadosVenda(produtoId, usuarioId, pagamento) {
    if (!produtoId) {
        alert('Por favor, selecione um produto.');
        return false;
    }

    if (!usuarioId) {
        alert('Por favor, selecione um usuário.');
        return false;
    }

    if (!pagamento || pagamento.trim() === '') {
        alert('Por favor, informe a forma de pagamento.');
        return false;
    }

    return true;
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
        console.log(res.data)
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
    window.console.log('=== FORÇANDO LOG ===');

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



function debugBootstrap(title, data) {
    // Remove modal anterior, se existir
    const existing = document.getElementById('debug-bootstrap-modal');
    if (existing) existing.remove();

    // Cria o container modal/painel
    const modalHTML = `
  <div class="modal fade show" id="debug-bootstrap-modal" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-scrollable" role="document" style="max-width: 90vw;">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${title}</h5>
          <button type="button" class="btn-close" aria-label="Fechar" id="debug-close-btn"></button>
        </div>
        <div class="modal-body">
          <pre id="debug-content" style="white-space: pre-wrap; max-height: 60vh; overflow-y: auto; background: #f8f9fa; padding: 1rem; border-radius: .25rem;"></pre>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" id="debug-copy-btn">Copiar conteúdo</button>
          <button class="btn btn-secondary" id="debug-close-footer-btn">Fechar</button>
        </div>
      </div>
    </div>
  </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Preenche o conteúdo formatado
    const contentEl = document.getElementById('debug-content');
    try {
        contentEl.textContent = JSON.stringify(data, null, 2);
    } catch {
        contentEl.textContent = String(data);
    }

    // Botão copiar
    document.getElementById('debug-copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(contentEl.textContent)
            .then(() => alert('Conteúdo copiado para a área de transferência!'))
            .catch(() => alert('Falha ao copiar o conteúdo.'));
    });

    // Botões fechar
    const closeModal = () => {
        const modal = document.getElementById('debug-bootstrap-modal');
        if (modal) modal.remove();
    };
    document.getElementById('debug-close-btn').addEventListener('click', closeModal);
    document.getElementById('debug-close-footer-btn').addEventListener('click', closeModal);
}
