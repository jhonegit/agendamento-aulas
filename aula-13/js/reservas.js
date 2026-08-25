/* ============================================================
   ARQUIVO: reservas.js
   O QUE ELE FAZ: conversa com o banco de dados.

   Ele já sabe perguntar ao banco o que existe e gravar reserva
   nova. Hoje ele aprende as duas últimas coisas: APAGAR uma
   reserva, e TRADUZIR os erros que o servidor devolve.

   E hoje entra uma ideia nova, que não é código nosso: o
   servidor tem regras próprias, e pode recusar o que a gente
   pedir. Até ontem, quem decidia tudo era esta página.
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
   da mesma gaveta.

   SÓ QUE ISSO NÃO BASTOU, e hoje vocês vão ver por quê. Duas
   fichas com o mesmo nome não podem existir, mas a segunda
   gravação estava escrevendo POR CIMA da primeira, em silêncio.
   O nome continuava único e a reserva do colega sumia.

   Quem resolve isso não é este arquivo. É o servidor.
   ============================================================ */
function criarReserva(dia, horario, local) {

  var identificador = dia + "_" + horario + "_" + local;

  var novaReserva = {
    dia: dia,
    horario: horario,
    local: local,
    professorNome: usuarioLogado.nome,

    /* ========================================================

       ETAPA 1

       ======================================================== */




  };

  return bancoDeDados.collection("reservas")
    .doc(identificador)
    .set(novaReserva);

}


/* ============================================================
   APAGAR UMA RESERVA

   Recebe o dia, o horário e o espaço, monta o nome da ficha do
   mesmo jeito que o criarReserva monta, e manda apagar.

   Quem pode apagar o quê é decidido em DOIS lugares, e os dois
   são necessários:

   1. Aqui no navegador, para não mostrar botão inútil para
      quem não pode. Isso é educação com o usuário.
   2. No servidor, nas regras do Firestore, que é onde a
      proteção de verdade acontece.

   O item 2 é o indispensável. Alguém esperto burla o item 1
   mexendo no navegador. Ninguém burla o servidor.
   ============================================================ */
function cancelarReserva(dia, horario, local) {

  /* ==========================================================

     ETAPA 5

     ========================================================== */




}


/* ============================================================
   O SERVIDOR RECLAMA EM INGLÊS

   Quando o servidor recusa alguma coisa, ele devolve um código
   técnico, tipo "permission-denied". Ninguém na secretaria da
   escola vai entender isso.

   Esta função troca cada código por uma frase em português. É
   exatamente a mesma ideia do traduzirErroDoFirebase que vocês
   já viram no js/autenticacao.js, só que para o banco em vez de
   para o login.
   ============================================================ */
function traduzirErroDoBanco(erro) {

  /* ==========================================================

     ETAPA 2

     ========================================================== */




}


/* O que este arquivo faz: */
