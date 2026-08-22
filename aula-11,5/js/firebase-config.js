/* ============================================================
   ARQUIVO: firebase-config.js
   O QUE ELE FAZ: guarda o endereço do nosso banco de dados e
   liga esta página a ele.

   Este arquivo não desenha nada na tela. Ele é a tomada: sem
   ele, nem o js/reservas.js nem o js/autenticacao.js teriam
   com quem conversar.
   ============================================================ */


/* ------------------------------------------------------------
   0) ONDE AVISAR, SE DER PROBLEMA

   As duas páginas têm uma caixa de aviso, mas cada uma chama a
   dela de um jeito: no index.html é "mensagem", no grade.html é
   "aviso-do-banco". Procuramos as duas e ficamos com a que
   existir nesta página.
   ------------------------------------------------------------ */
var caixaDeAviso = document.getElementById("mensagem");
if (caixaDeAviso === null) {
  caixaDeAviso = document.getElementById("aviso-do-banco");
}


/* ------------------------------------------------------------
   1) O FIREBASE CHEGOU?

   Os arquivos do Google, lá no fim da página, também vêm pela
   internet. Sem internet eles não chegam, e aí nada deste
   arquivo funciona.

   Este pedaço avisa na tela quando isso acontece. Sem ele, a
   página abriria muda e ninguém saberia se o problema é a
   internet ou o código.
   ------------------------------------------------------------ */
if (typeof firebase === "undefined") {

  caixaDeAviso.textContent =
    "Esta página não conseguiu carregar o Firebase. " +
    "Confira a internet e abra de novo.";

  caixaDeAviso.className = "mensagem mensagem-erro";
}


/* ------------------------------------------------------------
   2) O ENDEREÇO DO BANCO

   Estas seis linhas são o endereço do projeto no Firebase. Elas
   vêm prontas: ninguém aqui precisa mexer.

   Elas não são senha. Servem só para dizer "esta página é do
   projeto tal". Quem decide o que pode e o que não pode ser
   feito no banco são as Regras de Segurança, que ficam no site
   do Firebase e não aqui.
   ------------------------------------------------------------ */
var configuracaoDoFirebase = {
  apiKey: "AIzaSyDT4SMGIIDmso1ETG30VcoT6dnv0N71EO0",
  authDomain: "projetodereserva.firebaseapp.com",
  projectId: "projetodereserva",
  storageBucket: "projetodereserva.firebasestorage.app",
  messagingSenderId: "925169652949",
  appId: "1:925169652949:web:5885b5c631f24c334dfe5c"
};


/* ------------------------------------------------------------
   3) LIGAR

   Esta linha acorda o Firebase com o endereço de cima. Ela tem
   que acontecer antes de qualquer código nosso, e é por isso
   que este arquivo é o primeiro <script> da página.
   ------------------------------------------------------------ */
firebase.initializeApp(configuracaoDoFirebase);


/* ------------------------------------------------------------
   4) DOIS APELIDOS CURTOS

   Daqui pra frente, em vez de escrever firebase.firestore()
   toda hora, escrevemos só bancoDeDados.

   O segundo apelido é a novidade de hoje. firebase.auth() é a
   parte do Firebase que cuida de conta e senha, e a gente vai
   chamar ela de autenticacao.

   São duas coisas separadas de propósito:
   - bancoDeDados guarda reservas e nomes
   - autenticacao sabe quem é você
   ------------------------------------------------------------ */
var bancoDeDados = firebase.firestore();

var autenticacao = firebase.auth();
