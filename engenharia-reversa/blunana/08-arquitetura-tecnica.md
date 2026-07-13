# 08 - Arquitetura Tecnica

## Organização

O crawler Blunana é organizado em módulos TypeScript simples:

| Camada | Arquivos | Responsabilidade |
|---|---|---|
| Configuração | `config/loadEnv.ts`, `config/environment.ts`, `config/paths.ts`, `config/environments.json` | Ambiente, variáveis e caminhos de saída |
| Autenticação | `crawler-interface/auth/login.ts`, `mfa.ts`, `session.ts` | Sessão Playwright, login, MFA e validação de autenticação |
| Coleta | `crawler-interface/collectors/menu.collector.ts`, `screens.collector.ts` | Inventário de menu e telas |
| Entrypoints | `crawler-interface/test-login.ts`, `test-menu.ts`, `test-screens.ts`, `reverse-prod.ts`, `crawler.ts` | Scripts executados via npm |
| Evidências | `outputs/json/blunana/dev/*.json`, `outputs/screenshots/blunana/dev/*`, `outputs/{tipo}/blunana/{ambiente}/*` | Artefatos de execução separados por tipo, dominio e ambiente |

## Padrões usados

| Padrão | Evidência | Observação |
|---|---|---|
| Configuração por ambiente | `APP_ENV`, `.env.{env}` | `config/loadEnv.ts` |
| Fail fast para configuração obrigatória | `requireConfig` | `crawler-interface/auth/login.ts` |
| Seletores tolerantes | Arrays de seletores para login, senha, MFA e submit | `crawler-interface/auth/login.ts` |
| Coleta resiliente | `try/catch` por tela | `crawler-interface/collectors/screens.collector.ts` |
| Saída por ambiente | `outputPath`, `outputRoot` | `config/paths.ts` |

## Fluxo técnico

1. Script npm define `APP_ENV`.
2. `config/loadEnv.ts` carrega `.env.{APP_ENV}`.
3. `criarSessao` abre Chromium Playwright com base em `HEADLESS`.
4. `loginBlunana` acessa URL configurada, preenche usuário/senha e MFA.
5. `coletarMenu` extrai menu e grava JSON.
6. `coletarTelas` lê menu, navega por hrefs únicos, coleta título/H1/H2 e screenshot opcional.
7. `reverse-prod.ts` orquestra o fluxo completo de PROD, gera JSON em `outputs/json/blunana/prod/`, relatorios em `outputs/relatorios/blunana/prod/` e log em `outputs/logs/blunana/prod/`.

## Acoplamentos

| Acoplamento | Impacto |
|---|---|
| Seletores dependem da UI real do Blunana | Mudanças na tela de login podem quebrar autenticação |
| MFA depende de `MFA_SECRET` | Execução automatizada falha sem segredo válido |
| Playwright navega na aplicação real | Execução em PROD deve evitar ações transacionais |
| `CAPTURE_SCREENSHOTS` não mascara automaticamente | Risco de evidência visual conter dados sensíveis |

## Riscos técnicos

- Não há testes unitários do crawler.
- `crawler.ts` apenas lê variáveis e não executa fluxo completo.
- Diretórios `navigation`, `validators`, `data`, `html` e alguns `.gitkeep` indicam estrutura planejada ainda sem implementação.
- Não há parser de formulários/campos; a engenharia de formulários depende de screenshot ou futura coleta de DOM.
- Não há captura de chamadas de rede, payloads ou storage.
