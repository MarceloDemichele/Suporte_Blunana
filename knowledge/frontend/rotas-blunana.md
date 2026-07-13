# Rotas Blunana

## Ambiente DEV

Primeira navegacao autenticada validada em 2026-07-06.

| Rota | Tela | Status | Evidencia |
|---|---|---|---|
| `/@rocha_juridico/studio/auth/login` | Login Studio | Validado | `crawler-interface/auth/login.ts` |
| `/@rocha_juridico/studio` | Monitoring Dashboard | Validado | `outputs/screenshots/blunana/dev/login-teste.png` |

## Ambiente PROD

Testes e documentacao do crawler ajustados em 2026-07-07 para gerar artefatos em `outputs/{tipo}/blunana/prod/` quando `OUTPUT_DOMAIN=blunana` e `APP_ENV=prod`.

| Rota | Tela | Status | Evidencia |
|---|---|---|---|
| `/@rocha_juridico/studio/auth/login` | Login Studio | Ponto a validar em producao | `crawler-interface/auth/login.ts`, `config/paths.ts` |
| `/@rocha_juridico/studio` | Monitoring Dashboard | Ponto a validar em producao | `outputs/screenshots/blunana/prod/login-teste.png`, `config/paths.ts` |

## Menus observados no Studio

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

## Pontos a validar

- Rotas internas de cada menu.
- Permissoes por perfil.
- Acoes disponiveis em telas de cadastro, consulta, edicao ou administracao.
- Comportamento de logout e expiracao de sessao.
