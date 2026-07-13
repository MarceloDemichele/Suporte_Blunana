# 01 - Visao Geral

## Resumo

O recorte Blunana deste repositório é um crawler auxiliar em TypeScript/Playwright para autenticar no Blunana Studio, coletar menus, visitar telas acessíveis e registrar evidências em arquivos JSON e screenshots.

Evidências: `package.json`, `tsconfig.json`, `crawler-interface/auth/login.ts`, `crawler-interface/collectors/menu.collector.ts`, `crawler-interface/collectors/screens.collector.ts`.

## Stack

| Item | Evidência |
|---|---|
| Linguagem TypeScript | `tsconfig.json`, `crawler-interface/**/*.ts` |
| Runtime Node.js | `package.json` |
| Automação Playwright | `package.json`, `crawler-interface/auth/session.ts` |
| MFA TOTP via `otplib` | `package.json`, `crawler-interface/auth/mfa.ts` |
| Variáveis por ambiente com `dotenv` | `config/loadEnv.ts` |
| Scripts multiambiente com `cross-env` | `package.json` |

## Estrutura relacionada

| Caminho | Uso |
|---|---|
| `config/loadEnv.ts` | Carrega `.env.{APP_ENV}` |
| `config/environment.ts` | Centraliza `APP_URL`, `APP_USER`, `APP_PASSWORD`, `MFA_SECRET` |
| `config/paths.ts` | Define diretório de evidências por ambiente |
| `crawler-interface/auth/` | Login, sessão Playwright e MFA |
| `crawler-interface/collectors/` | Coleta de menu e telas |
| `crawler-interface/reverse-prod.ts` | Executor de engenharia reversa PROD |
| `outputs/json/blunana/dev/blunana-menu.json` | Menu coletado em DEV |
| `outputs/json/blunana/dev/blunana-telas.json` | Inventário de telas coletado em DEV |
| `outputs/screenshots/blunana/prod/login-teste.png` | Evidência visual esperada em PROD |

## Como rodar

Scripts comprovados em `package.json`:

| Comando | Finalidade |
|---|---|
| `npm run login:prod` | Autentica no Blunana em PROD e salva `outputs/screenshots/blunana/prod/login-teste.png` |
| `npm run menu:prod` | Autentica, coleta menu e salva `outputs/json/blunana/prod/blunana-menu.json` |
| `npm run screens:prod` | Autentica, coleta menu, visita telas e salva `outputs/json/blunana/prod/blunana-telas.json` |
| `npm run docs:prod` | Alias para `screens:prod` |
| `npm test` | Executa `screens:prod` |
| `npm run reverse:prod` | Executa fluxo PROD completo e gera evidencias em `outputs/{tipo}/blunana/prod/` |

## Variáveis de ambiente

| Variável | Uso | Evidência |
|---|---|---|
| `APP_ENV` | Seleciona `.env.dev`, `.env.hml` ou `.env.prod` | `config/loadEnv.ts`, `package.json` |
| `APP_URL` | URL alvo quando não houver `BLUNANA_LOGIN_URL`/`BLUNANA_BASE_URL` | `config/environment.ts`, `crawler-interface/auth/login.ts` |
| `APP_USER` | Usuário fallback | `config/environment.ts`, `crawler-interface/auth/login.ts` |
| `APP_PASSWORD` | Senha fallback | `config/environment.ts`, `crawler-interface/auth/login.ts` |
| `MFA_SECRET` | Geração de código TOTP | `crawler-interface/auth/mfa.ts` |
| `HEADLESS` | Controla execução sem interface gráfica | `crawler-interface/auth/session.ts` |
| `CAPTURE_SCREENSHOTS` | Controla captura de screenshots na coleta de telas | `crawler-interface/collectors/screens.collector.ts` |
| `OUTPUT_DIR` | Sobrescreve diretório base de evidências | `config/paths.ts` |

Valores reais não foram documentados.

## Estado das evidências

| Ambiente | Evidência | Status |
|---|---|---|
| DEV | `outputs/json/blunana/dev/blunana-menu.json`, `outputs/json/blunana/dev/blunana-telas.json`, `outputs/screenshots/blunana/dev/*` | Coleta de menu e 43 telas registrada |
| PROD | `outputs/screenshots/blunana/prod/login-teste.png` | Login possui evidência visual esperada; coleta completa de menu/telas em PROD é ponto a validar |

## Resumo executivo

| Métrica | Quantidade | Evidência |
|---|---:|---|
| Módulos funcionais agrupados | 7 | `outputs/json/blunana/dev/blunana-telas.json`, agrupamento documental |
| Rotas/telas inventariadas | 43 | `outputs/json/blunana/dev/blunana-telas.json` |
| Itens de menu com `href` no menu bruto | 56 | `outputs/json/blunana/dev/blunana-menu.json` |
| Serviços/APIs internas do crawler | 4 | `crawler-interface/auth/*.ts`, `crawler-interface/collectors/*.ts` |
| Formulários com campos comprovados em código | 1 | Login/MFA em `crawler-interface/auth/login.ts` |
| Executor PROD | 1 | `crawler-interface/reverse-prod.ts` |

Ponto a validar: os detalhes internos dos formulários das telas customizadas não foram extraídos pelo coletor atual.
