# Inventario Blunana - primeira navegacao DEV

## Data

2026-07-06

## Objetivo

Validar a primeira navegacao no Blunana em ambiente DEV, passando pelo fluxo de MFA.

## Ambiente

- Ambiente: DEV
- URL alvo atual corrigida para navegacao: `https://epm.blueprojects.com.br/@rocha_juridico/studio/auth/login`
- Execucao: `npm run login:dev`

## Fluxo validado

1. Carregar variaveis de ambiente via `config/loadEnv.ts`.
2. Abrir sessao Playwright via `crawler-interface/auth/session.ts`.
3. Acessar a tela de login configurada.
4. Preencher usuario e senha.
5. Submeter `Security/StartOtpLogin`.
6. Preencher codigo MFA gerado por `crawler-interface/auth/mfa.ts`.
7. Submeter `Security/CompleteOtpLogin`.
8. Validar navegacao para o Studio.
9. Salvar evidencia visual em `outputs/screenshots/blunana/dev/login-teste.png`.

## Tela inicial autenticada

Tela observada apos login:

- `BLUNANA APPLICATION STUDIO`
- `Monitoring Dashboard`

Menus visiveis:

- Home
- Branches
- Planner
- Database
- User Defined Functions
- Builder
- Reports
- Access
- Logs
- Settings
- Workflow

Cards/atalhos visiveis:

- Database
- Builder
- User Defined Functions
- Settings
- Logs

## Arquivos alterados ou usados

- `crawler-interface/auth/login.ts`
- `crawler-interface/auth/mfa.ts`
- `crawler-interface/auth/session.ts`
- `crawler-interface/test-login.ts`
- `package.json`
- `outputs/screenshots/blunana/dev/login-teste.png`

## Evidencias

- Evidencia historica de login mantida em `outputs/screenshots/blunana/dev/login-teste.png`; links de navegacao foram corrigidos para o tenant `@rocha_juridico`.
- `outputs/screenshots/blunana/dev/login-teste.png` mostra o dashboard autenticado.

## Pendencias

- Mapear rotas internas de cada menu sem alterar dados reais.
- Validar permissoes esperadas para o usuario utilizado.
- Evitar registrar credenciais, tokens, codigos MFA ou dados sensiveis em logs e documentacao.
