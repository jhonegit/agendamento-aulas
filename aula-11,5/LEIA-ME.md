# Aula 11,5

Continuação da aula passada. A pasta já vem com tudo que a turma
digitou até aqui.

## Como abrir

Extrair o ZIP primeiro. Depois abrir esta pasta `aula-11,5` no VS Code, em
**File → Open Folder**.

Se você estiver com a `aula-11` na tela, é a de ontem. Baixe o ZIP de novo.

## O que já está pronto

- A janelinha abre no clique, com o dia e o horário certos
- Ela diz se o espaço está livre ou de quem é
- O botão Reservar aparece e some na hora certa

## O que falta

O botão Reservar não grava nada. Clicar nele não faz nada.

São duas etapas:

- **ETAPA 1**, no `js/reservas.js`
- **ETAPA 2**, no `js/grade.js`

A ordem importa. A 2 usa o que a 1 cria.

## Arquivos

- `index.html`, a tela de entrar
- `grade.html`, a grade da semana
- `css/estilo.css`, o estilo
- `js/firebase-config.js`, o endereço do banco. Ninguém mexe nele
- `js/autenticacao.js`, quem entrou no sistema
- `js/reservas.js`, fala com o banco. Tem a ETAPA 1
- `js/grade.js`, a janelinha. Tem a ETAPA 2

## Testando

Botão direito no `index.html`, **Open with Live Server**.

**Esta aula precisa de internet.**
