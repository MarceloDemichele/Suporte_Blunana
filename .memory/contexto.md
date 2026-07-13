# Contexto Atual

Projeto:

Objetivo:

Módulos existentes:

Arquitetura:

Tecnologias:

Banco:

Integrações:

Responsáveis:

Ambientes:

Principais fluxos:

Pendências atuais:

- 2026-07-06: chamado de teste criado para validar possivel envio de notificacoes de normativos a usuario vinculado a empresa inativa. Regra e evidencias tecnicas ainda precisam ser confirmadas.
- 2026-07-07: caminhos de testes/documentacao do crawler ajustados para artefatos por tipo, dominio e ambiente; em producao Blunana, bases esperadas em `outputs/{tipo}/blunana/prod/`. Execucao real em PROD ainda e ponto a validar.
- 2026-07-07: criado prompt operacional para engenharia reversa controlada do Blunana PROD em `prompts/09-engenharia-reversa-blunana-prod.md`.
- 2026-07-07: documentacao de engenharia reversa Blunana gerada em `engenharia-reversa/blunana/`; coleta completa de PROD segue como ponto a validar.
- 2026-07-07: criado executor `crawler-interface/reverse-prod.ts` e script `npm run reverse:prod`; execucao em PROD ainda nao realizada nesta tarefa.
- 2026-07-07: links de navegacao/engenharia reversa Blunana corrigidos para `https://epm.blueprojects.com.br/@rocha_juridico/studio/auth/login` e tenant `@rocha_juridico`.
- 2026-07-07: organizacao definida para separar atualizacoes do Blunana e dos robos em `engenharia-reversa/{dominio}` para documentacao e `outputs/{tipo}/{dominio}/{ambiente}` para artefatos.
- 2026-07-07: objetivo final reposicionado para Assistente IA CEF; criada estrutura dedicada em `external-agent/`, mantendo crawler como fonte auxiliar.
- 2026-07-07: criado `index/master-index.json` para o Assistente IA CEF consultar um indice mestre antes de procurar arquivos diretamente.
- 2026-07-07: criada configuracao de fontes em `external-agent/config/paths.ts` para centralizar memory, knowledge, docs, tickets, support, engenharia reversa e outputs.
- 2026-07-07: criada busca local em `external-agent/core/search.ts` para consultar arquivos `.md` e `.json` nas fontes configuradas.
- 2026-07-07: `external-agent/index.ts` virou executor inicial; recebe pergunta por argumento e imprime fontes encontradas.
- 2026-07-08: PRs pendentes revisados: #16 (`codex-agent` -> `main`) e #17 (`codex-agent-doc-structure` -> `codex-agent`) continuam abertos como draft; #18 foi aberto como draft de `agent/assistente-cef-blunana` para `codex-agent-doc-structure`.
- 2026-07-08: `.env`, `.env.*` e screenshots PNG foram mantidos fora do PR #18; screenshots permanecem apenas como evidencia local nao versionada.
