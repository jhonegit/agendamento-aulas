# Aula 13

Arquivos das aulas 12 e 13, que são dadas juntas.

## Como abrir

Extrair o ZIP primeiro. Depois abrir esta pasta `aula-13` no VS Code, em
**File → Open Folder**. Não precisa copiar arquivo para lugar nenhum.

Se o número aqui em cima não for o da aula de hoje, você baixou em outro dia.
Baixe o ZIP de novo.

## Arquivos

- `index.html`, a tela de entrar
- `grade.html`, a grade da semana. A janelinha ganhou o botão de cancelar
- `css/estilo.css`, o estilo
- `js/firebase-config.js`, o endereço do banco. Ninguém mexe nele
- `js/autenticacao.js`, quem entrou no sistema
- `js/reservas.js`, fala com o banco. Ganha apagar e traduzir erro
- `js/grade.js`, a janelinha. Ganha o cancelar
- `firestore.rules`, **novo**, e diferente de todos os outros

## Sobre o firestore.rules

Esse arquivo não roda na sua máquina. Ele roda no servidor, e está aqui só
para ler. Quem coloca ele no servidor é o professor.

É ele que decide o que o banco aceita e o que recusa.

## Testando

Botão direito no `index.html`, **Open with Live Server**.

**Esta aula precisa de internet.**
