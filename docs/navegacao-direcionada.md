# Navegação direcionada e somente leitura

## Objetivo

Consultar dados atuais no Blunana quando regras e memórias não forem suficientes para responder sobre um usuário ou registro específico.

## Consultas suportadas

- Perfil e permissões de usuário pelo nome.
- Processo pelo número de 20 dígitos.
- Publicações pelo número do processo.
- Prazos pelo número do processo.
- Audiências pelo número do processo.
- Atestes pelo número do processo.

## Segurança

- O navegador preenche somente filtros de consulta.
- Não clica em Salvar, Atualizar, Excluir, Importar, Enviar ou Confirmar.
- Ações de linha só podem ser abertas quando possuem rótulo seguro ou ícone explicitamente permitido.
- Para perfil de usuário, somente o ícone `mdi-pencil`, validado como abertura do formulário, está autorizado.
- O formulário é lido e o navegador é fechado sem submissão.
- E-mail, telefone, CPF e outros dados sensíveis são removidos dos arquivos de evidência.
- A resposta de perfil não expõe e-mail nem telefone.

## Planejamento

O planejador identifica o alvo e o valor da consulta antes de abrir o navegador. Perguntas ambíguas não iniciam navegação. A execução automática ocorre somente quando o roteador seleciona `LIVE_PLATFORM` e `ALLOW_PLAYWRIGHT=true`.

## Evidência estruturada

A consulta registra:

- alvo e filtro utilizado;
- rota consultada;
- quantidade de resultados;
- colunas e linhas encontradas;
- detalhes e permissões, quando abertos com segurança;
- ambiente, data, modo somente leitura e limitações.

Os arquivos sanitizados são gravados em `outputs/runtime-evidence`.

## Validação

- Seis planos de navegação foram validados por teste automatizado.
- Perfil de usuário foi consultado em PROD, incluindo papel, status e quatro permissões.
- Processo autorizado foi consultado em PROD pelo número, com retorno do status atual.
- Nenhuma alteração foi realizada.

Comandos:

- `npm run test:navigation`
- `npm run query:directed:prod` com `TARGET_QUESTION` definido.
