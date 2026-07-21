# Validação da camada de interpretação — 2026-07-20

## Mudança de arquitetura

O fluxo anterior executava pesquisa textual antes de decidir a intenção. O controlador agora chama `interpretQuestion` antes de qualquer busca ou navegação.

A interpretação registra intenção, entidade, ação, origem, identificadores, necessidade de dado atual, necessidade de conhecimento local, confiança e ambiguidade. Roteador, pesquisa, navegação e resposta recebem essa mesma estrutura.

## Decisões de fonte

- Dado atual com identificador: consulta direcionada na plataforma; não executa pesquisa documental prévia.
- Procedimento, regra ou tela: busca enriquecida pelos conceitos interpretados.
- Pergunta ambígua: não pesquisa e não navega.

## Evidências automatizadas

- `npm run test:interpretation`: 8 interpretações estruturadas e 2 extrações de identificadores aprovadas.
- `npm run test:battery`: 239 perguntas aprovadas.
- `npm run test:navigation`: 11 planos direcionados e 1 resposta sanitizada aprovados.
- `npm run test:rules`: 64 regras e 6 variações aprovadas.

## Compatibilidade

O contrato público de `POST /assistant` permanece com os cinco campos existentes. A interpretação é interna e não expõe dados adicionais.

## Validação integrada da API

- Dado atual: processo específico consultado em PROD somente leitura, sem pesquisa documental prévia.
- Procedimento: inclusão de prazo respondeu com os sete caminhos documentados.
- Ambiguidade: `Quem é o responsável?` não acionou navegação; a resposta solicita entidade e identificador.
