# Escopo funcional ativo do Suporte Blunana

## Definicao

O escopo corresponde aos dois grupos laterais `Configuracoes` e `Menu` e aos submenus aprovados abaixo. A mesma regra vale para PROD e HML.

## Grupo Configuracoes

- Configuracao do Ateste
- Configuracao Usuario
- Configuracao de Publicacao
- Configuracao do Prazo
- Configuracao de Processos

## Grupo Menu

- Home
- Agenda de prazos
- Processos
- Publicacoes
- Prazos
- Audiencia
- Audiencia Mutirao
- Ateste

## Fora do escopo

Qualquer item lateral que nao esteja nas duas listas acima permanece fora do escopo, ainda que apareca em um dos ambientes.

## Equivalencia dos ambientes

A equipe de suporte confirmou em 2026-07-15 que PROD e HML possuem a mesma versao para o escopo aprovado. A coleta automatizada confirmou que as 13 rotas listadas existem nos dois ambientes.

HML pode ser usado para exploracao funcional controlada, abertura de modais e testes com dados ficticios. PROD permanece como confirmacao final, preferencialmente somente leitura, para orientacoes publicadas aos clientes.

## Evidencias

- Definicao e imagem do menu lateral fornecidas pela equipe de suporte em 2026-07-15.
- `outputs/json/blunana/prod/blunana-menu.json`
- `outputs/json/blunana/hml/blunana-menu.json`
