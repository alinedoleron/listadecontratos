var header;
var contents;
var isCheck = true;
var colunasEscondidas = [];
var resultadoBusca= []; // guarda os ids ultima busca



//Ordena as colunas TODO: fazer a ordenação funcionar para o campo buscado
function ordenar(id) {
  chave = $('#'+id).text();
  dadosOrdenados = [];
  dadosNaoOrdenados = [];
  if(resultadoBusca.length > 0) {
    dadosNaoOrdenados = resultadoBusca;
  } else {
    dadosNaoOrdenados = dados.contracts;
  }

  var dadosOrdenados = Object.values(dadosNaoOrdenados).sort(function(a, b) {
    if (a[chave] < b[chave]) {
      return -1;
    }
    if (a[chave] > b[chave]) {
      return 1;
    }
    return 0;
  });

  preencheTabela(dadosOrdenados);
}

//Carrega os checkboxes
function carregarCheckBoxes() {
  for (var i=0; i<header.length ; i++) {
    $('#dropdown').append("<li class=\"checkboxes \"><input class=\"ccol_"+ i +"\" type=\"checkbox\" onchange=\"addRemColunas(this.className)\">"+header[i]+"</li>");
    $('.ccol_'+i).prop("checked", true);
  }

}

//Adicionar/remover colunas da tabela
function addRemColunas(classe) {
  if(!$('.'+classe).is(':checked')) {
    colunasEscondidas.push(classe.slice(1));
    $("#"+classe.slice(1)).addClass("hidden");
    $("."+classe.slice(1)).addClass("hidden");

  } else {
    colunasEscondidas.splice(colunasEscondidas.indexOf(classe.slice(1)),1);
    $("#"+classe.slice(1)).removeClass("hidden");
    $("."+classe.slice(1)).removeClass("hidden");
  }
  //console.log(colunasEscondidas);
}

//adiciona a classe "hidden" às colunas removidas
function atualizarColunasEscondidas() {
  for(var i = 0; i < colunasEscondidas.length; i++) {
    $("#"+colunasEscondidas[i]).addClass("hidden");
    $("."+colunasEscondidas[i]).addClass("hidden");
  }
}


//Prenchendo a tabela com os dados
function preencheTabela(contents) {
  $('#table-content').empty();
  for (var i=0; i<contents.length ; i++) {
    $('#table-content').append("<tr id=\"item_"+ i +"\"></tr>");
    for(var j=0; j<header.length ; j++) {
      var content = Object.values(contents[i]);
      $('#item_'+ i).append("<td class=\"col_"+j+"\">"+content[j]+"</td>");
    }
  }
  atualizarColunasEscondidas();
  $('#no-results').addClass("hidden");
  $('#table-header').removeClass("hidden");


}

//carrega o cabeçalho da tabela
function carregaCabecalho() {
  $('#table-header').empty();
  for (var i=0; i<header.length ; i++) {
    $('#table-header').append("<td class=\"item-header\" onclick=\"ordenar(this.id)\" id=\"col_"+i+"\"></td>");
    $('#col_'+i).append("<p>"+header[i]+"<span class=\"glyphicon glyphicon-chevron-down\" aria-hidden=\"true\"></span>"+"</p>");

  }
}

$("#refresh").click(function() {
  preencheTabela(contents);
});

function buscarLinhas(event) {
  var linhas = [];
  resultadoBusca = [];
  $('#no-results').removeClass("hidden");
  for (var i=0; i<contents.length ; i++) {
    //console.log(Object.values(contents[i])[0]);
    //if((Object.values(contents[i])).indexOf($("#search-text").val()) != -1) { // melhorar com javascript regular expression match
    for (var j = 0; j < Object.values(contents[i]).length; j++) {
      if(Object.values(contents[i])[j].toLowerCase().match($("#search-text").val().toLowerCase()) != null) {
        console.log("linha "+ contents[i] +" - "+ Object.values(contents[i])[j].toLowerCase().match($("#search-text").val().toLowerCase()));
        linhas.push(contents[i]);
        resultadoBusca.push(contents[i]);
        break;
      }

    }
  }

  console.log(linhas.length);

  busca = linhas;
  preencheTabela(linhas);
  event.preventDefault();
  if(linhas.length == 0) {
    $('#no-results').removeClass("hidden");
    $('#table-header').addClass("hidden");
  } else {
    $('#no-results').addClass("hidden");
    $('#table-header').removeClass("hidden");
  }
}


//inicializa a tabela
$(document).ready(function(){
  $("#search-form").on('submit', buscarLinhas);


  $.getJSON('./js/dados.json', function(data) {
    dados = data;
    header = Object.keys(dados.contracts[0]);
    contents = Object.values(dados.contracts);

    carregarCheckBoxes();

    carregaCabecalho();

    preencheTabela(contents);

    // $("#refresh").on('click', preencheTabela);
    $("#refresh").click(function() {
      $("#search-text").val("");
      resultadoBusca = [];
      dadosOrdenados = [];
      dadosNaoOrdenados = [];
      preencheTabela(contents);
    });



  }

)
}
);
