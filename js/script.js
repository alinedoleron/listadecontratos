var header;
var contents;
var isCheck = true;
var colunasEscondidas = [];
var resultadoBusca= []; // guarda os ids ultima busca
var months={'Jan':'00','Fev': '01', 'Mar': '02', 'Abr' : '03' , 'Mai' : '04', 'Jun':'05' ,'Jul':'06' ,'Ago':'07' ,
'Set':'08' ,'Out':'09', 'Nov':'10', 'Dez':'11'};
var lastCol;




function descrescente(a, b) {
  var retorno = crescente(a, b);
  //console.log(retorno);
  return (-1*retorno);

}

//Ordena as colunas. TODO: fazer a ordenação correta para datas
function ordenar(id) {
  chave = $('#'+id).text();
  //console.log(id);
  dadosOrdenados = [];
  dadosNaoOrdenados = [];
  if(resultadoBusca.length > 0) {
    dadosNaoOrdenados = resultadoBusca;
  } else {
    dadosNaoOrdenados = contents;
  }
  if(lastCol != id){
    $('#' + lastCol + " > .glyphicon-chevron-down").addClass("hidden");
    $('#' + lastCol + " > .glyphicon-chevron-up").addClass("hidden");
    $('#' + id + " > .glyphicon-chevron-down").toggleClass("hidden");
    func = crescente;
  } else {
      if ($('#' + id + " > .glyphicon-chevron-down").hasClass("hidden")){
        func = crescente;
      } else {
        func = descrescente;
      }
      $('#' + id + " > .glyphicon-chevron-down").toggleClass("hidden");
      $('#' + id + " > .glyphicon-chevron-up").toggleClass("hidden");
  }
  lastCol = id;
  var dadosOrdenados = Object.values(dadosNaoOrdenados).sort(func);
  preencheTabela(dadosOrdenados);
}

function crescente(a, b) {
  //ordenação de datas dd/mm/yyyy
  if(a[chave].match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/) != null) {
    var aa = a[chave].split('-').reverse().join();
    var bb = b[chave].split('-').reverse().join();
    return aa < bb ? -1 : (aa > bb ? 1 : 0);
  }  //ordena os codigos
  else if(a[chave].match(/^\d+\/\d{4}$/) != null) {
    var aa = a[chave].split('\/').reverse().join();
    var bb = b[chave].split('\/').reverse().join();
    return aa < bb ? -1 : (aa > bb ? 1 : 0);
  }
  //ordenação de datas M/yyyy
    else if(a[chave].match(/^\w{3}\/\d{4}$/) != null) {
    var aa = a[chave].split('\/').reverse();
    var bb = b[chave].split('\/').reverse();
    aa = aa[0] + "" + months[aa[1]];
    //console.log(aa);
    bb = bb[0] + "" + months[bb[1]];
    //console.log(bb);
    return aa < bb ? -1 : (aa > bb ? 1 : 0);
  }
  else if(a[chave].match(/MWméd$/) != null) {
    var aa = parseFloat(a[chave].replace(",","."));
    var bb = parseFloat(b[chave].replace(",","."));
    return aa - bb;
  } else if(a[chave].match(/^\d+,\d+$/) != null) {
    return parseFloat(a[chave]) - parseFloat(b[chave]);
  }
  else {
  //  console.log("strings");
    return a[chave]<b[chave] ? -1 : a[chave]>b[chave] ? 1 : 0;
  }

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
      $('#item_'+ i).append("<td data-toggle=\"modal\" data-target=\"#myModal\" class=\"col_"+j+"\">"+content[j]+"</td>");
    }
  }
  atualizarColunasEscondidas();
  $('#no-results').addClass("hidden");
  $('#table-header').removeClass("hidden");

  //carregar o formulário do modal
  $("tbody#table-content").children().click(function(e) {
    $("#modal-form").empty();
    $("#save-msg").empty();

    if(e.currentTarget.id!=null) {

      //preenchendo inputs do formulário
      for(var i=0; i<Object.values(contents[(e.currentTarget.id).slice(5)]).length; i++) {
        var elementos = Object.values(contents[(e.currentTarget.id).slice(5)]);
        $("#modal-form").append("<div id=\"contract-data"+i+"\" class=\"form-group\"></div>")
        $("#contract-data"+i).append("<label id=\"input"+header[i].toLowerCase().replace(/\s/g, '')+"\" class=\"control-label\">"+header[i]+"</label>");
        $("#contract-data"+i).append("<input type=\"text\" class=\"form-control\" id=\""+
        header[i].toLowerCase().replace(/\s/g, '')+
        "\" value=\""+elementos[i] + "\"placeholder=\""+elementos[i]+"\" required=\"true\">");
        $("#contract-data"+i).append("<div class=\"help-block with-errors\"></div>");

        if(elementos[i].match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/) != null) {
          $("#"+header[i].toLowerCase().replace(/\s/g, '')).prop("name", "date");
          $("#"+header[i].toLowerCase().replace(/\s/g, '')).prop("placeholder", "DD/MM/YYY");
          $("#input"+header[i].toLowerCase().replace(/\s/g, '')).prop("for", "date");
        }

        if(elementos[i].match(/^\w{3}\/\d{4}$/) != null) {
          $("#"+header[i].toLowerCase().replace(/\s/g, '')).prop("name", "date");
          $("#"+header[i].toLowerCase().replace(/\s/g, '')).prop("placeholder", "M/YYY");
          $("#input"+header[i].toLowerCase().replace(/\s/g, '')).prop("for", "date");
        }

        if(header[i] === "Código") {
          $("#código").prop( "disabled", true );
        }
        $("#modal-form").validator('update');
      }
      $("#modal-form").append("<div class=\"form-group\"><button  type=\"submit\"" +
      "class=\"btn btn-default edit-data-button\">Salvar</button></div>");
    }

    //aplica o seletor de datas
    var date_input = $('input[name="date"]');
    var date_input_month_name = $('input[name="date_month_name"]');
    console.log("date_input");
    console.log(date_input);
    var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
    var option_standard={
      format: 'dd-mm-yyyy',
      container: container,
      todayHighlight: true,
      autoclose: true,
    };
    var option_monthName={
      format: 'M/yyyy',
      container: container,
      todayHighlight: true,
      autoclose: true,
    };
    date_input.datepicker(option_standard);
    date_input_month_name.datepicker(option_monthName);
  });
}

//carrega o cabeçalho da tabela
function carregaCabecalho() {
  $('#table-header').empty();
  for (var i=0; i<header.length ; i++) {
    $('#table-header').append("<td class=\"item-header\" onclick=\"ordenar(this.id)\" id=\"col_"+i+"\"></td>");
    //$('#col_'+i).append("<p>"+header[i]+"<span class=\"glyphicon glyphicon-chevron-down\" aria-hidden=\"true\"></span>"+"</p>");
    $('#col_'+i).append("<p>"+header[i]+"</p>");
    $('#col_'+i).append("<span class=\"glyphicon glyphicon-chevron-up\" aria-hidden=\"true\"></span>");
    $('#col_'+i).append("<span class=\"glyphicon glyphicon-chevron-down\" aria-hidden=\"true\"></span>");
    $(".glyphicon-chevron-up").addClass("hidden");
    $(".glyphicon-chevron-down").addClass("hidden");

  }
}


//buscar conteúdo
function buscarLinhas(event) {
  var linhas = [];
  resultadoBusca = [];
  $('#no-results').removeClass("hidden");
  for (var i=0; i<contents.length ; i++) {
    //console.log(Object.values(contents[i])[0]);
    //if((Object.values(contents[i])).indexOf($("#search-text").val()) != -1) { // melhorar com javascript regular expression match
    for (var j = 0; j < Object.values(contents[i]).length; j++) {
      if(Object.values(contents[i])[j].toLowerCase().match($("#search-text").val().toLowerCase()) != null) {
        //console.log("linha "+ contents[i] +" - "+ Object.values(contents[i])[j].toLowerCase().match($("#search-text").val().toLowerCase()));
        linhas.push(contents[i]);
        resultadoBusca.push(contents[i]);
        break;
      }
    }
  }
  //console.log(linhas.length);

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

//salvar os dados editados
function salvarDados(event) {
  $("#save-msg").empty();
  event.preventDefault();
  contratoSelecionado = event.target;
  dadosForm = [];
  var linha;

  for (var i = 0; i < event.currentTarget.length-1; i++) {
    console.log((event.currentTarget)[i].value);
    dadosForm.push((event.currentTarget)[i].value);
  }
  for (var i = 0; i < contents.length; i++) {
    if(Object.values(contents[i])[0].match((event.target)[0].value) != null) {
      linha = i;
      break;
    }
  }
  for (var i=0; i<header.length; i++) {
    contents[linha][header[i]] = dadosForm[i];
  }
  //TODO adicionar bolinha girando antes de salvar
  $("#save-msg").append("<p class=\"save-msg-success\">Dados salvos com sucesso</p>")
  console.log(contents);
  dadosForm = [];
}



function atualizar() {
  $("#search-text").val("");
  resultadoBusca = [];
  dadosOrdenados = [];
  dadosNaoOrdenados = [];
  preencheTabela(contents);
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



    $("#refresh").on('click', atualizar);


    $("#modal-form").on('submit', salvarDados);
    $('#closeModal').click(function () {
      atualizar();
    })



  }

)
}
);
