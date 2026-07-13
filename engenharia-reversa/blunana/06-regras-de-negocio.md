# 06 - Regras de Negocio

Somente regras comprovadas no código/artefatos foram registradas. Regras de negócio internas do Blunana alvo permanecem como ponto a validar quando não há evidência.

| ID | Regra | Evidência no código | Arquivo | Impacto |
|---|---|---|---|---|
| BLU-RN-001 | O ambiente padrão do crawler é `dev` quando `APP_ENV` não é informado. | `const env = process.env.APP_ENV || "dev"` | `config/loadEnv.ts` | Evita execução em PROD por padrão |
| BLU-RN-002 | O arquivo de variáveis carregado segue o padrão `.env.{APP_ENV}`. | `path: \`.env.${env}\`` | `config/loadEnv.ts` | Permite separar DEV/HML/PROD |
| BLU-RN-003 | O diretório padrão de evidências segue `outputs/{tipo}/{OUTPUT_DOMAIN}/{APP_ENV}`. | `path.join("outputs", "json", outputDomain, currentEnvironment)`, `path.join("outputs", "screenshots", outputDomain, currentEnvironment)`, demais tipos | `config/paths.ts` | Isola artefatos por tipo, dominio e ambiente |
| BLU-RN-004 | Variáveis `OUTPUT_*_DIR` sobrescrevem diretórios por tipo; `OUTPUT_DIR` mantém compatibilidade para JSON. | `OUTPUT_JSON_DIR`, `OUTPUT_SCREENSHOTS_DIR`, `OUTPUT_LOGS_DIR`, `OUTPUT_REPORTS_DIR`, `OUTPUT_TEMP_DIR`, `OUTPUT_DIR` | `config/paths.ts` | Permite execução controlada em caminho alternativo |
| BLU-RN-004A | `OUTPUT_DOMAIN` define o dominio dos artefatos; quando ausente, o padrao e `blunana`. | `process.env.OUTPUT_DOMAIN || "blunana"` | `config/paths.ts` | Separa Blunana e robos sem misturar evidencias |
| BLU-RN-005 | O login aceita `BLUNANA_LOGIN_URL` ou `BLUNANA_BASE_URL`; se ausentes, usa `APP_URL`. | `process.env.BLUNANA_LOGIN_URL || process.env.BLUNANA_BASE_URL || environment.url` | `crawler-interface/auth/login.ts` | Flexibiliza configuração da URL alvo |
| BLU-RN-006 | Usuário/senha podem vir de variáveis `BLUNANA_*` ou fallback `APP_*`. | `BLUNANA_USERNAME || environment.user`, `BLUNANA_PASSWORD || environment.password` | `crawler-interface/auth/login.ts` | Suporta nomes de variáveis legados/novos |
| BLU-RN-007 | Configuração obrigatória ausente interrompe o fluxo. | `requireConfig` lança erro quando valor é vazio | `crawler-interface/auth/login.ts` | Evita login sem credenciais/configuração |
| BLU-RN-008 | O segredo MFA pode ser texto simples ou URL `otpauth://`; espaços são removidos. | `secret.startsWith("otpauth://")`, `replace(/\s/g, "")` | `crawler-interface/auth/mfa.ts` | Compatibiliza formatos de segredo MFA |
| BLU-RN-009 | A autenticação é considerada concluída quando a URL não contém `/auth/login`. | `if (!page.url().includes("/auth/login")) return` | `crawler-interface/auth/login.ts` | Critério técnico de sucesso do login |
| BLU-RN-010 | Se o login continuar em `/auth/login`, o crawler salva `login-debug.png` e `login-debug.html`. | `page.screenshot`, `fs.writeFileSync(outputPath("login-debug.html"))` | `crawler-interface/auth/login.ts` | Gera evidência de falha |
| BLU-RN-011 | A coleta de menu considera links, botões e itens com `role=menuitem`. | `page.locator("a, button, [role='menuitem']")` | `crawler-interface/collectors/menu.collector.ts` | Define escopo do menu coletado |
| BLU-RN-012 | A coleta de telas navega apenas em itens de menu com `href` único. | `filter((item) => item.href)`, `findIndex((x) => x.href === item.href)` | `crawler-interface/collectors/screens.collector.ts` | Evita rotas duplicadas no inventário |
| BLU-RN-013 | Screenshots de telas só são capturados quando `CAPTURE_SCREENSHOTS=true`. | `process.env.CAPTURE_SCREENSHOTS === "true"` | `crawler-interface/collectors/screens.collector.ts` | Reduz risco de registrar dados sensíveis |
| BLU-RN-014 | Erro em uma tela não interrompe toda a coleta; o erro é registrado no inventário. | `catch (error) { inventario.push({ ..., erro: String(error) }) }` | `crawler-interface/collectors/screens.collector.ts` | Permite coleta parcial |
| BLU-RN-015 | O executor `reverse-prod` só executa quando `APP_ENV=prod`. | `if (process.env.APP_ENV !== requiredEnvironment)` | `crawler-interface/reverse-prod.ts` | Evita execução acidental em outro ambiente |
| BLU-RN-016 | O executor cria uma estrutura padronizada de relatorios dentro de `outputs/relatorios/blunana/prod/`. | `outputReportsPath("00-inventario")`, `outputReportsPath("01-mapa-navegacao")`, demais pastas | `crawler-interface/reverse-prod.ts` | Identifica e separa novos arquivos da engenharia reversa PROD |
| BLU-RN-017 | O executor registra README em relatorios e log em logs. | `outputReportsPath("README.md")`, `outputLogsPath("engenharia-reversa-blunana-prod-log.md")` | `crawler-interface/reverse-prod.ts` | Mantem rastreabilidade dos artefatos criados |
| BLU-RN-018 | Mesmo em falha, o executor gera log com status `falha` e relança o erro. | `catch (error)`, `escreverLog("falha", ...)`, `throw error` | `crawler-interface/reverse-prod.ts` | Mantem evidencia do problema sem ocultar falha |

## Pontos a validar

- Regras funcionais internas de prazos, publicações, processos, custas, cobrança e audiência.
- Permissões por perfil, grupo ou política.
- Validações dos formulários customizados.
- Diferenças entre DEV e PROD.
