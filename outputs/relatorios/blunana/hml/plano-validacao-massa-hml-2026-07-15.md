# Plano de validacao com massa HML

Data: 2026-07-15

## Estado

Massa ficticia criada e protegida por allowlist vazia. Nenhuma gravacao executada.

## Cobertura planejada

- validacoes obrigatorias dos 7 modais mapeados;
- inclusao e consulta de tipos/regras de ateste;
- inclusao de usuario ficticio sem permissoes;
- configuracoes de publicacao, prazo e processo;
- inclusao, consulta, detalhe e edicao controlada de processo;
- limpeza em ordem inversa;
- registro de mensagens de sucesso, erro e validacao sem dados reais.

## Bloqueio atual

Preencher somente com opcoes HML dedicadas e autorizadas os campos de `allowedExistingOptions` em `staging/blunana/massa-teste-hml.json`.

## Resultado do pre-teste

Status final: **aprovado, sem gravacao**.

Reteste final:

- Cliente de Configuracao do Prazo: reconhecido como predefinido pela tela.
- Area do Cliente: aprovada.
- Tipo de acao: aprovado.
- Tipo de prazo: aprovado.
- Responsavel: aprovado.
- Area de ateste: aprovada.
- Cliente do modal de Usuario: aprovado.
- Papel do Usuario: aprovado.

Todos os modais foram cancelados. Nenhum formulario foi submetido e nenhum registro foi criado.

Confirmacoes obtidas:

- Tipo de prazo informado existe na lista visual de HML.
- Papel informado existe na lista visual de HML.
- Area de ateste foi localizada.
- Cliente foi localizado no modal de Usuario.
- Area do cliente e Tipo de acao foram localizados em execucao anterior.

Bloqueio tecnico:

- O componente Vuetify de Cliente em Configuracao do Prazo nao foi selecionado pelo automatizador.
- Sem essa selecao, campos dependentes como Responsavel permanecem indisponiveis.
- A associacao HTML do campo Papel direcionou o Playwright para a lista de Cliente, embora o descritor de Papel tenha sido confirmado separadamente.

Conclusao anterior superada pelo reteste: o bloqueio era causado pela tentativa indevida de selecionar o Cliente em Configuracao do Prazo, que ja vem predefinido. A massa esta pronta para a proxima fase de testes controlados.
