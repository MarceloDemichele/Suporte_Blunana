# Organizacao de Artefatos por Dominio e Ambiente

## Objetivo

Separar todas as atualizacoes, evidencias, inventarios e documentacoes operacionais por dominio funcional e ambiente.

## Dominios

| Dominio | Pasta base | Uso |
|---|---|---|
| Blunana | `outputs/{tipo}/blunana/{ambiente}/` | Evidencias de navegacao, menu, telas, screenshots e inventarios do Blunana |
| Robos | `outputs/{tipo}/robos/{ambiente}/` | Evidencias, logs e documentacoes operacionais dos robos |

## Tipos de saída

| Tipo | Pasta | Uso |
|---|---|---|
| Logs | `outputs/logs/{dominio}/{ambiente}/` | Logs e status de execucao |
| JSON | `outputs/json/{dominio}/{ambiente}/` | Inventarios estruturados, menu e telas |
| Screenshots | `outputs/screenshots/{dominio}/{ambiente}/` | Evidencias visuais |
| Relatorios | `outputs/relatorios/{dominio}/{ambiente}/` | Relatorios Markdown e organizacao de entregaveis |
| Temp | `outputs/temp/{dominio}/{ambiente}/` | Arquivos temporarios e debug |

## Ambientes

| Ambiente | Pasta Blunana | Pasta Robos |
|---|---|---|
| DEV | `outputs/relatorios/blunana/dev/` | `outputs/relatorios/robos/dev/` |
| HML | `outputs/relatorios/blunana/hml/` | `outputs/relatorios/robos/hml/` |
| PROD | `outputs/relatorios/blunana/prod/` | `outputs/relatorios/robos/prod/` |

## Regra para novos arquivos

Todo arquivo novo deve ser classificado antes de ser criado:

1. Dominio: `blunana` ou `robos`.
2. Ambiente: `dev`, `hml` ou `prod`.
3. Tipo: log, json, screenshot, relatorio ou temp.

Arquivos sem ambiente comprovado devem ser marcados como "Ponto a validar" e nao devem ser misturados com artefatos de PROD.

## Padrao tecnico

O crawler TypeScript usa `config/paths.ts`.

Sem `OUTPUT_DIR`, o caminho padrao e:

```text
outputs/{tipo}/{OUTPUT_DOMAIN}/{APP_ENV}
```

Valores padrao:

| Variavel | Padrao | Evidencia |
|---|---|---|
| `OUTPUT_DOMAIN` | `blunana` | `config/paths.ts` |
| `APP_ENV` | `dev` | `config/environment.ts`, `config/loadEnv.ts` |
| `OUTPUT_JSON_DIR` | nao definido | `config/paths.ts` |
| `OUTPUT_SCREENSHOTS_DIR` | nao definido | `config/paths.ts` |
| `OUTPUT_LOGS_DIR` | nao definido | `config/paths.ts` |
| `OUTPUT_REPORTS_DIR` | nao definido | `config/paths.ts` |
| `OUTPUT_TEMP_DIR` | nao definido | `config/paths.ts` |

Exemplo para producao Blunana:

```text
outputs/json/blunana/prod/blunana-menu.json
outputs/json/blunana/prod/blunana-telas.json
outputs/screenshots/blunana/prod/
outputs/logs/blunana/prod/engenharia-reversa-blunana-prod-log.md
outputs/relatorios/blunana/prod/README.md
```

## Artefatos historicos

Arquivos ja existentes diretamente em `outputs/`, como `outputs/json/blunana/dev/blunana-menu.json`, `outputs/json/blunana/dev/blunana-telas.json`, `outputs/screenshots/blunana/dev/login-teste.png` e `outputs/screenshots/`, devem ser tratados como evidencias historicas. Novas execucoes devem usar as pastas por dominio e ambiente.

## Pontos a validar

| Ponto | Motivo |
|---|---|
| Migracao de artefatos historicos | Pode alterar rastreabilidade de evidencias antigas |
| Separacao completa dos robos | O robo CEF ativo ainda usa documentacao consolidada em `engenharia-reversa/robo-cef/` |
