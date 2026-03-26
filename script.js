let idProdutoEditando = null;

// SALVAR OU ATUALIZAR
async function salvarProduto() {
    const nome = document.getElementById('nomeProduto').value;
    const preco = parseFloat(document.getElementById('precoProduto').value);
    const codigoBarras = document.getElementById('codigoBarras').value;
    const estoque = parseInt(document.getElementById('estoqueProduto').value);

    if (!nome || isNaN(preco) || !codigoBarras || isNaN(estoque)) {
        alert("Preencha todos os campos!");
        return;
    }

    const produto = { nome, preco, codigoBarras, estoque, ativo: true };
    const metodo = idProdutoEditando ? 'PUT' : 'POST';
    const url = idProdutoEditando 
        ? `http://localhost:8080/produtos/${idProdutoEditando}` 
        : 'http://localhost:8080/produtos';

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });

        if (resposta.ok) {
            idProdutoEditando = null;
            document.getElementById('btnSalvar').textContent = "Salvar no Banco";
            document.getElementById('btnSalvar').style.backgroundColor = "#1a73e8";
            document.querySelectorAll('input').forEach(i => i.value = '');
            carregarProdutos();
        }
    } catch (e) { console.error(e); }
}

// CARREGAR LISTA
async function carregarProdutos() {
    try {
        const res = await fetch('http://localhost:8080/produtos');
        const produtos = await res.json();
        renderizarLista(produtos);
    } catch (e) { console.error(e); }
}

// PESQUISAR
async function pesquisarProduto() {
    const termo = document.getElementById('inputPesquisa').value;
    if (!termo.trim()) { carregarProdutos(); return; }

    try {
        const res = await fetch(`http://localhost:8080/produtos/buscar?nome=${termo}`);
        const produtos = await res.json();
        renderizarLista(produtos);
    } catch (e) { console.error(e); }
}

// DESENHAR LISTA NA TELA
function renderizarLista(produtos) {
    const ul = document.getElementById('lista-produtos');
    ul.innerHTML = '';
    produtos.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <span class="produto-info">${p.nome}</span><br>
                <span class="produto-preco">R$ ${p.preco.toFixed(2)}</span> | <small>Qtd: ${p.estoque}</small>
            </div>
            <div class="acoes">
                <button class="btn-icone btn-editar" onclick="prepararEdicao(${p.id}, '${p.nome}', ${p.preco}, '${p.codigoBarras}', ${p.estoque})">✏️</button>
                <button class="btn-icone btn-excluir" onclick="deletarProduto(${p.id})">🗑️</button>
            </div>`;
        ul.appendChild(li);
    });
}

// PREPARAR EDIÇÃO
function prepararEdicao(id, nome, preco, codigoBarras, estoque) {
    idProdutoEditando = id;
    document.getElementById('nomeProduto').value = nome;
    document.getElementById('precoProduto').value = preco;
    document.getElementById('codigoBarras').value = codigoBarras;
    document.getElementById('estoqueProduto').value = estoque;
    
    const btn = document.getElementById('btnSalvar');
    btn.textContent = "Atualizar Produto #" + id;
    btn.style.backgroundColor = "#fbc02d";
    window.scrollTo(0, 0);
}

// EXCLUIR
async function deletarProduto(id) {
    if (!confirm("Excluir produto?")) return;
    await fetch(`http://localhost:8080/produtos/${id}`, { method: 'DELETE' });
    carregarProdutos();
}

window.onload = carregarProdutos;