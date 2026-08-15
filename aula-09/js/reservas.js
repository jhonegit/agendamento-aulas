/* ============================================================
   ARQUIVO: reservas.js
   O QUE ELE FAZ: pergunta ao banco quais reservas existem e
   pinta a grade da semana com elas.

   Este é o arquivo que a turma escreveu na aula passada. Ele
   chega inteiro e consertado.

   MUDOU UMA COISA HOJE, e está explicada logo abaixo.
   ============================================================ */


/* ------------------------------------------------------------
   POR QUE AGORA ISTO VIROU UMA FUNÇÃO

   Antes, este código rodava sozinho assim que a página abria.

   A partir de hoje a grade só pode aparecer para quem entrou no
   sistema. Então o código não roda mais sozinho: ele fica aqui
   guardado, esperando ser chamado.

   Quem chama é o js/autenticacao.js, e só depois de confirmar
   quem é a pessoa. Uma função é isso: um pedaço de código com
   nome, guardado para ser usado na hora certa.
   ------------------------------------------------------------ */
function mostrarReservas() {

  /* ------------------------------------------------------------
     1) PERGUNTAR AO BANCO

     collection("reservas") escolhe a gaveta chamada "reservas".
     get() pede o conteúdo dela.

     A resposta não chega na hora: ela vem pela internet, e isso
     demora um pouco. Por isso existe o .then(), que quer dizer
     "e DEPOIS, quando a resposta chegar, faça isto aqui".
     ------------------------------------------------------------ */
  bancoDeDados.collection("reservas").get()

    .then(function (resposta) {


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


      /* ------------------------------------------------------
         AGORA SIM, UMA FICHA DE CADA VEZ

         Para cada ficha que veio do banco, a gente monta o nome
         da faixinha correspondente e pinta ela.
         ------------------------------------------------------ */
      resposta.forEach(function (documento) {

        var reserva = documento.data();

        var chave = reserva.dia + "-" + reserva.horario;
        chave = chave + "-" + reserva.local;

        var faixa = document.getElementById(chave);
        var nome = document.getElementById(chave + "-nome");

        var cor = "faixa-" + reserva.local;
        faixa.className = "faixa faixa-ocupada " + cor;
        nome.textContent = reserva.professorNome;

        if (reserva.professorNome === "Jhone") {
          faixa.className = faixa.className + " faixa-minha";
        }

      });

    })


    /* ------------------------------------------------------------
       2) E SE O BANCO NÃO RESPONDER?

       O .catch() é o plano B. Ele só roda quando dá errado: sem
       internet, endereço errado, banco fora do ar.

       Sem ele, a grade ficaria toda livre e ninguém saberia se é
       porque não tem reserva nenhuma ou porque a internet caiu.
       ------------------------------------------------------------ */
    .catch(function (erro) {

      var aviso = document.getElementById("aviso-do-banco");

      aviso.textContent =
        "Não consegui falar com o banco. Ou está sem internet, " +
        "ou o endereço em js/firebase-config.js está errado.";

      aviso.className = "mensagem mensagem-erro";
    });

}


/* O que este arquivo faz: */
