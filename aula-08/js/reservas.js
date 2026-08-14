/* ============================================================
   ARQUIVO: reservas.js
   O QUE ELE FAZ: pergunta ao banco quais reservas existem e
   pinta a grade da semana com elas.

   Este é o primeiro arquivo de JavaScript do projeto.

   HTML é o que a página TEM. CSS é como a página FICA.
   JavaScript é o que a página FAZ.
   ============================================================ */


/* ------------------------------------------------------------
   1) PERGUNTAR AO BANCO

   collection("reservas") escolhe a gaveta chamada "reservas".
   get() pede o conteúdo dela.

   A resposta não chega na hora: ela vem pela internet, e isso
   demora um pouco. Por isso existe o .then(), que quer dizer
   "e DEPOIS, quando a resposta chegar, faça isto aqui".

   Enquanto a resposta não chega, a grade fica como nasceu no
   grade.html, com tudo livre.
   ------------------------------------------------------------ */
bancoDeDados.collection("reservas").get()

  .then(function (resposta) {


    /* ======================================================

       AQUI ENTRA O QUE A TURMA ESCREVE HOJE

       ====================================================== */








    /* ------------------------------------------------------
       ANTES DE DESENHAR, TODA FAIXINHA COMEÇA LIVRE

       querySelectorAll pega TODAS as faixinhas da página de
       uma vez, as 80. O forEach passa em cada uma delas e
       devolve ela para o estado de livre.
       ------------------------------------------------------ */
    var todasAsFaixas = document.querySelectorAll(".faixa");

    todasAsFaixas.forEach(function (umaFaixa) {
      umaFaixa.className = "faixa faixa-livre";
    });

  })


/* ------------------------------------------------------------
   2) E SE O BANCO NÃO RESPONDER?

   O .catch() é o plano B. Ele só roda quando dá errado: sem
   internet, endereço errado, banco fora do ar.

   Sem ele, a grade ficaria toda livre e ninguém saberia se é
   porque não tem reserva nenhuma ou porque a internet caiu.

   O aviso está escondido no grade.html. Tirar a classe
   "escondido" é o que faz ele aparecer.
   ------------------------------------------------------------ */
  .catch(function (erro) {

    var aviso = document.getElementById("aviso-do-banco");

    aviso.textContent =
      "Não consegui falar com o banco. Ou está sem internet, " +
      "ou o endereço em js/firebase-config.js está errado.";

    aviso.className = "mensagem mensagem-erro";
  });


/* O que este arquivo faz: */
