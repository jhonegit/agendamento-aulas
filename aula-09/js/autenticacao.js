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


/* ------------------------------------------------------------
   UM AVISO PARA NÓS MESMOS

   Criar conta acontece em duas etapas: primeiro criamos a conta
   com e-mail e senha, depois gravamos o nome e a função no banco.

   O problema é que o Firebase já considera a pessoa "entrou" na
   primeira etapa. Sem esta variável, o vigia da Parte 4 acordaria
   no meio do caminho, não acharia o nome (que ainda não foi
   gravado) e acharia que a conta está com defeito.

   Enquanto esta variável estiver com o valor true, o vigia espera.
   ------------------------------------------------------------ */
var cadastroEmAndamento = false;


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
  if (codigo === "auth/weak-password") {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }
  if (codigo === "auth/email-already-in-use") {
    return "Já existe uma conta com esse e-mail. Use a aba Entrar.";
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
   PARTE 2 - CRIAR CONTA

   Esta parte chega pronta. São duas etapas, nesta ordem:

   1. Criar a conta com e-mail e senha
   2. Gravar o nome e a função numa gaveta nova do banco,
      chamada "usuarios"

   A etapa 2 é necessária porque o Firebase guarda só e-mail e
   senha. Ele não sabe o nome da pessoa nem o que ela faz na
   escola.
   ============================================================ */

function cadastrarUsuario(nome, email, senha, papel) {

  esconderMensagem();
  mostrarMensagem("Criando sua conta...", "sucesso");

  /* Avisamos o vigia da Parte 4 para esperar as duas etapas. */
  cadastroEmAndamento = true;

  autenticacao.createUserWithEmailAndPassword(email, senha)

    .then(function (resultado) {

      /* O Firebase devolve o "uid": um código único da pessoa.
         É a identidade dela dentro do sistema. */
      var uid = resultado.user.uid;

      /* Agora gravamos o resto no banco. Repare que o nome da
         ficha é o próprio uid: assim fica fácil achar os dados
         de quem entrou. */
      return bancoDeDados.collection("usuarios").doc(uid).set({
        uid: uid,
        nome: nome,
        email: email,
        papel: papel
      });
    })

    .then(function () {
      /* As duas etapas deram certo. Pode ir para a grade. */
      cadastroEmAndamento = false;
      mostrarMensagem("Conta criada! Entrando...", "sucesso");
      window.location.href = "grade.html";
    })

    .catch(function (erro) {
      cadastroEmAndamento = false;
      mostrarMensagem(traduzirErroDoFirebase(erro), "erro");

      /* Se a conta foi criada mas o nome não, a pessoa fica pela
         metade. Melhor tirar ela do sistema do que deixar assim. */
      if (autenticacao.currentUser !== null) {
        autenticacao.signOut();
      }
    });
}


/* ============================================================
   PARTE 3 - ENTRAR
   ============================================================ */

function entrarNoSistema(email, senha) {

  esconderMensagem();
  mostrarMensagem("Entrando...", "sucesso");


  /* ==========================================================

     ETAPA 1: AQUI ENTRA O QUE A TURMA ESCREVE

     ========================================================== */




}


/* ============================================================
   PARTE 4 - O VIGIA

   Esta é a parte mais importante do arquivo.

   onAuthStateChanged é um vigia. O Firebase chama ele sozinho
   toda vez que alguém entra ou sai, e também assim que a página
   termina de carregar.

   Ele recebe uma coisa só:
   - os dados da pessoa, se tiver alguém dentro do sistema
   - o valor null, se não tiver ninguém
   ============================================================ */

autenticacao.onAuthStateChanged(function (usuarioDoFirebase) {

  /* Se estamos no meio de um cadastro, não fazemos nada aqui.
     A própria função cadastrarUsuario cuida do que vem depois. */
  if (cadastroEmAndamento) {
    return;
  }

  /* Em qual das duas páginas estamos? A gente descobre olhando
     se um pedaço exclusivo daquela página existe. */
  var estamosNaPaginaDeLogin = document.getElementById("formulario-login") !== null;
  var estamosNaPaginaDaGrade = document.getElementById("corpo-da-grade") !== null;


  /* ----------------------------------------------------------
     CASO 1: NÃO TEM NINGUÉM DENTRO DO SISTEMA
     ---------------------------------------------------------- */
  if (usuarioDoFirebase === null) {

    usuarioLogado = null;


    /* ========================================================

       ETAPA 2: AQUI ENTRA O QUE A TURMA ESCREVE

       ======================================================== */




    return;
  }


  /* ----------------------------------------------------------
     CASO 2: TEM ALGUÉM DENTRO DO SISTEMA

     O Firebase já disse quem é, mas ele só sabe o e-mail. O nome
     e a função estão na gaveta "usuarios" do banco. Vamos buscar.
     ---------------------------------------------------------- */
  bancoDeDados.collection("usuarios").doc(usuarioDoFirebase.uid).get()

    .then(function (documento) {

      /* Se a ficha não existir, a conta está pela metade. Isso
         acontece quando o cadastro foi interrompido no meio. */
      if (documento.exists === false) {
        mostrarMensagem(
          "Sua conta existe, mas está sem nome e sem função. " +
          "Crie a conta de novo.",
          "erro"
        );
        autenticacao.signOut();
        return;
      }

      /* A ficha que veio do banco, com o nome e a função. */
      var dados = documento.data();


      /* ======================================================

         ETAPA 3: AQUI ENTRA O QUE A TURMA ESCREVE

         Guardar quem é a pessoa, e decidir para onde ela vai.

         ====================================================== */




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
   PARTE 5 - LIGANDO OS BOTÕES DA TELA

   Daqui pra baixo, ligamos cada botão e cada formulário do HTML
   nas funções lá de cima. Sem esta parte, clicar não faz nada.
   ============================================================ */

/* --- As duas abas (só existem no index.html) --- */
var abaLogin = document.getElementById("aba-login");
var abaCadastro = document.getElementById("aba-cadastro");
var formularioLogin = document.getElementById("formulario-login");
var formularioCadastro = document.getElementById("formulario-cadastro");

if (abaLogin !== null) {

  abaLogin.addEventListener("click", function () {
    abaLogin.classList.add("aba-ativa");
    abaCadastro.classList.remove("aba-ativa");
    formularioLogin.classList.remove("escondido");
    formularioCadastro.classList.add("escondido");
    esconderMensagem();
  });

  abaCadastro.addEventListener("click", function () {
    abaCadastro.classList.add("aba-ativa");
    abaLogin.classList.remove("aba-ativa");
    formularioCadastro.classList.remove("escondido");
    formularioLogin.classList.add("escondido");
    esconderMensagem();
  });
}


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


/* --- O botão "Criar conta" --- */
if (formularioCadastro !== null) {

  formularioCadastro.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var nome = document.getElementById("nome-cadastro").value.trim();
    var email = document.getElementById("email-cadastro").value.trim();
    var senha = document.getElementById("senha-cadastro").value;
    var papel = document.getElementById("papel-cadastro").value;

    /* Duas conferências antes de incomodar o Firebase. */
    if (nome === "") {
      mostrarMensagem("Digite seu nome completo.", "erro");
      return;
    }
    if (senha.length < 6) {
      mostrarMensagem("A senha precisa ter pelo menos 6 caracteres.", "erro");
      return;
    }

    cadastrarUsuario(nome, email, senha, papel);
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
