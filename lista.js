document.addEventListener("DOMContentLoaded",function(){
    carregarListaAtivos();
});

//funcao carrega todos os itens cadastrados e exibe apenas os com a situação "ativo"
//faz constante verificação dos valores inseridos no campo "Quantidade C", se o valor ultrapassar
//o valor cadastrado, entao o campo "Coletado" exibe "Coletado", enquanto não ultrapassa o valor
//o campo mantém exibindo vazio
function carregarListaAtivos(){
    const listaProdutos = JSON.parse(window.localStorage.getItem("listaProdutos")) || [];
    const corpoListaAtivos = document.getElementById("corpoListaAtivos");
    let corpoLinhas = "";

    listaProdutos.forEach(produto => {
        if (produto.situacao) {
            const rowId = `row-${produto.codProduto}`;
            const quantidadeCId = `quantidadeC-${produto.codProduto}`;
            const situacaoId = `situacao-${produto.codProduto}`;
            corpoLinhas += `<tr id="${rowId}">
                <td>${produto.codProduto}</td>
                <td>${produto.nomeProduto}</td>
                <td>${produto.unidade}</td>
                <td>${produto.quantidade}</td>
                <td><input id="${quantidadeCId}" type="number"></td>
                <td id="${situacaoId}">${produto.situacao ? "" : ""}</td>
            </tr>`;
        }
    });

    corpoListaAtivos.innerHTML = corpoLinhas;

    listaProdutos.forEach(produto => {
        if (produto.situacao) {
            const quantidadeCInput = document.getElementById(`quantidadeC-${produto.codProduto}`);
            const situacaoCell = document.getElementById(`situacao-${produto.codProduto}`);

            quantidadeCInput.addEventListener('input', function() {
                const inputVal = parseInt(quantidadeCInput.value, 10);
                if (!isNaN(inputVal) && inputVal >= produto.quantidade) {
                    situacaoCell.innerText = "Coletado";
                } else {
                    situacaoCell.innerText = "";
                }
            });
        }
    });
}

