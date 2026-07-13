# Configuracoes

Fonte principal: `outputs/relatorios/inventario-projeto.md`.

## Arquivos de configuracao

| Arquivo | Uso | Evidencia |
|---|---|---|
| `Robo-CEF/config.json` | Configuracao runtime do robo | `Robo-CEF/Program.cs` |
| `Robo-CEF/Robo-CEF.csproj` | Dependencias, target framework e publicacao | `Robo-CEF/Robo-CEF.csproj` |
| `config/repositories.json` | Configuracao de repositorios externos para scripts | `config/repositories.json`, `scripts/*.ps1` |
| `config/loadEnv.ts` | Carrega variaveis de ambiente para o crawler TypeScript a partir de `.env.{APP_ENV}` | `config/loadEnv.ts`, `crawler.ts` |
| `config/environment.ts` | Centraliza leitura de `APP_URL`, `APP_USER`, `APP_PASSWORD` e `MFA_SECRET` para codigo TypeScript | `config/environment.ts` |
| `config/paths.ts` | Centraliza caminhos de artefatos por tipo, dominio e ambiente; em `OUTPUT_DOMAIN=blunana` e `APP_ENV=prod`, usa `outputs/{tipo}/blunana/prod/` | `config/paths.ts`, `crawler-interface/test-login.ts`, `crawler-interface/collectors/*.ts` |
| `config/environments.json` | Mapeia ambientes auxiliares `dev`, `hml` e `prod` para arquivos `.env` correspondentes | `config/environments.json` |
| `index/master-index.json` | Indice mestre de fontes para o Assistente IA CEF consultar antes de procurar arquivos | `index/master-index.json` |
| `external-agent/config/paths.ts` | Configuracao de fontes locais consultadas pelo Assistente IA CEF | `external-agent/config/paths.ts` |
| `external-agent/core/search.ts` | Busca recursiva em arquivos `.md` e `.json` nas fontes configuradas | `external-agent/core/search.ts` |
| `crawler-interface/reverse-prod.ts` | Executor de engenharia reversa Blunana em producao; valida configuracao, coleta login/menu/telas e gera inventario PROD | `crawler-interface/reverse-prod.ts` |
| `external-agent/index.ts` | Executor inicial do Assistente IA CEF; recebe pergunta via argumento e busca em fontes locais | `external-agent/index.ts`, `package.json` |
| `package.json` | Dependencias Node e scripts `crawler:*`, `login:*`, `menu:*`, `screens:*`, `docs:prod`, `reverse:prod` e `test` | `package.json` |
| `tsconfig.json` | Configuracao TypeScript usada por `ts-node` nos scripts do crawler e do `external-agent` | `tsconfig.json` |

## Chaves do `config.json`

| Chave | Uso funcional/tecnico | Evidencia |
|---|---|---|
| `ConnectionStrings:DefaultConnection` | Conexao MySQL usada pelos repositories | `Robo-CEF/Program.cs`, `Robo-CEF/Repositories/*.cs` |
| `LoginUser:UserName` | Usuario do portal CEF | `Robo-CEF/Services/LoginService.cs` |
| `LoginUser:PassWord` | Senha do portal CEF | `Robo-CEF/Services/LoginService.cs` |
| `Capmonster:Key` | Chave de resolucao de captcha | `Robo-CEF/Program.cs`, `Robo-CEF/Services/CapchaService.cs` |
| `TimeoutSeconds:Default` | Timeout padrao de espera Selenium | `Robo-CEF/Services/PublicacoesService.cs` |
| `TimeoutSeconds:Loading` | Timeout de carregamento Selenium | `Robo-CEF/Services/PublicacoesService.cs` |
| `ItemsPerPage` | Quantidade de itens selecionada no portal | `Robo-CEF/Services/PublicacoesService.cs` |
| `DiasRetroativos` | Quantidade de dias retroativos pesquisados | `Robo-CEF/Program.cs` |
| `IsDevelopment` | Controla tamanho/maximizacao da janela Chrome | `Robo-CEF/Program.cs` |

## Publicacao

O `.csproj` configura publicacao Release como:

- single-file;
- self-contained;
- runtime `win-x64`;
- inclusao de bibliotecas nativas para self extract;
- compressao habilitada.

Evidencia: `Robo-CEF/Robo-CEF.csproj`.

## Seguranca de configuracao

Ponto de atencao: o inventario identificou configuracoes sensiveis no workspace. Valores sensiveis nao devem ser reproduzidos na documentacao.

Evidencias: `outputs/relatorios/inventario-projeto.md`, `Robo-CEF/config.json`, `Robo-CEF/Services/NotityService.cs`.

## Variaveis de ambiente do crawler TypeScript

O crawler auxiliar em TypeScript carrega variaveis via `config/loadEnv.ts`, usando `APP_ENV` para selecionar `.env.dev`, `.env.hml` ou `.env.prod`. Os scripts disponiveis sao:

- `npm test` (executa `screens:prod`)
- `npm run agent:cef -- "pergunta"`
- `npm run docs:prod`
- `npm run reverse:prod`
- `npm run crawler:dev`
- `npm run crawler:hml`
- `npm run crawler:prod`
- `npm run login:dev`
- `npm run login:hml`
- `npm run login:prod`
- `npm run menu:prod`
- `npm run screens:prod`

Os artefatos dos testes e da coleta de telas usam `config/paths.ts`. Sem sobrescrita, o padrao e `outputs/{tipo}/{OUTPUT_DOMAIN}/{APP_ENV}`; portanto, em producao Blunana os arquivos ficam em:

- `outputs/screenshots/blunana/prod/login-teste.png`
- `outputs/screenshots/blunana/prod/menu-teste.png`
- `outputs/json/blunana/prod/blunana-menu.json`
- `outputs/json/blunana/prod/blunana-telas.json`
- `outputs/screenshots/blunana/prod/`
- `outputs/logs/blunana/prod/engenharia-reversa-blunana-prod-log.md`
- `outputs/relatorios/blunana/prod/README.md` e subpastas de relatorio do executor

O executor `npm run reverse:prod` tambem gera `outputs/logs/blunana/prod/engenharia-reversa-blunana-prod-log.md` com status da execucao, arquivos gerados e pontos a validar, sem registrar valores sensiveis.

Variaveis esperadas:

| Variavel | Uso | Evidencia |
|---|---|---|
| `APP_ENV` | Seleciona o arquivo `.env` por ambiente | `config/loadEnv.ts`, `package.json` |
| `OUTPUT_DOMAIN` | Seleciona o dominio base dos artefatos; se ausente, usa `blunana` | `config/paths.ts` |
| `OUTPUT_DIR` | Sobrescreve o diretorio de JSON por compatibilidade | `config/paths.ts` |
| `OUTPUT_JSON_DIR` | Sobrescreve o diretorio de JSON | `config/paths.ts` |
| `OUTPUT_SCREENSHOTS_DIR` | Sobrescreve o diretorio de screenshots | `config/paths.ts` |
| `OUTPUT_LOGS_DIR` | Sobrescreve o diretorio de logs | `config/paths.ts` |
| `OUTPUT_REPORTS_DIR` | Sobrescreve o diretorio de relatorios | `config/paths.ts` |
| `OUTPUT_TEMP_DIR` | Sobrescreve o diretorio temporario | `config/paths.ts` |
| `APP_URL` | URL alvo do crawler | `crawler.ts`, `config/environment.ts` |
| `APP_USER` | Usuario do crawler | `crawler.ts`, `config/environment.ts` |
| `APP_PASSWORD` | Senha do crawler | `crawler.ts`, `config/environment.ts` |
| `MFA_SECRET` | Segredo MFA do crawler | `crawler.ts`, `config/environment.ts` |
| `HEADLESS` | Controla execucao sem interface grafica | `crawler-interface/auth/session.ts`, `.env.prod` |
| `SAFE_MODE` | Flag operacional para execucao segura em producao | `.env.prod` |
| `CAPTURE_SCREENSHOTS` | Controla se screenshots de telas devem ser capturados | `crawler-interface/collectors/screens.collector.ts`, `.env.prod` |
| `MASK_SENSITIVE_DATA` | Flag operacional para mascaramento de dados sensiveis | `.env.prod` |

Valores reais nao devem ser documentados.

No arquivo `.env.prod`, `CAPTURE_SCREENSHOTS=false` desabilita a captura de telas no inventario de producao; nesse caso, o campo `screenshot` recebe `desabilitado em produção`.

Ponto a validar: executar `npm test`, `npm run docs:prod` ou `npm run reverse:prod` com acesso autorizado ao ambiente de producao para gerar os artefatos reais em `outputs/{tipo}/blunana/prod/`.

## Pontos a validar

| Ponto | Motivo | Evidencia |
|---|---|---|
| Estrategia segura para segredos | Codigo le segredos de arquivo local e ha webhook hardcoded | `outputs/relatorios/inventario-projeto.md` |
| Variaveis de ambiente no C# ativo | Inventario nao encontrou leitura runtime de variaveis de ambiente no codigo C# ativo; o uso atual de `.env` esta restrito ao crawler TypeScript auxiliar | `outputs/relatorios/inventario-projeto.md`, `config/loadEnv.ts`, `crawler.ts` |
| Dependencias ausentes | Uso de pacotes nao declarados pode afetar build limpo | `outputs/relatorios/inventario-projeto.md` |
| Configuracao funcional do provider do Assistente IA CEF | Fontes locais ja existem em `external-agent/config/paths.ts`, mas provider/modelo/ferramentas ainda sao pontos a validar | `external-agent/README.md`, `external-agent/config/paths.ts` |
