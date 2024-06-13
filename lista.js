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
            const rowElement = document.getElementById(`row-${produto.codProduto}`);

            quantidadeCInput.addEventListener('input', function() {
                const inputVal = parseInt(quantidadeCInput.value, 10);
                if (!isNaN(inputVal) && inputVal >= produto.quantidade) {
                    situacaoCell.innerText = "Coletado";
                    rowElement.classList.add('strikethrough');
                } else {
                    situacaoCell.innerText = "";
                }
            });
        }
    });
    function checkIfAllCollected() {
        const allCollected = listaCompras.every(produto => produto.quantidadeComprada >= produto.quantidade);
        enviarServidorBtn.disabled = !allCollected;
    }

    enviarServidorBtn.addEventListener('click', function () {
        const dataToSend = listaCompras.map(produto => ({
            Nome: produto.nomeProduto,
            Unidade: produto.unidade,
            Quantidade: produto.quantidade,
            CodigoBarra: produto.codigoProduto,
            Ativo: produto.ativo,
            QuantComprada: produto.quantidadeComprada,
            CodProduto: produto.codigoProduto,
            CompraId: "1"
        }));

        fetch('https://6668d687f53957909ff946c7.mockapi.io/Compras/1/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
            .then(response => response.json())
            .then(data => {
                alert('Lista de compras enviada com sucesso!');
                localStorage.removeItem('listaProdutos');
                listaProdutos = [];
                listaCompras = [];
                renderCompras();
                checkIfAllCollected();
            })
            .catch((error) => {
                console.error('Erro ao enviar a lista de compras:', error);
            });
    });

    renderCompras();
    checkIfAllCollected();
};



