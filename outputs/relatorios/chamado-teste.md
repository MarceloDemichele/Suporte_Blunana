# Resumo da execucao - chamado de teste

## Data

2026-07-06

## Solicitacao recebida

Ler `AGENTS.md` e executar `prompts/05-gerar-chamado.md`, validando a estrutura de tickets e gerando um chamado de teste para o cenario:

> Usuario cadastrado em empresa inativa continua recebendo notificacoes de normativos.

## Prompt utilizado

- `prompts/05-gerar-chamado.md`

## Arquivos consultados

- `AGENTS.md`
- `prompts/05-gerar-chamado.md`
- `templates/chamado-bug.md`
- `.memory/contexto.md`
- `.memory/historico.md`
- `.memory/decisoes.md`
- `docs`
- `knowledge`
- `outputs`
- `tickets`

## Validacao da estrutura de tickets

Estrutura esperada validada:

- `tickets/bugs`
- `tickets/melhorias`
- `tickets/incidentes`
- `tickets/duvidas`

Resultado: todas as pastas ja existiam no projeto.

## Chamado gerado

- `tickets/bugs/BUG-2026-07-06-empresa-inativa-notificacoes-normativos.md`

## Evidencias e lacunas

Foram encontradas referencias gerais a notificacoes em `docs`, `knowledge`, `outputs` e `README.md`.

Nao foi encontrada evidencia local confirmando:

- existencia de regra de empresa inativa;
- cadastro de usuario vinculado a empresa inativa;
- rotina de notificacao de normativos por usuario;
- filtro de destinatarios por status da empresa.

Por isso, o chamado foi registrado como teste e as premissas foram marcadas como ponto a validar.

## Resultado

Chamado de bug criado em `tickets/bugs` com descricao, passos de reproducao, resultado esperado, resultado obtido, impacto, severidade, prioridade, possivel causa, proximos passos e origem da informacao.

## Pendencias

- Confirmar a regra de negocio sobre empresas inativas.
- Identificar o modulo ou sistema responsavel por usuarios, empresas, normativos e destinatarios de notificacao.
- Revisar severidade e prioridade apos confirmacao do impacto real.

