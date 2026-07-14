# Inventário Técnico e Funcional do Projeto

Data da análise: 2026-07-13

## Escopo analisado

Este inventário foi gerado a partir da documentação, prompts, tickets e materiais de suporte disponíveis no workspace.

## Visão geral

O projeto passou a concentrar o fluxo de suporte Blunana, com foco em análise documental, consulta a contexto, navegação quando necessária e atualização da base de conhecimento e da documentação.

## Estrutura de pastas

- `docs/`: documentação funcional e técnica do fluxo Blunana.
- `engenharia-reversa/`: documentação consolidada de engenharia reversa.
- `support/`: respostas e materiais de apoio para clientes e times internos.
- `knowledge/`: base de conhecimento operacional e funcional.
- `outputs/`: artefatos gerados por execução e evidências.
- `external-agent/`: agente externo e infraestrutura de suporte.

## Fluxo principal

1. Receber a solicitação do agente externo ou do usuário.
2. Consultar `docs/`, `knowledge/`, `support/`, `tickets/` e `outputs/`.
3. Navegar no sistema quando houver necessidade de evidência em tempo real.
4. Responder com base em evidências e, se necessário, atualizar a documentação.

## Pontos de atenção

- As respostas devem ser fundamentadas em evidências locais.
- Regras de negócio ainda podem exigir validação técnica quando a documentação não for suficiente.
- O repositório deve permanecer alinhado ao escopo de suporte e documentação, sem reintroduzir referências ao contexto antigo de automação.
