/* ============================================================
   ARQUIVO: firebase-config.js
   O QUE ELE FAZ: guarda o endereço do nosso banco de dados e
   liga esta página a ele.

   Este arquivo não desenha nada na tela. Ele é a tomada: sem
   ele, o js/reservas.js não teria com quem conversar.
   ============================================================ */


/* ------------------------------------------------------------
   0) O FIREBASE CHEGOU?

   Os dois arquivos do Google, lá no fim do grade.html, também
   vêm pela internet. Sem internet eles não chegam, e aí nada
   deste arquivo funciona.

   Este pedaço avisa na tela quando isso acontece. Sem ele, a
   página abriria com a grade toda livre e ninguém saberia se o
   problema é a internet ou o código.
   ------------------------------------------------------------ */
if (typeof firebase === "undefined") {

  var avisoSemFirebase = document.getElementById("aviso-do-banco");

  avisoSemFirebase.textContent =
    "Esta página não conseguiu carregar o Firebase. " +
    "Confira a internet e abra de novo.";

  avisoSemFirebase.className = "mensagem mensagem-erro";
}


/* ------------------------------------------------------------
   1) O ENDEREÇO DO BANCO

   Estas seis linhas são o endereço do projeto no Firebase. Elas
   vêm prontas: ninguém aqui precisa mexer.

   Elas não são senha. Servem só para dizer "esta página é do
   projeto tal". Quem decide o que pode e o que não pode ser
   feito no banco são as Regras de Segurança, que ficam no
   site do Firebase e não aqui.
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
   2) UM AVISO, SE ALGUÉM ESQUECEU DE PREENCHER

   Se as linhas de cima ainda estiverem com os textos de
   exemplo, o sistema falharia com uma mensagem confusa. Aqui a
   página avisa em português, na própria tela.

   Esta conferência vem antes de ligar o Firebase de propósito:
   assim ela funciona mesmo que tudo o mais dê errado.
   ------------------------------------------------------------ */
if (configuracaoDoFirebase.apiKey === "COLE_AQUI_A_API_KEY") {

  var avisoDaConfiguracao = document.getElementById("aviso-do-banco");

  avisoDaConfiguracao.textContent =
    "O arquivo js/firebase-config.js ainda está com o endereço de exemplo.";

  /* Tirar a classe "escondido" é o que faz o aviso aparecer. */
  avisoDaConfiguracao.className = "mensagem mensagem-erro";
}


/* ------------------------------------------------------------
   3) LIGAR

   Esta linha acorda o Firebase com o endereço de cima. Ela tem
   que acontecer antes de qualquer código nosso, e é por isso
   que este arquivo é o primeiro <script> da página.
   ------------------------------------------------------------ */
firebase.initializeApp(configuracaoDoFirebase);


/* ------------------------------------------------------------
   4) UM APELIDO CURTO

   Daqui pra frente, em vez de escrever firebase.firestore()
   toda hora, escrevemos só bancoDeDados.

   Guardar uma coisa com um nome é o que se chama de variável.
   O "var" é de "variável".
   ------------------------------------------------------------ */
var bancoDeDados = firebase.firestore();
