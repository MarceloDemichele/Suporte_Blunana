# Mapeamento autonomo do escopo HML

Data: 2026-07-15

## Autorizacao

A equipe de suporte autorizou a navegacao autonoma e a criacao de memorias para os 13 submenus aprovados, sem confirmacao manual a cada tela.

O limite de seguranca adotado foi: navegar, abrir abas e modais nao destrutivos, mas nao confirmar inclusoes, alteracoes ou exclusoes.

## Resultado

- Telas previstas: 13.
- Telas mapeadas: 13.
- Falhas: 0.
- Memorias Markdown criadas: 13.
- Evidencias JSON criadas: 13.
- Modais detectados e fechados sem submissao: 6.
- E-mails, CPFs ou CNPJs encontrados nos artefatos: 0.
- Screenshots: 0.
- Alteracoes confirmadas no sistema: 0.

## Telas mapeadas

- Configuracao do Ateste
- Configuracao Usuario
- Configuracao de Publicacao
- Configuracao do Prazo
- Configuracao de Processos
- Home
- Agenda de prazos
- Processos
- Publicacoes
- Prazos
- Audiencia
- Audiencia Mutirao
- Ateste

## Modais detectados

- Configuracao de Processos
- Configuracao de Publicacao
- Configuracao do Ateste
- Configuracao do Prazo
- Configuracao Usuario
- Processos

## Observacoes

- Contagens de botoes incluem controles globais do layout, como idioma, tema e menu lateral.
- Este foi um mapeamento estrutural inicial. Regras de negocio, validacoes condicionais e resultados de submissao exigem passagens especificas com massa de teste autorizada.
- As memorias ficam em `docs/telas/hml/`.
- As evidencias ficam em `outputs/json/blunana/hml/`.
