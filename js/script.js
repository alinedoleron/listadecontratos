var header;
var contents;
var colunasEscondidas = [];
var resultadoBusca= []; // guarda os ids da ultima busca
var months={'Jan':'00','Fev': '01', 'Mar': '02', 'Abr' : '03' , 'Mai' : '04',
'Jun':'05' ,'Jul':'06' ,'Ago':'07' ,'Set':'08' ,'Out':'09', 'Nov':'10', 'Dez':'11'};
var lastCol;

function decrescente(a, b) {
  var retorno = crescente(a, b);
  return -1*retorno;
}

//Ordena as colunas.
function ordenar(id) {
  chave = $('#'+id).text();
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
      func = decrescente;
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
  if(a[chave].match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/) != null) {
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
    bb = bb[0] + "" + months[bb[1]];
    return aa < bb ? -1 : (aa > bb ? 1 : 0);
  }
  else if(a[chave].match(/MWméd$/) != null) {
    var aa = parseFloat(a[chave].replace(",","."));
    var bb = parseFloat(b[chave].replace(",","."));
    return aa - bb;
  } //ordenação de números
  else if(a[chave].match(/^\d+,\d+$/) != null) {
    return parseFloat(a[chave]) - parseFloat(b[chave]);
  }
  else {
    return a[chave]<b[chave] ? -1 : a[chave]>b[chave] ? 1 : 0;
  }

}

//Carrega os checkboxes
function carregarCheckBoxes() {
  for (var i=0; i<header.length ; i++) {
    var el = $("<li>", {class: "checkboxes"});
    var inp = $("<input>", {class: "ccol_" + i, type: "checkbox",
    checked: true}).appendTo(el);
    inp.change(function (){
      addRemColunas(this.className);
    });
    var p = $("<span>", {class: "text-checkbox"}).append(header[i]);
    el.append(p);
    el.appendTo($("#dropdown"));
  }
}

//Adicionar/remover colunas da tabela
function addRemColunas(classe) {
  if(!$('.'+classe).is(':checked')) {
    colunasEscondidas.push(classe.slice(1));
    $("#"+classe.slice(1)).addClass("hidden");
    $("."+classe.slice(1)).addClass("hidden");

  } else {
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
  var table = $('#table-content');
  table.empty();
  for (var i=0; i<contents.length ; i++) {
    var tr = $("<tr>", {id: "item_"+ i })
    table.append(tr);
    for(var j=0; j<header.length ; j++) {
      var content = Object.values(contents[i]);
      var td = $("<td>", {"data-toggle":"modal", "data-target":"#myModal",
      class:"col_"+j}).append(content[j]);
      tr.append(td);

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
        var modal = $("#modal-form");
        var div_form = $("<div>", {id:"contract-data"+i, class:"form-group"});
        modal.append(div_form);
        var label = $("<label>", {id:"input"+header[i].toLowerCase().replace(/\s/g, ''),
        class:"control-label"}).append(header[i]);
        div_form.append(label);
        var input = $("<input>", {type:"text", class:"form-control",
        id: header[i].toLowerCase().replace(/\s/g, ''), value:elementos[i],
        placeholder:elementos[i], required:"true"});
        div_form.append(input);
        var div_validation = $("<div>", {class:"help-block with-errors"});
        div_form.append(div_validation);

        if(elementos[i].match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/) != null) {
          input.prop("name", "date");
          input.prop("placeholder", "DD/MM/YYY");
          label.prop("for", "date");
        }

        else if(elementos[i].match(/^\w{3}\/\d{4}$/) != null) {
          input.prop("name", "date_month_name");
          input.prop("placeholder", "M/YYY");
          label.prop("for", "date_month_name");
        }

        if(header[i] === "Código") {
          $("#código").prop( "disabled", true );
        }
        modal.validator('update');
      }

      var div_save = $("<div>", {class:"form-group"});
      var button_save = $("<button>",
      {class: "btn btn-default edit-data-button"}).append("Salvar");
      div_save.append(button_save);
      modal.append(div_save);
    }

    //aplica o seletor de datas
    var date_input = $('input[name="date"]');
    var date_input_month_name = $('input[name="date_month_name"]');
    var option_standard={
      format: 'dd-mm-yyyy',
      todayHighlight: true,
      autoclose: true,
      language: 'pt-BR',
    };
    var option_monthName={
      format: 'M/yyyy',
      todayHighlight: true,
      autoclose: true,
      language: 'pt-BR',
      viewMode: "months",
      minViewMode: "months"
    };
    date_input.datepicker(option_standard);
    date_input_month_name.datepicker(option_monthName);
  });
}

//carrega o cabeçalho da tabela
function carregaCabecalho() {
  var table = $("#table-header");
  table.empty();
  for (var i=0; i<header.length ; i++) {
    var td = $("<td>", {class:"item-header", id: "col_"+i});
    td.click(function () {
      ordenar(this.id);
    });
    table.append(td);
    var p = $("<p>").append(header[i]);
    var col_obj = $('#col_'+i);
    col_obj.append(p);
    var span_up = $("<span>", {class: "glyphicon glyphicon-chevron-up hidden",  "aria-hidden":"true"});
    var span_down = $("<span>", {class: "glyphicon glyphicon-chevron-down hidden",  "aria-hidden":"true"});
    col_obj.append(span_up);
    col_obj.append(span_down);

  }
}


//buscar conteúdo
function buscarLinhas(event) {
  var linhas = [];
  resultadoBusca = [];
  $('#no-results').removeClass("hidden");
  for (var i=0; i<contents.length ; i++) {
    for (var j = 0; j < Object.values(contents[i]).length; j++) {
      if(Object.values(contents[i])[j].toLowerCase().match($("#search-text").val().toLowerCase()) != null) {
        linhas.push(contents[i]);
        resultadoBusca.push(contents[i]);
        break;
      }
    }
  }

  busca = linhas;
  preencheTabela(linhas);

  event.preventDefault();
  var no_results = $("#no-results");
  var table_header = $('#table-header');
  if(linhas.length == 0) {
    no_results.removeClass("hidden");
    table_header.addClass("hidden");
  } else {
    no_results.addClass("hidden");
    table_header.removeClass("hidden");
  }
}

//salvar os dados editados
function salvarDados(event) {
  $("#save-msg").empty();
  event.preventDefault();
  $("#modal-form").validator('validate');
  if($("#modal-form").has('.has-error').length == 0){
    contratoSelecionado = event.target;
    dadosForm = [];
    var linha;

    for (var i = 0; i < event.currentTarget.length-1; i++) {
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

    var save_msg = $("<p>", {class:"save-msg-success"}).append("Dados salvos com sucesso");
    $("#save-msg").append(save_msg);
    dadosForm = [];
  } else {
    var save_msg = $("<p>", {class:"save-msg-unsuccess"}).append("Preencha todos os dados");
    $("#save-msg").append(save_msg);
  }

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
    contents = dados.contracts;
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
