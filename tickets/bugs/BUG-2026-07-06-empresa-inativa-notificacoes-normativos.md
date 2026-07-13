# Bug - Usuario em empresa inativa recebe notificacoes de normativos

## Titulo

Usuario cadastrado em empresa inativa continua recebendo notificacoes de normativos.

## Tipo

Bug

## Descricao

Chamado de teste gerado a partir do cenario informado: usuario cadastrado em empresa inativa continua recebendo notificacoes de normativos.

Ponto a validar: a regra de bloqueio de notificacoes para usuarios vinculados a empresas inativas nao foi confirmada na documentacao ou no codigo analisado nesta execucao.

## Ambiente

| Item | Valor |
|---|---|
| Ambiente | Nao informado |
| Data/hora | 2026-07-06 |
| Usuario/perfil | Usuario cadastrado em empresa inativa |
| Versao/commit | Nao informado |

## Usuario/perfil impactado

Usuario associado a uma empresa marcada como inativa.

Ponto a validar: o projeto analisado possui documentacao de notificacoes Slack/WhatsApp, mas nao foi encontrada evidencia local sobre cadastro de empresas, status de empresa ou notificacoes de normativos por usuario.

## Passos para reproduzir

1. Identificar ou cadastrar uma empresa com status inativo.
2. Associar um usuario a essa empresa inativa.
3. Gerar ou processar um normativo que dispare notificacao.
4. Verificar se o usuario vinculado a empresa inativa recebe a notificacao.

Ponto a validar: os passos acima representam o fluxo esperado para investigacao do relato, mas dependem de confirmacao do modulo, tela, rotina ou base de dados responsavel por empresas, usuarios e normativos.

## Resultado esperado

Usuarios vinculados a empresas inativas nao devem receber notificacoes de normativos, caso essa seja a regra de negocio vigente.

## Resultado obtido

Conforme cenario informado, o usuario cadastrado em empresa inativa continua recebendo notificacoes de normativos.

## Evidencias

- Relato informado na solicitacao: "Usuario cadastrado em empresa inativa continua recebendo notificacoes de normativos."
- `prompts/05-gerar-chamado.md`: define estrutura obrigatoria e local de saida para chamados.
- `templates/chamado-bug.md`: define o padrao profissional para chamados de bug.
- Busca local por termos relacionados encontrou documentacao de notificacoes, mas nao confirmou regra especifica sobre empresa inativa, usuario ou normativos.

## Impacto

Possivel envio indevido de comunicacoes para usuarios que deveriam estar fora do publico elegivel, gerando ruido operacional e risco de divergencia de regra de negocio.

## Severidade

Media

Ponto a validar: a severidade deve ser revista apos confirmar volume de usuarios afetados, canal de notificacao, criticidade dos normativos e existencia da regra de bloqueio por empresa inativa.

## Prioridade

Media

Ponto a validar: a prioridade deve ser ajustada conforme impacto real no cliente e frequencia do envio indevido.

## Possivel causa

Ponto a validar: possivel ausencia de filtro por status da empresa na rotina de selecao de destinatarios das notificacoes de normativos.

Nao foi encontrada evidencia local suficiente para confirmar a causa tecnica.

## Proximo passo

1. Confirmar a regra de negocio para usuarios de empresas inativas.
2. Identificar onde empresas, usuarios, normativos e destinatarios de notificacoes sao mantidos.
3. Validar se a rotina de notificacao filtra destinatarios por status da empresa.
4. Corrigir a rotina, se a regra for confirmada.
5. Adicionar teste cobrindo usuario de empresa inativa.

## Origem da informacao

Solicitacao do usuario nesta execucao e validacao local em `AGENTS.md`, `prompts/05-gerar-chamado.md`, `templates/chamado-bug.md`, `docs`, `knowledge` e `outputs`.

