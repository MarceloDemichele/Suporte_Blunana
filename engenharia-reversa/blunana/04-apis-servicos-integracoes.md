# 04 - APIs, Servicos e Integracoes

## Serviços internos do crawler

| Serviço/arquivo | Responsabilidade | Evidência |
|---|---|---|
| `loginBlunana` | Autenticar no Blunana com usuário, senha e MFA | `crawler-interface/auth/login.ts` |
| `gerarCodigoMFA` | Gerar TOTP com `otplib` e aceitar segredo em texto ou `otpauth://` | `crawler-interface/auth/mfa.ts` |
| `criarSessao` | Abrir Chromium Playwright com `HEADLESS` | `crawler-interface/auth/session.ts` |
| `coletarMenu` | Extrair `a`, `button` e `[role='menuitem']` | `crawler-interface/collectors/menu.collector.ts` |
| `coletarTelas` | Visitar rotas com `href`, coletar título/H1/H2 e screenshots condicionais | `crawler-interface/collectors/screens.collector.ts` |
| `reverse-prod` | Orquestrar login, screenshot inicial, coleta de menu/telas e inventario PROD | `crawler-interface/reverse-prod.ts` |

## Endpoints/rotas externas conhecidas

| Método | URL/path | Finalidade | Arquivo/evidência | Dados enviados | Dados retornados |
|---|---|---|---|---|---|
| Navegação Playwright | URL de login configurada por `BLUNANA_LOGIN_URL`, `BLUNANA_BASE_URL` ou `APP_URL` | Abrir login do Blunana | `crawler-interface/auth/login.ts` | Não se aplica a payload HTTP no código | Página de login |
| Submissão pela UI | `Security/StartOtpLogin` | Iniciar login OTP | `outputs/relatorios/blunana/dev/blunana-inventario.md` | Usuário/senha preenchidos na UI | Solicitação de MFA ou navegação |
| Submissão pela UI | `Security/CompleteOtpLogin` | Concluir login OTP | `outputs/relatorios/blunana/dev/blunana-inventario.md` | Código MFA preenchido na UI | Studio autenticado |
| Navegação Playwright | `/@rocha_juridico/studio/*` | Visitar telas mapeadas | `crawler-interface/collectors/screens.collector.ts`, `outputs/json/blunana/dev/blunana-telas.json` | Não se aplica | HTML renderizado; título/H1/H2 |

## Autenticação

O login usa seletores tolerantes para localizar campos de usuário, senha, MFA e botões de submit. O fluxo considera autenticado quando a URL final não contém `/auth/login`.

Evidência: `crawler-interface/auth/login.ts`.

## Tratamento de erro

| Situação | Tratamento | Evidência |
|---|---|---|
| Configuração obrigatória ausente | Lança erro `{NOME} nao configurado.` | `crawler-interface/auth/login.ts` |
| Campo de login ausente | Lança `Campo de usuario/login nao encontrado.` | `crawler-interface/auth/login.ts` |
| Campo de MFA ausente em fluxo sem senha | Lança `Campo de MFA nao encontrado.` | `crawler-interface/auth/login.ts` |
| Login permanece em `/auth/login` | Captura mensagem visível, salva debug HTML/screenshot e lança erro | `crawler-interface/auth/login.ts` |
| Menu não existe para coleta de telas | Lança erro orientando executar `npm run menu:{ambiente}` | `crawler-interface/collectors/screens.collector.ts` |
| Erro ao navegar em tela individual | Registra item com `erro: String(error)` e continua inventário | `crawler-interface/collectors/screens.collector.ts` |
| Falha no executor PROD | Gera log em `outputs/logs/blunana/prod/engenharia-reversa-blunana-prod-log.md` com status `falha` e relança o erro | `crawler-interface/reverse-prod.ts` |

## Integrações externas aparentes

| Integração | Evidência | Status |
|---|---|---|
| Blunana Studio | `outputs/json/blunana/dev/blunana-telas.json`, `outputs/json/blunana/dev/blunana-menu.json` | Comprovada em DEV |
| RD Station | Rotas `consulta rdstation` e `oaut rdstation` | Nome/rota comprovados; fluxo interno é ponto a validar |
| User Defined API | Relatório `Log - User Defined Api` | Nome/rota comprovados; endpoints internos não foram extraídos |

## Pontos a validar

- Endpoints HTTP reais chamados pelo frontend Blunana durante cada tela.
- Payloads e respostas de APIs internas do Blunana.
- Interceptors, tokens e storage da aplicação alvo.
- Upload/download nas telas customizadas, especialmente `teste upload de imagem`.
