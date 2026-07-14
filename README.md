# Suporte Blunana

Este repositório passou a concentrar o fluxo de suporte Blunana com um agente externo acionando um agente interno para analisar documentação, navegar no sistema e atualizar a base documental.

## Fluxo principal

1. Receber a solicitação do agente externo.
2. Encaminhar a pergunta para o agente interno.
3. Consultar documentação, conhecimento, tickets e materiais de suporte.
4. Navegar no sistema quando houver necessidade de evidência em tempo real.
5. Responder com base em evidências e, quando necessário, atualizar a documentação.

## Estrutura do projeto

```text
.
├── README.md
├── AGENTS.md
├── package.json
├── external-agent/
│   ├── index.ts
│   ├── api/
│   ├── config/
│   ├── core/
│   ├── context/
│   ├── providers/
│   ├── services/
│   ├── prompts/
│   └── tools/
├── docs/
├── engenharia-reversa/
├── prompts/
├── support/
└── outputs/
```

## Como usar

Iniciar o servidor do agente interno:

```bash
npm run agent:server
```

Executar uma consulta simples:

```bash
npm run agent:ask -- "como funciona o fluxo de suporte?"
```

## Escopo ativo

- Agente externo chamando agente interno.
- Análise de documentação e contexto.
- Navegação no sistema para coleta de evidência.
- Atualização de documentação baseada no que foi encontrado.

O fluxo antigo ligado ao contexto de automação foi removido do escopo ativo deste projeto.
