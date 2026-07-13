# Assistente IA CEF

Esta pasta e dedicada ao Assistente IA CEF.

O objetivo final deste modulo e concentrar a camada de assistente, contexto, provedores de IA, ferramentas e servicos de apoio ao projeto Robo CEF Publicacoes.

## Papel no projeto

Antes de procurar arquivos diretamente, o Assistente IA CEF deve consultar:

- `index/master-index.json`

O entrypoint `external-agent/index.ts` executa uma busca inicial a partir de uma pergunta informada por argumento.

Exemplo:

```bash
npm run agent:cef -- "publicacoes CEF"
```

As fontes locais do assistente ficam centralizadas em:

- `external-agent/config/paths.ts`

A busca local em Markdown e JSON fica em:

- `external-agent/core/search.ts`

| Area | Responsabilidade |
|---|---|
| `config/` | Configuracoes do assistente e parametros de execucao |
| `core/` | Tipos, contratos e orquestracao central do assistente |
| `context/` | Montagem de contexto a partir de docs, knowledge, outputs e engenharia reversa |
| `providers/` | Adaptadores para provedores de IA |
| `services/` | Servicos de dominio usados pelo assistente |
| `prompts/` | Prompts especificos do Assistente IA CEF |
| `tools/` | Ferramentas acionaveis pelo assistente |
| `cache/` | Cache local de contexto e respostas intermediarias |
| `logs/` | Logs locais do assistente |
| `index.ts` | Executor inicial do Assistente IA CEF |

## Relacao com o crawler

O crawler permanece como fonte auxiliar de evidencias e engenharia reversa. O Assistente IA CEF deve consumir documentacao, knowledge, tickets, outputs e artefatos do crawler, mas nao deve depender do crawler como centro da arquitetura.

## Estado atual

Executor inicial criado com busca em fontes locais. Implementacao com provedores de IA, ferramentas e memoria de execucao ainda sao pontos a validar.
