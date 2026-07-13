# 13 - Matriz de Rastreabilidade

| Tema solicitado | Status | Evidencias | Observacao |
|---|---|---|---|
| Atualizacao por PR/mudanca de codigo | Mapeado | `AGENTS.md`, `prompts/reverse-engineering.md`, `docs/robo-cef-README.md` | Qualquer alteracao de codigo deve revisar e atualizar os `.md` impactados |
| Arquitetura | Mapeado | `Program.cs`, pastas `Services`, `Repositories`, `Models`, `Utils`, `Constants` | Console app com orquestracao manual |
| Modulos | Mapeado | `robo-cef-modulos-funcionais.md`, `robo-cef-inventario-codigo-fonte.md` | 7 modulos principais |
| Regras de negocio | Mapeado | `Program.cs`, `PublicacoesService.cs`, `PublicacoesRepository.cs` | Somente regras evidenciadas no codigo |
| Endpoints | Mapeado | `LoginService.cs`, `PublicacoesService.cs`, `NotityService.cs`, `CaptchaBreaker.cs` | Inclui URLs externas e webhooks; sem API propria |
| Servicos | Mapeado | `Services/*.cs` | Login, captcha, publicacoes e notificacao |
| Autenticacao | Mapeado | `Services/LoginService.cs` | Autenticacao externa no portal CEF |
| Banco de dados | Parcial | `Repositories/*.cs`, `MySqlDatabase.cs` | Sem schema completo no repo |
| Tabelas | Parcial | `PublicacoesRepository.cs`, `LogsRepository.cs` | 2 tabelas citadas diretamente; `T_PROCESSOS_TERCEIRIZACAO_CEF` e chamada sem schema explicito no SQL ativo |
| Relacionamentos | Nao encontrado | Nenhum DDL/migration | Ponto a validar |
| Validacoes | Mapeado | `LoginService.cs`, `PublicacoesService.cs`, `HtmlTableParser.cs` | Validacoes sao majoritariamente de presenca/fluxo |
| Permissoes | Parcial | `config.json`, repositories e portal | Permissoes reais dependem de sistemas externos |
| Componentes | Mapeado | Seletores Selenium em services/workers | Componentes sao elementos do portal externo |
| Fluxo das telas | Mapeado | `robo-cef-telas.md`, `robo-cef-fluxo-operacional.md` | Login e consulta de fases |
| Navegacao Blunana | Parcial | `crawler-interface/auth/login.ts`, `crawler-interface/test-login.ts`, `config/paths.ts`, `outputs/screenshots/blunana/prod/login-teste.png` | Caminhos ajustados para artefatos por tipo, dominio e ambiente; producao grava em `outputs/{tipo}/blunana/prod/`. Execucao PROD e ponto a validar |
| Integracoes | Mapeado | Portal CEF, CapMonster, Slack, MySQL/WhatsApp | Valores sensiveis omitidos |
| Encerramento e notificacoes | Mapeado | `Program.cs`, `Services/NotityService.cs`, `Repositories/WhatsAppRepository.cs`, `Repositories/LogsRepository.cs` | `finally` executa resumo, mas falhas de notificacao nao sao isoladas e podem interromper etapas posteriores |
| Variaveis de ambiente | Parcial | `crawler.ts`, `config/loadEnv.ts`, `config/environment.ts`, `config/paths.ts`, `package.json` | Robo .NET ativo usa `config.json`; crawler TypeScript auxiliar usa `.env.{APP_ENV}` e artefatos em `outputs/{tipo}/{OUTPUT_DOMAIN}/{APP_ENV}` |
| Arquivos importantes | Mapeado | `robo-cef-engenharia-reversa.md`, `robo-cef-inventario-codigo-fonte.md` | Inclui ativos e legados |
| Testes | Nao encontrado | Ausencia de projetos/arquivos de teste | Cenarios QA foram propostos a partir do codigo |

## Cobertura por arquivo

| Arquivo | Coberto em |
|---|---|
| `AGENTS.md` | Politica de atualizacao continua, objetivo do agente, regras de evidencia |
| `prompts/reverse-engineering.md` | Prompt operacional, entregaveis, criterio para atualizar documentos em PRs |
| `docs/robo-cef-README.md` | Indice, resumo executivo, politica de atualizacao da documentacao |
| `Robo-CEF/Program.cs` | Visao geral, modulos, regras, arquitetura, fluxo operacional |
| `Robo-CEF/Robo-CEF.csproj` | Visao geral, riscos |
| `Robo-CEF/config.json` | Visao geral, integracoes, riscos |
| `crawler.ts` | Visao geral, configuracoes TypeScript auxiliares |
| `config/loadEnv.ts` | Visao geral, configuracoes, variaveis de ambiente |
| `config/environment.ts` | Visao geral, configuracoes, variaveis de ambiente |
| `config/paths.ts` | Caminhos de artefatos por tipo, dominio e ambiente para testes e documentacao do crawler |
| `config/environments.json` | Configuracoes por ambiente do crawler auxiliar |
| `tsconfig.json` | Dependencias/configuracao TypeScript auxiliar |
| `package.json` | Scripts e dependencias Node auxiliares |
| `prompts/09-engenharia-reversa-blunana-prod.md` | Procedimento de engenharia reversa controlada do Blunana em producao |
| `crawler-interface/auth/login.ts` | Fluxo de login Blunana com usuario, senha e MFA |
| `crawler-interface/auth/mfa.ts` | Geracao de codigo MFA via `otplib` |
| `crawler-interface/auth/session.ts` | Criacao de sessao Playwright |
| `crawler-interface/test-login.ts` | Teste de primeira navegacao autenticada |
| `crawler-interface/reverse-prod.ts` | Executor de engenharia reversa Blunana PROD |
| `index/master-index.json` | Indice mestre de fontes para o Assistente IA CEF |
| `external-agent/README.md` | Escopo e papel do futuro Assistente IA CEF |
| `external-agent/index.ts` | Executor inicial do Assistente IA CEF com pergunta por argumento |
| `external-agent/config/paths.ts` | Configuracao de fontes locais do Assistente IA CEF |
| `external-agent/core/search.ts` | Busca local em arquivos Markdown e JSON |
| `external-agent/{config,core,context,providers,services,prompts,tools,cache,logs}` | Estrutura planejada do Assistente IA CEF |
| `engenharia-reversa/README.md` | Indice e regra da nova raiz de engenharia reversa |
| `engenharia-reversa/robo-cef/*` | Documentacao consolidada de engenharia reversa do robo CEF |
| `docs/tecnica/organizacao-artefatos.md` | Regra de separacao entre Blunana, robos e ambientes |
| `docs/blunana/README.md` | Indice de documentacao do dominio Blunana |
| `docs/robos/README.md` | Indice de documentacao do dominio robos |
| `outputs/logs/*` | Logs de execucao por dominio e ambiente |
| `outputs/json/*` | JSONs e inventarios estruturados por dominio e ambiente |
| `outputs/screenshots/blunana/dev/*` | Evidencias visuais por dominio e ambiente; raiz tambem contem historico |
| `outputs/relatorios/*` | Relatorios gerados por dominio e ambiente |
| `outputs/temp/*` | Arquivos temporarios por dominio e ambiente |
| `outputs/{tipo}/blunana/*` | Artefatos esperados para testes e documentacao Blunana por ambiente |
| `outputs/{tipo}/robos/*` | Artefatos esperados para testes e documentacao dos robos por ambiente |
| `outputs/relatorios/blunana/dev/blunana-inventario.md` | Inventario historico da primeira navegacao DEV |
| `engenharia-reversa/blunana/*` | Documentacao de engenharia reversa do crawler Blunana e telas inventariadas |
| `knowledge/frontend/rotas-blunana.md` | Rotas Blunana conhecidas |
| `docs/funcional/mapa-navegacao-blunana.md` | Mapa funcional da navegacao inicial |
| `Services/LoginService.cs` | Rotas/telas, modulos, autenticacao, fluxo |
| `Services/PublicacoesService.cs` | Rotas/telas, modulos, regras, fluxo |
| `Services/CapchaService.cs` | Integracoes, modulos |
| `Services/NotityService.cs` | Integracoes, riscos |
| `Repositories/PublicacoesRepository.cs` | Banco, regras, QA |
| `Repositories/LogsRepository.cs` | Banco, logs, arquitetura |
| `Repositories/WhatsAppRepository.cs` | Integracoes e banco |
| `Utils/HtmlTableParser.cs` | Catalogo de dados, parser, QA |
| `Models/*.cs` | Catalogo de dados, inventario |
| `Constants/*.cs` | Regras, arquitetura |
| `Workers/*.cs` | Inventario, riscos, pontos a validar |
| `MySqlDatabase/MySqlDatabase.cs` | Inventario, banco legado |
