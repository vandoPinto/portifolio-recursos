/* Preparar o documento */
var $main = $("main");
var $tela = $("#tela");
var $barraProgresso = $(".nav-telas-progresso a");
var $botaoProxima = $(".nav-telas-proxima");
var $botaoAnterior = $(".nav-telas-anterior");
var totalTelas = $barraProgresso.length;
var alturaTela = $tela.outerHeight();
var larguraTela = $tela.outerWidth();
var telaAtual = 0;
var progressoGeral = [1];
var audio = window.speechSynthesis;
var telaUrl = window.location.href.split("#tela-")[1];
//console.log(telaUrl);
if (telaUrl) {
    if (telaUrl > totalTelas + 1 || telaUrl == 0) {
        telaAtual = 1;
    } else {
        telaAtual = telaUrl;
    }
}

$("a[href^='#tela-']").each(function (i) {
    var numTela = parseInt($(this).attr("href").split("-")[1]);
    $(this).click(function () {
        carregarTela(numTela);
    });
});


$barraProgresso.each(function (i) {
    $(this).attr("href", "#tela-" + (i + 1))
        .click(function () {
            carregarTela(i + 1);
        });
});

$(".nav-indice-abrir").click(abrirIndice);
$(".nav-indice-fechar").click(fecharIndice);

$botaoProxima.click(function () {
    carregarTela(telaAtual + 1);
})
$botaoAnterior.click(function () {
    carregarTela(telaAtual - 1);
})

/* Abre o menu do índice, colocando a largura em 250px */
function abrirIndice() {
    $("#indice").width(250).css("overflow-y", "auto").css("overflow-x", "hidden");
}

/* Fecha o menu do índice, colocando a largura em 0 */
function fecharIndice() {
    $("#indice").width(0).css("overflow", "hidden");
}

/* Carregar e exibir Tela(Slide) */
function carregarTela(numeroTela) {
    console.log('disparando evento');
    document.dispatchEvent(new CustomEvent('destroy'));

    let sigla = window.location.pathname.split('/')[(window.location.pathname.split('/').length) - 2];
    let mylocalStorage = localStorage.getItem(`progresso-${sigla}`);
    if (JSON.parse(mylocalStorage)) {
        if (progressoGeral) progressoGeral = JSON.parse(mylocalStorage).progressoGeral;
        totalTelas = JSON.parse(mylocalStorage).totalTelas;
        if (telaAtual == 0) numeroTela = JSON.parse(mylocalStorage).telaAtual;
    }

    telaAtual = parseInt(numeroTela);

    if (telaAtual > totalTelas) telaAtual = totalTelas;
    if (telaAtual < 1) telaAtual = 1;

    var url = "tela-" + telaAtual + ".html";
    $("#tela").load(url, atualizarNav);

    let dados = new Object();
    dados.numeroTela = parseInt(numeroTela);
    dados.telaAtual = telaAtual;
    dados.progressoGeral = inserirTelaVisitada(parseInt(numeroTela));
    dados.totalTelas = totalTelas;
    localStorage.setItem(`progresso-${sigla}`, JSON.stringify(dados));

}

function narrar() {
    let arrayDeTextos = $('[id=tela]').children();
    let textoParaNarrar = '';

    arrayDeTextos.map((i, val, array) => {
        if ($(val).text() != '' && $(val)[0].nodeName != 'FOOTER' && $(val)[0].nodeName != 'STYLE' && $(val)[0].nodeName != 'HEADER' && $(val)[0].nodeName != 'SCRIPT') {
            temp = $(val).text();
            let array = $(val)[0].childNodes;
            console.log(Array.from(array));
            // Array.from(array).map((value, index, array) => {
            //     // console.log($(value));//.indexOf('nao-narrar')
            //     console.log($(value)[0].childNodes);
            //     // Array.from($(value)[0].childNodes).map((v, i, a) => {
            //     //     console.log($(v).classLis);
            //     // })
            // })
            textoParaNarrar += "\n \n" + $.trim(temp);
        }
        // console.log($(val));
        // console.log($(val)[0].innerHTML.indexOf('nao-narrar') < 0);
    })
    playAudio(textoParaNarrar);
}

function playAudio(texto) {
    audio.cancel();
    var msg = new SpeechSynthesisUtterance();
    msg.text = texto;
    msg.rate = .9;
    // audio.speak(msg);
}

function stopAudio(texto) {
    audio.cancel();
}

function inserirTelaVisitada(tela) {
    let found = progressoGeral.some(el => el === tela);
    if (!found) progressoGeral.push(tela);
    return progressoGeral.sort();
}

function atualizarNav() {
    $botaoProxima.attr("href", "#tela-" + (telaAtual + 1));
    $botaoAnterior.attr("href", "#tela-" + (telaAtual - 1));

    if (telaAtual == (totalTelas)) $botaoProxima.css("display", "none");
    if (telaAtual < (totalTelas)) $botaoProxima.css("display", "block");
    if (telaAtual == 0 || telaAtual == 1) $botaoAnterior.css("display", "none");
    if (telaAtual > 1) $botaoAnterior.css("display", "block");

    //progresso Total
    progressoGeral.map((value) => {
        $($barraProgresso[value - 1]).addClass("progresso-geral");
    })

    $(".tela-atual").removeClass("tela-atual");
    $(".tela-visualizada").removeClass("tela-visualizada");

    $($barraProgresso).eq(telaAtual - 1).addClass("tela-atual");
    for (i = 0; i < telaAtual; i++) {
        $($barraProgresso[i]).addClass("tela-visualizada");
    }
    narrar();
}

document.onkeydown = function (e) {
    /*if (e.keyCode == 13) {
        carregarTela(telaAtual + 1);
    }
    if (e.keyCode == 32) {
        carregarTela(telaAtual + 1);
    }*/
    if (e.keyCode == 39) {
        carregarTela(telaAtual + 1);
    }
    if (e.keyCode == 37) {
        carregarTela(telaAtual - 1);
    }
    if (e.keyCode == 83) {
        stopAudio();
    }
    var hashTela = "#tela-" + telaAtual;
    window.location.hash = hashTela;
}

/* redimensionador do slide */
function redimensionar() {

    var alturaHeader = $("header").outerHeight();
    var alturaFooter = $("footer").outerHeight();

    var alturaMain = $(window).height() - (alturaHeader + alturaFooter + 10);

    $main.height(alturaMain);

    var larguraMain = $main.width() - 120;

    var proporcao;
    proporcao = Math.min(
        larguraMain / larguraTela,
        alturaMain / alturaTela
    );

    $tela.css({
        transform: "translate(-50%,-50%)" + "scale(" + proporcao + "," + proporcao + ")"
    });
}

$(window).on('resize', redimensionar);

/* Paginador */
$(".nav-telas-progresso a span")
    .wrapInner("<span class='nav-telas-progresso-titulo'></span>")
    .append("<span class='nav-telas-progresso-pagina'></span>")
    .wrapInner("<span></span>");
var $titulos = $(".nav-telas-progresso-titulo");
var $pagTelas = $(".nav-telas-progresso-pagina");
var qtTelas = $pagTelas.length;
var texto;
for (i = 0; i < qtTelas; i++) {
    texto = "Tela " + (i + 1) + " de " + qtTelas + ".";
    if ($($titulos[i]).html().length == 0) {
        $($titulos[i]).append(texto);
    } else {
        $($pagTelas[i]).append(texto);
    }
}

function copiarCodigo() {
    navigator.clipboard.writeText($(document).contents().find('main').find('#tela').html());
    console.log($(document).contents().find('main').find('#tela').html());
}

carregarTela(telaAtual);
redimensionar();