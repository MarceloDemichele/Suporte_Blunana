# 01 - Visao Geral

## Sistema

O repositorio contem uma aplicacao console .NET chamada `Robo-CEF`. O objetivo implementado no fluxo principal e automatizar login no portal juridico da Caixa, pesquisar publicacoes por periodo e fase processual, extrair linhas de tabela HTML, importar novas publicacoes para MySQL e enviar resumo por Slack e WhatsApp.

Evidencias:

- `Robo-CEF/Program.cs`
- `Robo-CEF/Robo-CEF.csproj`
- `Robo-CEF.sln`

## Stack

| Item | Evidencia |
|---|---|
| Linguagem | C# em `Robo-CEF/*.cs` |
| Runtime alvo | `.NET 8.0` em `Robo-CEF/Robo-CEF.csproj` |
| Tipo | `Exe` em `Robo-CEF/Robo-CEF.csproj` |
| Automacao web | Selenium WebDriver e ChromeDriver em `Robo-CEF/Robo-CEF.csproj` |
| Banco | MySQL via `MySql.Data` e Dapper em `Robo-CEF/Robo-CEF.csproj` |
| Configuracao | `Microsoft.Extensions.Configuration.Json` e `config.json` |
| Captcha | `Zennolab.CapMonsterCloud.Client` em `Robo-CEF/Robo-CEF.csproj` |

## Estrutura de pastas

| Pasta/arquivo | Papel identificado |
|---|---|
| `Robo-CEF/Program.cs` | Orquestracao principal do robo |
| `Robo-CEF/Services` | Login, captcha, consulta de publicacoes e notificacoes |
| `Robo-CEF/Repositories` | Acesso a banco via Dapper/MySQL |
| `Robo-CEF/Models` | DTOs/estruturas usadas na extracao e resumo |
| `Robo-CEF/Constants` | Constantes de fase, data e status de execucao |
| `Robo-CEF/Utils` | Parser de tabela HTML |
| `Robo-CEF/Workers` | Implementacao alternativa/legada de login, captcha e extracao |
| `Robo-CEF/MySqlDatabase` | Insercao por procedure usada pelo worker legado |
| `Robo-CEF/config.json` | Configuracao da execucao com segredos em claro |
| `crawler.ts` | Entrada auxiliar TypeScript para crawler com variaveis de ambiente |
| `config/loadEnv.ts` | Carregamento de `.env.dev`, `.env.hml` ou `.env.prod` conforme `APP_ENV` |
| `config/environment.ts` | Centralizacao das variaveis `APP_URL`, `APP_USER`, `APP_PASSWORD` e `MFA_SECRET` |
| `crawler-interface` | Estrutura auxiliar para auth, navegacao, coletores e validadores do crawler |

## Como rodar

Com base no projeto, o comando esperado seria:

```powershell
dotnet run --project Robo-CEF/Robo-CEF.csproj
```

Para compilar:

```powershell
dotnet build Robo-CEF.sln
```

Ponto observado: a validacao local falhou porque nao ha .NET SDK instalado na maquina usada para a analise. Mensagem obtida: `No .NET SDKs were found.`

## Configuracoes importantes

Arquivo: `Robo-CEF/config.json`.

| Chave | Uso identificado | Arquivo |
|---|---|---|
| `ConnectionStrings:DefaultConnection` | MySQL para repositorios | `Program.cs`, `Repositories/*.cs`, `Workers/CredentialsFetcher.cs` |
| `LoginUser:UserName` | Login no portal CEF | `Services/LoginService.cs` |
| `LoginUser:PassWord` | Senha do portal CEF | `Services/LoginService.cs` |
| `Capmonster:Key` | Resolucao de captcha | `Program.cs`, `Services/CapchaService.cs`, `Workers/CaptchaBreaker.cs` |
| `TimeoutSeconds:Default` | Esperas Selenium padrao | `Services/PublicacoesService.cs` |
| `TimeoutSeconds:Loading` | Espera de carregamento | `Services/PublicacoesService.cs` |
| `ItemsPerPage` | Quantidade de registros por pagina no portal | `Services/PublicacoesService.cs` |
| `DiasRetroativos` | Periodo pesquisado a partir da data atual | `Program.cs` |
| `IsDevelopment` | Controla janela maximizada ou tamanho fixo do Chrome | `Program.cs` |

Os valores sensiveis foram omitidos desta documentacao.

## Variaveis de ambiente

No codigo C# ativo, nao foram encontradas leituras de variaveis de ambiente. As configuracoes do robo .NET sao obtidas por `ConfigurationBuilder().AddJsonFile("config.json", ...)`.

Na camada auxiliar TypeScript, `crawler.ts` importa `config/loadEnv.ts`, que carrega `.env.dev`, `.env.hml` ou `.env.prod` conforme `APP_ENV`. As variaveis lidas sao `APP_URL`, `APP_USER`, `APP_PASSWORD` e `MFA_SECRET`.

Evidencias:

- `Robo-CEF/Program.cs`
- `Robo-CEF/Workers/CredentialsFetcher.cs`
- `Robo-CEF/Workers/CaptchaBreaker.cs`
- `Robo-CEF/MySqlDatabase/MySqlDatabase.cs`
- `crawler.ts`
- `config/loadEnv.ts`
- `config/environment.ts`

## Dependencias declaradas

| Pacote | Versao | Uso identificado |
|---|---:|---|
| `Microsoft.Extensions.Configuration` | `9.0.8` | Leitura de configuracao |
| `Microsoft.Extensions.Configuration.Json` | `9.0.8` | Leitura de `config.json` |
| `MySql.Data` | `9.4.0` | Conexao MySQL |
| `Selenium.Essentials` | `2.0.2` | Dependencia Selenium declarada |
| `Selenium.WebDriver` | `4.34.0` | Automacao do browser |
| `Selenium.WebDriver.ChromeDriver` | `143.0.7499.4200` | Driver do Chrome |
| `SeleniumExtras.WaitHelpers` | `1.0.2` | Esperas Selenium |
| `Zennolab.CapMonsterCloud.Client` | `3.1.0` | Resolucao de captcha |
| `Dapper` | `2.1.66` | Queries e procedures no MySQL |

## Dependencias Node auxiliares

| Pacote | Uso identificado | Evidencia |
|---|---|---|
| `dotenv` | Carregamento de arquivos `.env` por ambiente | `config/loadEnv.ts`, `package.json` |
| `cross-env` | Define `APP_ENV` nos scripts multi-plataforma | `package.json` |
| `ts-node` | Executa `crawler.ts` diretamente nos scripts npm | `package.json` |
| `typescript` | Compilacao/validacao dos arquivos TypeScript | `tsconfig.json`, `package.json` |
| `@types/node` | Tipos Node para `process.env` | `package.json` |

Ponto a validar: o codigo tambem referencia `HtmlAgilityPack` e `Newtonsoft.Json`, mas estes pacotes nao aparecem declarados no `.csproj`.

## Arquivos importantes

| Arquivo | Importancia |
|---|---|
| `Robo-CEF/Program.cs` | Fluxo principal da aplicacao |
| `Robo-CEF/Robo-CEF.csproj` | Target, dependencias e publicacao |
| `Robo-CEF/config.json` | Configuracao de execucao e segredos |
| `Robo-CEF/Services/LoginService.cs` | Login no portal CEF |
| `Robo-CEF/Services/PublicacoesService.cs` | Consulta e extracao das publicacoes |
| `Robo-CEF/Repositories/PublicacoesRepository.cs` | Dedupe e importacao no banco |
| `Robo-CEF/Repositories/LogsRepository.cs` | Registro da execucao do robo |
| `Robo-CEF/Services/NotityService.cs` | Notificacoes Slack e WhatsApp |
| `Robo-CEF/Utils/HtmlTableParser.cs` | Conversao de tabela HTML para modelo |
