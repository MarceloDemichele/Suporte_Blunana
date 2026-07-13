# Decisões

## 06/07/2026

Foi decidido remover o campo
"Nossas Considerações"
das mensagens WhatsApp.

Motivo

Ultrapassava o limite de caracteres.

Impacto

Nenhum impacto funcional.

## 07/07/2026

Foi decidido isolar os artefatos do crawler TypeScript por dominio e ambiente usando `config/paths.ts`.

Motivo

Evitar que atualizacoes do Blunana e dos robos se misturem, e evitar que testes/documentacoes de producao sobrescrevam evidencias de DEV/HML.

Impacto

O caminho padrao passa a ser `outputs/{tipo}/{OUTPUT_DOMAIN}/{APP_ENV}`. Para Blunana, `APP_ENV=prod` gera JSON em `outputs/json/blunana/prod/`, screenshots em `outputs/screenshots/blunana/prod/`, logs em `outputs/logs/blunana/prod/`, relatorios em `outputs/relatorios/blunana/prod/` e temporarios em `outputs/temp/blunana/prod/`. Para robos, deve-se usar `OUTPUT_DOMAIN=robos` e a mesma divisao por tipo e ambiente.

## 07/07/2026

Foi decidido mover a documentacao de engenharia reversa para a raiz `engenharia-reversa/`.

Motivo

Separar documentacao consolidada dos artefatos gerados por execucao.

Impacto

`engenharia-reversa/robo-cef/` passa a concentrar a engenharia reversa do robo CEF, `engenharia-reversa/blunana/` passa a concentrar a engenharia reversa Blunana, e `outputs/` fica reservado para logs, JSON, screenshots, relatorios e temporarios.

## 07/07/2026

Foi decidido criar uma area dedicada para o Assistente IA CEF em `external-agent/`.

Motivo

O objetivo final do projeto nao deve girar em torno do crawler. O crawler deve ser fonte auxiliar de evidencias, enquanto o Assistente IA CEF concentra contexto, providers, ferramentas, prompts e servicos.

Impacto

`external-agent/` passa a ser a raiz de evolucao do assistente, com `config/`, `core/`, `context/`, `providers/`, `services/`, `prompts/`, `tools/`, `cache/`, `logs/`, `index.ts` e `README.md`.

## 07/07/2026

Foi decidido criar `index/master-index.json` como indice mestre do projeto.

Motivo

O Assistente IA CEF deve consultar fontes organizadas antes de procurar arquivos diretamente.

Impacto

O fluxo de contexto passa a iniciar pelo indice mestre, que aponta memoria, knowledge, docs, engenharia reversa, tickets, outputs, external-agent, crawler e config.

## 07/07/2026

Foi decidido centralizar fontes locais do Assistente IA CEF em `external-agent/config/paths.ts`.

Motivo

Evitar que o assistente procure arquivos sem uma configuracao declarada de fontes.

Impacto

`external-agent/config/paths.ts` passa a expor `paths`, com `memory`, `knowledge`, `docs`, `tickets`, `support`, `reverseDirs` e `outputs`.

## 07/07/2026

Foi decidido criar uma busca local simples em `external-agent/core/search.ts`.

Motivo

Permitir que o Assistente IA CEF consulte arquivos `.md` e `.json` nas fontes configuradas antes de depender de providers de IA.

Impacto

`external-agent/core/search.ts` exporta `buscar`; `external-agent/index.ts` usa essa busca no executor inicial.

## 07/07/2026

Foi decidido transformar `external-agent/index.ts` no executor inicial do Assistente IA CEF.

Motivo

Permitir uso direto por linha de comando com uma pergunta, retornando arquivos relevantes encontrados nas fontes locais.

Impacto

`npm run agent:cef -- "pergunta"` passa a executar busca em `.memory`, `knowledge`, `docs`, `tickets`, `support`, engenharia reversa e `outputs`.

## 08/07/2026

Foi decidido abrir as mudancas locais do Assistente IA CEF e Blunana em PR empilhado sobre `codex-agent-doc-structure`.

Motivo

Preservar a ordem dos PRs ja pendentes: #16 documentacao base, #17 estrutura documental do agente e #18 implementacao do assistente/crawler/documentacao Blunana.

Impacto

O PR #18 usa base `codex-agent-doc-structure` e branch `agent/assistente-cef-blunana`.

## 08/07/2026

Foi decidido manter `.env`, `.env.*` e screenshots PNG fora do PR.

Motivo

Evitar publicacao de credenciais locais, codigos MFA, dados visuais sensiveis ou evidencias binarias pesadas.

Impacto

`.gitignore` passa a ignorar `.env` e `.env.*`; os diretórios de screenshots entram apenas com `.gitkeep`.
