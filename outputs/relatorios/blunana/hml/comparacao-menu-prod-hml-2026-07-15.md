# Comparacao de Menu - PROD x HML

Data: 2026-07-15

## Escopo

Comparar somente a estrutura de menu e as telas de configuracao, conforme escopo ativo definido pela equipe de suporte.

## Resumo

| Item | PROD | HML |
|---|---:|---:|
| Elementos de menu | 25 | 20 |
| Telas de configuracao | 7 | 5 |

## Configuracoes presentes nos dois ambientes

- Configuracao do Ateste
- Configuracao Usuario
- Configuracao de Publicacao
- Configuracao do Prazo
- Configuracao de Processos

## Configuracoes presentes em PROD e ausentes no menu HML

- Configuracao de palavras
- Configuracao parametros de cobranca

## Revisao de escopo

A equipe esclareceu posteriormente que a comparacao deve considerar somente os dois grupos laterais aprovados: `Configuracoes` e `Menu`. As 13 rotas desses grupos foram encontradas tanto em PROD quanto em HML.

As opcoes `Configuracao de palavras` e `Configuracao parametros de cobranca` nao fazem parte do escopo lateral aprovado e, portanto, nao representam divergencia relevante para este trabalho.

## Conclusao revisada

PROD e HML estao equivalentes para os 13 submenus que compoem o escopo ativo. O mapeamento controlado pode prosseguir em HML, com confirmacao final em PROD.

## Seguranca

- Nenhuma screenshot capturada.
- Nenhuma acao transacional executada.
- Menus sanitizados antes do armazenamento.

## Fontes

- `outputs/json/blunana/prod/blunana-menu.json`
- `outputs/json/blunana/hml/blunana-menu.json`
