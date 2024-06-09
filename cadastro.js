//Seleção de elementos DOM
//Elemento DOM do formulário
const formulario = document.getElementById("formulario");

//Elementos DOM dos inputs
const codProduto = document.getElementById("cod-produto");
const nomeProduto = document.getElementById("nome-produto");
const unidade = document.getElementById("unidade");
const quantidade = document.getElementById("quantidade");
const codBarra = document.getElementById("cod-barra");
const situacao = document.getElementById("situacao");

//Variável que definirá código incremental da listaProdutos
let codigo;

//Classe Produtos
class Produtos{

    codProduto;
    nomeProduto;
    unidade;
    quantidade;
    codBarra;
    situacao;

    constructor (codProduto, nomeProduto, unidade, quantidade,codBarra, situacao) {
        this.codProduto = codProduto;
        this.nomeProduto = nomeProduto;
        this.unidade = unidade;
        this.quantidade = quantidade;
        this.codBarra = codBarra;
        this.situacao = situacao;
    }
}

//Carrega lista com objetos do localStorage assim que a página carrega
window.addEventListener("load", function() {
    carregarListaProdutos();
    carregarLista();
});

//Array de lista de produtos cadastrados
let listaProdutos;

//Checa se já existe uma listaProdutos no localStorage, se sim, pega seu conteúdo, se não, cria um array vazio
function carregarListaProdutos() {
    if(window.localStorage.getItem("listaProdutos")) {
        listaProdutos = JSON.parse(window.localStorage.getItem("listaProdutos"));
    } else {
        listaProdutos = [];
    }
    codigo = listaProdutos.length;
    codProduto.value = codigo + 1;
}

quantidade.addEventListener("keydown", teclasValidas);

//Observa eventos do tipo "submit" vindos de "formulario"
formulario.addEventListener("submit", function(event) {
    //Não deixa o form dar refresh
    event.preventDefault();

    //Salva produto
    salvarProduto();

    //Reseta informações do formulário p por novos produtos
    this.reset();

    //codProduto sempre incrementa
    codProduto.value = codigo + 1;

    //Carrega lista com novo item adicionado
    carregarLista();
})

function salvarProduto() {
    //Obtém índice de objeto de produto se ele existir, -1 se não existir
    const produtoExiste = verificaSeItemJáExiste();

    //Se produto existe, então é edição, logo os dados são apenas modificados
    if (produtoExiste !== -1) {
        listaProdutos[produtoExiste].nomeProduto = nomeProduto.value;
        listaProdutos[produtoExiste].unidade = unidade.value;
        listaProdutos[produtoExiste].quantidade = quantidade.value;
        listaProdutos[produtoExiste].codBarra = codBarra.value;
        listaProdutos[produtoExiste].situacao = Boolean(situacao.value);
        //listaProdutos[produto].nomeProduto = produto.value;
    } 
    //Caso produto ainda não existir
    else {

        //Incrementa "codigo"
        codigo++;

        //Cria novo objeto Produto
        const produto = new Produtos(codigo, nomeProduto.value, unidade.value, Number(quantidade.value), codBarra.value , Boolean(situacao.value));


        //Pusha produto em listaProdutos
        listaProdutos.push(produto);
    }

    stringificarListaProdutos();
    
}

function stringificarListaProdutos() {
    //Stringifica listaProdutos
    const listaProdutosStringify = JSON.stringify(listaProdutos);

    //Adiciona listaProdutosStringify ao localStorage
    window.localStorage.setItem("listaProdutos", listaProdutosStringify);
}

//Lista os itens no console
function listarItems() {
    console.log(codProduto.value);
    console.log(nomeProduto.value);
    console.log(unidade.value);
    console.log(quantidade.value);
    console.log(codBarra.value);
    console.log(Boolean(situacao.value));
}

//Obtém listaProdutos do localStorage e a retorna parseada 
function parseListaProdutos() {
    //Pega a lista no localStorage
    const listaProdutosParse = window.localStorage.getItem("listaProdutos");

    //Retorna lista parseada se lista não for null
    if (listaProdutosParse) {
        return JSON.parse(listaProdutosParse);
    }
    return "";
}

//Carrega novos itens dentro da lista
function carregarLista() {
    const corpoLista = document.getElementById("corpoLista");
    let corpoLinhas = "";

    
    for (const {codProduto, nomeProduto, unidade, quantidade, codBarra, situacao} of parseListaProdutos()) {
        corpoLinhas += `<tr>
                    <td>${codProduto}</td>
                    <td>${nomeProduto}</td>
                    <td>${unidade}</td>
                    <td>${quantidade}</td>
                    <td>${codBarra}</td>
                    <td>${situacao == true ? "Ativo" : "Não-ativo"}</td>
                    <td><button onclick="editar('${nomeProduto}')">Editar</button></td>
                    <td><button onclick="excluir('${codProduto}')">Excluir</button></td>
                        <tr>`
    }
    /* Teste com loop normal
    for (let i = 0; i < listaProdutos.length; i++) {
        const {codProduto, nomeProduto, unidade, quantidade, codBarra, situacao} = listaProdutos[i];

        corpoLinhas += `<tr>
                    <td>${codProduto}</td>
                    <td>${nomeProduto}</td>
                    <td>${unidade}</td>
                    <td>${quantidade}</td>
                    <td>${codBarra}</td>
                    <td>${situacao}</td>
                    <td><button onclick="editar('${nomeProduto}')">Editar</button></td>
                    <td><button>Excluir</button></td>
                        <tr>`
    }
    */
    corpoLista.innerHTML = corpoLinhas;
}

//Função para encontrar objeto de produto dentro do array listaProdutos
function encontraProduto(nomeProduto) {
    return listaProdutos.find(function(produto) {
        return produto.nomeProduto == nomeProduto;
    })
}

//Função para encontrar produto e permitir a sua edição
function editar(produtoEditado) {
    //Chama função encontraProduto() e procura pelo nome dele
    const produto = encontraProduto(produtoEditado);
    console.log(produto);

    //Atualiza campo de inserção com os dados do produto a ser editado
    codProduto.value = produto.codProduto;
    nomeProduto.value = produto.nomeProduto;
    unidade.value = produto.unidade;
    quantidade.value = produto.quantidade;
    codBarra.value = produto.codBarra;
    situacao.value = produto.situacao;
}

//Função que verifica se item já existe na hora de adicionar produto a listaProdutos
function verificaSeItemJáExiste() {
    const codigo = codProduto.value;

    //Retorna índice do objeto do produto, caso exista
    const produto =  listaProdutos.findIndex(function(produto) {
        return produto.codProduto == codigo;
    })

    //console.log(produto);

    //Retorno para manipulação dentro da função salvarProduto()
    return produto;
}

function excluir(codigoProduto) {
    //Guarda ińdice do objeto do produto a ser excluído
    const index = listaProdutos.findIndex(function(produto) {
        return produto.codProduto == codigoProduto;
    })
    console.log(index);

    //Remove 1 elemento do array contando do índice, isso é, o próprio índice é removido
    listaProdutos.splice(index,1);

    //Reorganiza ordem de codProduto de todos os produtos após exclusão
    reorganizarCodigos();

    //Stringifica a lista sem o elemento que foi excluído
    stringificarListaProdutos();

    //Carrega a nova lista que foi modficada na exclusão
    carregarLista();


}

function reorganizarCodigos() {
    for (let i = 0; i < listaProdutos.length; i++) {
        listaProdutos[i].codProduto = i + 1;
    }

    //Atribui length de listaProdutos a codigo p não sobreescrever outros items
    codigo = listaProdutos.length;

    //Exibe código correto e atualizado no campo
    codProduto.value = listaProdutos.length + 1;
}

//Não permite que letras sejam digitadas, usada no input "quantidade"
function teclasValidas(event) {
    const teclasValidas = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Backspace",
      ".",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown"
    ];
  
    if (!teclasValidas.includes(event.key)) {
      event.preventDefault();
    }
}
