/* ============================================================
   ARQUIVO: autenticacao.js
   O QUE ELE FAZ: cuida de tudo que envolve "quem é a pessoa".

   - Criar conta
   - Entrar
   - Sair
   - Impedir que alguém sem conta veja a grade

   Este arquivo é usado nas DUAS páginas, o index.html e o
   grade.html. Por isso, antes de mexer em qualquer pedaço da
   tela, a gente sempre confere se aquele pedaço existe.
   ============================================================ */


/* ------------------------------------------------------------
   A VARIÁVEL MAIS IMPORTANTE DO SISTEMA

   Depois que a pessoa entra, guardamos os dados dela aqui.

   Daqui pra frente, toda vez que o sistema precisar saber quem
   está usando ele, é esta variável que responde.

   Ela vai ficar assim:
   { uid: "abc123", nome: "Maria", email: "...", papel: "professor" }
   ------------------------------------------------------------ */
var usuarioLogado = null;


/* ============================================================
   PARTE 1 - AS FUNÇÕES DE AVISO
   ============================================================ */

/* Mostra um aviso na tela.
   O "tipo" pode ser "erro", que fica vermelho, ou "sucesso",
   que fica verde. */
function mostrarMensagem(texto, tipo) {

  /* O index.html chama a caixa de "mensagem". O grade.html chama
     ela de "aviso-do-banco". Procuramos as duas. */
  var caixa = document.getElementById("mensagem");
  if (caixa === null) {
    caixa = document.getElementById("aviso-do-banco");
  }
  if (caixa === null) {
    return; /* esta página não tem caixa de aviso nenhuma */
  }

  caixa.textContent = texto;
  caixa.classList.remove("escondido");
  caixa.classList.remove("mensagem-erro");
  caixa.classList.remove("mensagem-sucesso");

  if (tipo === "sucesso") {
    caixa.classList.add("mensagem-sucesso");
  } else {
    caixa.classList.add("mensagem-erro");
  }
}


/* Esconde o aviso de novo. */
function esconderMensagem() {

  var caixa = document.getElementById("mensagem");
  if (caixa === null) {
    caixa = document.getElementById("aviso-do-banco");
  }
  if (caixa !== null) {
    caixa.classList.add("escondido");
  }
}


/* ------------------------------------------------------------
   O FIREBASE RECLAMA EM INGLÊS

   Quando alguma coisa dá errado, o Firebase devolve um código
   técnico, tipo "auth/wrong-password". Ninguém na secretaria da
   escola vai entender isso.

   Esta função troca cada código por uma frase em português.
   ------------------------------------------------------------ */
function traduzirErroDoFirebase(erro) {

  var codigo = erro.code;

  if (codigo === "auth/invalid-email") {
    return "O e-mail digitado não é válido.";
  }
  if (codigo === "auth/missing-password") {
    return "Digite a senha.";
  }
  if (codigo === "auth/user-not-found" || codigo === "auth/wrong-password" || codigo === "auth/invalid-credential") {
    return "E-mail ou senha incorretos.";
  }
  if (codigo === "auth/too-many-requests") {
    return "Muitas tentativas seguidas. Espere alguns minutos.";
  }
  if (codigo === "auth/network-request-failed") {
    return "Sem conexão com a internet.";
  }
  if (codigo === "auth/operation-not-allowed") {
    return "O login por e-mail e senha não está ligado no Firebase.";
  }

  /* Se for um erro que a gente não previu, mostra o texto original. */
  return "Erro inesperado: " + erro.message;
}


/* ============================================================
   PARTE 2 - ENTRAR
   ============================================================ */

function entrarNoSistema(email, senha) {

  esconderMensagem();
  mostrarMensagem("Entrando...", "sucesso");


  /* ----------------------------------------------------------
     ESTAS LINHAS A TURMA ESCREVEU NA AULA PASSADA

     signInWithEmailAndPassword entrega o e-mail e a senha ao
     Firebase e pergunta se aquela conta existe.

     A resposta demora, porque vai e volta pela internet. Se der
     errado, o .catch() pega o erro e a gente mostra ele em
     português. Se der certo, quem age é o vigia da Parte 3.
     ---------------------------------------------------------- */
  autenticacao.signInWithEmailAndPassword(email, senha)
    .catch(function (erro) {
      mostrarMensagem(traduzirErroDoFirebase(erro), "erro");
    });
}


/* ============================================================
   PARTE 3 - O VIGIA

   Esta é a parte mais importante do arquivo.

   onAuthStateChanged é um vigia. O Firebase chama ele sozinho
   toda vez que alguém entra ou sai, e também assim que a página
   termina de carregar.

   Ele recebe uma coisa só:
   - os dados da pessoa, se tiver alguém dentro do sistema
   - o valor null, se não tiver ninguém
   ============================================================ */

autenticacao.onAuthStateChanged(function (usuarioDoFirebase) {

  /* Em qual das duas páginas estamos? A gente descobre olhando
     se um pedaço exclusivo daquela página existe. */
  var estamosNaPaginaDeLogin = document.getElementById("formulario-login") !== null;
  var estamosNaPaginaDaGrade = document.getElementById("corpo-da-grade") !== null;


  /* ----------------------------------------------------------
     CASO 1: NÃO TEM NINGUÉM DENTRO DO SISTEMA
     ---------------------------------------------------------- */
  if (usuarioDoFirebase === null) {

    usuarioLogado = null;


    /* --------------------------------------------------------
       ESCRITO PELA TURMA NA AULA PASSADA

       Ninguém entrou. Se a pessoa está na grade, ela não pode
       ficar ali: mandamos ela de volta para a tela de entrar.

       Se ela já está na tela de entrar, não fazemos nada. É
       exatamente onde ela deve estar.
       -------------------------------------------------------- */
    if (estamosNaPaginaDaGrade) {
      window.location.href = "index.html";
    }

    return;
  }


  /* ----------------------------------------------------------
     CASO 2: TEM ALGUÉM DENTRO DO SISTEMA

     O Firebase já disse quem é, mas ele só sabe o e-mail. O nome
     e a função estão na gaveta "usuarios" do banco. Vamos buscar.
     ---------------------------------------------------------- */
  bancoDeDados.collection("usuarios").doc(usuarioDoFirebase.uid).get()

    .then(function (documento) {

      /* Se a ficha não existir, a conta está pela metade: ela tem
         e-mail e senha, mas ninguém guardou o nome no banco. */
      if (documento.exists === false) {
        mostrarMensagem(
          "Sua conta existe, mas está sem nome e sem função. " +
          "Avise a secretaria.",
          "erro"
        );
        autenticacao.signOut();
        return;
      }

      /* A ficha que veio do banco, com o nome e a função. */
      var dados = documento.data();


      /* ------------------------------------------------------
         ESCRITO PELA TURMA NA AULA PASSADA

         Aqui a variável mais importante do sistema é preenchida.
         Daqui pra frente, qualquer arquivo que precise saber
         quem está usando o sistema pergunta ao usuarioLogado.

         Hoje é o js/grade.js que vai perguntar, na hora de
         gravar uma reserva.
         ------------------------------------------------------ */
      usuarioLogado = {
        uid: usuarioDoFirebase.uid,
        nome: dados.nome,
        email: dados.email,
        papel: dados.papel
      };

      if (estamosNaPaginaDeLogin) {
        window.location.href = "grade.html";
        return;
      }

      if (estamosNaPaginaDaGrade) {
        escreverIdentificacaoNoTopo();
        mostrarReservas();
      }

    })

    .catch(function (erro) {
      mostrarMensagem("Não consegui ler seus dados: " + erro.message, "erro");
    });
});


/* Escreve "Maria · Professor(a)" no canto de cima da grade. */
function escreverIdentificacaoNoTopo() {

  var campo = document.getElementById("identificacao-usuario");
  if (campo === null) {
    return;
  }

  var papelPorExtenso = "Professor(a)";
  if (usuarioLogado.papel === "funcionario") {
    papelPorExtenso = "Secretaria";
  }

  campo.textContent = usuarioLogado.nome + " · " + papelPorExtenso;
}


/* ============================================================
   PARTE 4 - LIGANDO OS BOTÕES DA TELA

   Daqui pra baixo, ligamos cada botão e cada formulário do HTML
   nas funções lá de cima. Sem esta parte, clicar não faz nada.
   ============================================================ */

var formularioLogin = document.getElementById("formulario-login");


/* --- O botão "Entrar" --- */
if (formularioLogin !== null) {

  formularioLogin.addEventListener("submit", function (evento) {

    /* Sem esta linha, o navegador recarregaria a página sozinho
       e o nosso código nem chegaria a rodar. */
    evento.preventDefault();

    var email = document.getElementById("email-login").value.trim();
    var senha = document.getElementById("senha-login").value;

    entrarNoSistema(email, senha);
  });
}


/* --- O botão "Sair" (só existe no grade.html) --- */
var botaoSair = document.getElementById("botao-sair");

if (botaoSair !== null) {

  botaoSair.addEventListener("click", function () {
    autenticacao.signOut().then(function () {
      window.location.href = "index.html";
    });
  });
}


/* O que este arquivo faz: */
