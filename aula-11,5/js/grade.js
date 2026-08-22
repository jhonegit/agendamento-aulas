/* ============================================================
   ARQUIVO: grade.js
   O QUE ELE FAZ: cuida da janelinha que abre quando alguém
   clica numa célula da grade.

   ESTA PASTA CONTINUA DE ONDE A AULA PAROU.

   O que já está feito, e não precisa ser feito de novo:

   - a janelinha abre no clique, com o dia e o horário certos
   - ela diz se o espaço está livre ou de quem é
   - o botão Reservar aparece e some na hora certa

   O que falta é só uma coisa, e é a mais importante: o botão
   Reservar ainda não grava nada no banco. Clicar nele não faz
   absolutamente nada.

   São duas etapas, uma em cada arquivo. A ETAPA 1 fica no
   js/reservas.js, e a ETAPA 2 fica aqui embaixo.

   A divisão de trabalho é esta, e vale para o sistema inteiro:

   - o js/reservas.js conversa com o BANCO
   - o js/grade.js cuida da TELA

   Quando a tela precisa do banco, ela chama uma função de lá.
   Nunca o contrário.
   ============================================================ */


/* ------------------------------------------------------------
   AS DUAS ANOTAÇÕES QUE O ARQUIVO INTEIRO USA

   Quando alguém clica numa célula, precisamos lembrar de qual
   dia e de qual horário aquela célula era. Senão, lá na frente,
   na hora de gravar, o código não saberia onde.

   Elas nascem vazias e são preenchidas a cada clique.
   ------------------------------------------------------------ */
var diaAberto = "";
var horarioAberto = "";


/* ------------------------------------------------------------
   OS TRÊS PEDAÇOS DA JANELINHA QUE O ARQUIVO INTEIRO USA

   Estes três não mudam nunca: é sempre a mesma janelinha, o
   mesmo título e a mesma caixa de aviso. Então procuramos os
   três aqui em cima, uma vez só, em vez de procurar de novo a
   cada clique.
   ------------------------------------------------------------ */
var fundo = document.getElementById("fundo-do-modal");
var titulo = document.getElementById("titulo-do-modal");
var aviso = document.getElementById("mensagem-do-modal");


/* ============================================================
   PARTE 1 - ABRIR A JANELINHA

   Esta função recebe a célula que foi clicada. Ela não recebe o
   dia nem o horário: ela mesma descobre os dois, perguntando à
   célula.
   ============================================================ */
function abrirModal(celula) {

  diaAberto = celula.getAttribute("data-dia");
  horarioAberto = celula.getAttribute("data-horario");

  titulo.textContent = diaAberto + ", " + horarioAberto;

  mostrarSituacao("biblioteca");
  mostrarSituacao("laboratorio");

  fundo.classList.remove("escondido");

}


/* ============================================================
   PARTE 2 - O QUE A JANELINHA DIZ DE CADA ESPAÇO

   Esta função é chamada duas vezes a cada clique: uma com
   "biblioteca" e outra com "laboratorio".

   Ela não pergunta nada ao banco. A informação já está na tela,
   nas faixinhas que o js/reservas.js pintou. Ela só olha para a
   faixinha certa e copia o que encontrar.
   ============================================================ */
function mostrarSituacao(local) {

  /* Estes dois já vêm prontos. São os dois pedaços da janelinha
     que vão mudar: a linha que diz a situação, e o botão de
     reservar daquele espaço.

     Repare que o nome deles é montado com o "local" que chegou.
     Chamando a função com "biblioteca", ela pega o
     situacao-biblioteca. Chamando com "laboratorio", pega o
     outro. É a mesma função servindo aos dois espaços. */
  var situacao = document.getElementById("situacao-" + local);
  var botao = document.getElementById("botao-reservar-" + local);


  var chave = diaAberto + "-" + horarioAberto;
  chave = chave + "-" + local;

  var faixa = document.getElementById(chave);
  var nome = document.getElementById(chave + "-nome");

  if (faixa.classList.contains("faixa-ocupada")) {
    situacao.textContent =
      "Reservado por " + nome.textContent;
    botao.classList.add("escondido");
  } else {
    situacao.textContent = "Livre";
    botao.classList.remove("escondido");
  }

}


/* ============================================================
   PARTE 3 - FECHAR A JANELINHA

   Vem pronto. São as duas linhas contrárias às que abrem: uma
   devolve a etiqueta "escondido" para a janelinha, e a outra
   esconde o aviso de erro, para ele não continuar aparecendo no
   próximo clique.
   ============================================================ */
function fecharModal() {

  fundo.classList.add("escondido");
  aviso.classList.add("escondido");
}


/* Vem pronto: escreve um recado de erro DENTRO da janelinha.
   Tem que ser dentro dela, porque é ali que a pessoa está
   olhando na hora em que dá problema. */
function mostrarErroNaJanela(texto) {

  aviso.textContent = texto;
  aviso.classList.remove("escondido");
}


/* ============================================================
   PARTE 4 - GRAVAR A RESERVA E ATUALIZAR A TELA

   Esta é a função que faz o sistema deixar de ser só um quadro
   de avisos.

   Ela não sabe gravar nada sozinha: quem sabe é o criarReserva
   do js/reservas.js. O trabalho daqui é chamar ele com os três
   valores certos e decidir o que a tela faz depois.
   ============================================================ */
function reservarEspaco(local) {

  /* ==========================================================

     ETAPA 2: AQUI ENTRA O QUE A TURMA ESCREVE

     ========================================================== */




}


/* ============================================================
   PARTE 5 - LIGANDO OS BOTÕES DA TELA

   Daqui pra baixo, cada botão do HTML é ligado a uma função lá
   de cima. Sem esta parte, clicar não faz absolutamente nada.
   ============================================================ */


var celulas =
  document.querySelectorAll(".botao-da-celula");

celulas.forEach(function (celula) {
  celula.addEventListener("click", function () {
    abrirModal(celula);
  });
});

/* --- Daqui pra baixo vem pronto --- */


/* O X do canto da janelinha */
document.getElementById("botao-fechar-modal")
  .addEventListener("click", function () {
    fecharModal();
  });


/* Clicar no fundo escuro também fecha.

   A conferência do "evento.target" existe porque um clique dentro
   da janelinha branca também conta como clique no fundo, já que a
   janelinha está dentro dele. Sem essa linha, a janelinha fecharia
   quando a pessoa clicasse dentro dela mesma. */
fundo.addEventListener("click", function (evento) {
  if (evento.target === fundo) {
    fecharModal();
  }
});


/* Os dois botões "Reservar". Os dois chamam a mesma função, só
   que cada um dizendo qual espaço ele é. */
document.getElementById("botao-reservar-biblioteca")
  .addEventListener("click", function () {
    reservarEspaco("biblioteca");
  });

document.getElementById("botao-reservar-laboratorio")
  .addEventListener("click", function () {
    reservarEspaco("laboratorio");
  });


/* O que este arquivo faz: */
