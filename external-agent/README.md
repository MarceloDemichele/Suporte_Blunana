# Assistente IA de suporte Blunana

Esta pasta concentra o agente interno usado no fluxo de suporte Blunana.

## Papel no projeto

O objetivo principal é receber uma solicitação de um agente externo, montar contexto a partir de documentação, tickets, knowledge e materiais de suporte, e responder com base em evidências.

Antes de procurar arquivos diretamente, o agente deve consultar:

- index/master-index.json

O ponto de entrada do fluxo está em external-agent/index.ts.

Exemplo:

```bash
npm run agent:ask -- "como funciona o fluxo de suporte?"
```

As fontes locais do assistente ficam centralizadas em:

- external-agent/config/paths.ts

A busca local em Markdown e JSON fica em:

- external-agent/core/search.ts

| Área | Responsabilidade |
|---|---|
| config/ | Configurações do assistente e parâmetros de execução |
| core/ | Tipos, contratos e orquestração central |
| context/ | Montagem de contexto a partir de docs, knowledge, outputs e engenharia reversa |
| providers/ | Adaptadores para provedores de IA |
| services/ | Serviços de domínio usados pelo assistente |
| prompts/ | Prompts específicos do assistente |
| tools/ | Ferramentas acionáveis pelo assistente |
| cache/ | Cache local de contexto e respostas intermediárias |
| logs/ | Logs locais do assistente |
| index.ts | Executor inicial do assistente |

## Variáveis de ambiente para conexão

O serviço depende das seguintes variáveis no ambiente de execução:

- `APP_ENV` — ambiente operacional, como `dev`, `hml` ou `prod`
- `APP_URL` — URL de login do Blunana
- `APP_USER` — usuário autorizado
- `APP_PASSWORD` — senha do usuário
- `MFA_SECRET` — segredo TOTP para MFA
- `ALLOW_PLAYWRIGHT` — `true` para habilitar navegação real via Playwright
- `PROJECT_NAME` — nome apresentado pela API, por padrão `Blunana / Suporte`
- `AGENT_PORT` — porta da API, por padrão `3333`

Exemplo local em `.env`:

```env
APP_ENV=dev
APP_URL=https://exemplo/login
APP_USER=usuario
APP_PASSWORD=senha
MFA_SECRET=segredo
ALLOW_PLAYWRIGHT=false
PROJECT_NAME=Blunana / Suporte
AGENT_PORT=3333
```

## Estado atual

O fluxo inicial já está estruturado para busca local, contexto e resposta com base em materiais do projeto.
