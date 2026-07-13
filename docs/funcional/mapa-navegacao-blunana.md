# Mapa de Navegacao Blunana

## Objetivo

Registrar a navegacao autenticada no Blunana com caminhos preparados para o ambiente de producao.

## Fluxo de login validado

1. Acessar a tela de login do Studio.
2. Preencher usuario e senha autorizados.
3. Acionar login.
4. Aguardar solicitacao de MFA.
5. Gerar codigo MFA a partir de `MFA_SECRET`.
6. Confirmar o codigo MFA.
7. Acessar o Studio em `/@rocha_juridico/studio`.

## Tela autenticada inicial

Tela: `Monitoring Dashboard`

Conteudos observados:

- Cards de monitoramento para tabelas, UDFs, usuarios e usuarios ativos.
- Grafico de chamadas UDF nas ultimas 24 horas.
- Atalhos rapidos para Database, Builder, User Defined Functions, Settings e Logs.

## Menus laterais observados

| Menu | Status |
|---|---|
| Home | Observado |
| Branches | Observado |
| Planner | Observado |
| Database | Observado |
| User Defined Functions | Observado |
| Builder | Observado |
| Reports | Observado |
| Access | Observado |
| Logs | Observado |
| Settings | Observado |
| Workflow | Observado |

## Evidencias

- `crawler-interface/auth/login.ts`
- `crawler-interface/test-login.ts`
- `config/paths.ts`
- `outputs/screenshots/blunana/prod/login-teste.png` (Ponto a validar: depende de execucao em `APP_ENV=prod`)
- `outputs/relatorios/blunana/dev/blunana-inventario.md`

## Pontos a validar

- Nao foram navegados submenus nem executadas acoes de criacao, edicao ou exclusao.
- Permissoes do usuario autenticado ainda precisam ser confirmadas.
- Rotas internas dos menus ainda precisam ser mapeadas.
- A execucao historica documentada foi em DEV; a nova base de artefatos para producao deve ser validada com `npm test`, `npm run docs:prod` ou `npm run reverse:prod`.
