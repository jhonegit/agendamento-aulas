/* ============================================================
   ARQUIVO: reservas.js
   O QUE ELE FAZ: conversa com o banco de dados.

   Até a aula passada ele só sabia PERGUNTAR ao banco quais
   reservas existem, e pintar a grade com elas.

   Hoje ele aprende a segunda metade do trabalho: GRAVAR uma
   reserva nova no banco.
   ============================================================ */


/* ------------------------------------------------------------
   POR QUE ISTO É UMA FUNÇÃO, E NÃO CÓDIGO SOLTO

   Este código não roda sozinho quando a página abre. Ele fica
   guardado aqui, esperando ser chamado.

   Quem chama é o js/autenticacao.js, depois de confirmar quem é
   a pessoa. E hoje o js/grade.js vai chamar ele mais uma vez,
   logo depois de gravar uma reserva nova, para a grade aparecer
   já atualizada na tela.
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


        /* Esta linha pinta de azul a reserva de quem está usando
           o sistema agora. Foi a última coisa que a turma mexeu
           na aula passada: aqui havia um nome escrito na mão. */
        if (reserva.professorNome === usuarioLogado.nome) {
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


/* ============================================================
   GRAVAR UMA RESERVA NOVA

   Esta função é a novidade de hoje, e é o coração do sistema
   inteiro. Sem ela, o site só sabe mostrar o que outra pessoa
   já reservou.

   Ela recebe três coisas: o dia, o horário e o espaço. Repare
   que ela NÃO recebe o nome de ninguém, e isso é de propósito:
   quem reserva é sempre quem está dentro do sistema naquele
   momento, e esse nome já está guardado no usuarioLogado desde
   a aula passada.


   O NOME DA FICHA NÃO É UM NÚMERO QUALQUER

   Toda ficha guardada no banco tem um nome. Normalmente esse
   nome é um monte de letras sorteadas pelo próprio banco.

   Aqui a gente escolhe o nome à mão, e ele é sempre montado do
   mesmo jeito:

       segunda_07:30-08:30_biblioteca

   O banco não deixa existir duas fichas com o mesmo nome dentro
   da mesma gaveta. Ou seja: montando o nome assim, gravar duas
   reservas para o mesmo espaço, no mesmo dia e no mesmo horário
   fica impossível. Isso vai importar muito na próxima aula.
   ============================================================ */
function criarReserva(dia, horario, local) {

  /* ==========================================================

     ETAPA 4: AQUI ENTRA O QUE A TURMA ESCREVE

     ========================================================== */




}


/* O que este arquivo faz: */
