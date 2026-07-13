# 11 - Inventario do Codigo-Fonte

## Solucao e projeto

| Arquivo | Papel |
|---|---|
| `Robo-CEF.sln` | Solucao Visual Studio com um projeto |
| `Robo-CEF/Robo-CEF.csproj` | Projeto console .NET 8 |
| `Robo-CEF/config.json` | Configuracao de runtime |
| `config.json` | Arquivo vazio na raiz, sem uso identificado pelo fluxo principal |

## Entrada

| Arquivo | Classe | Status no fluxo atual | Responsabilidades |
|---|---|---|---|
| `Robo-CEF/Program.cs` | `RoboCEF` | Ativo | Driver, configuracao, orquestracao, processamento de fases, resumo e cleanup |

## Services

| Arquivo | Classe | Status no fluxo atual | Responsabilidades |
|---|---|---|---|
| `Services/LoginService.cs` | `LoginService` | Ativo | Login no portal CEF com captcha e tentativas |
| `Services/PublicacoesService.cs` | `PublicacoesService` | Ativo | Busca, filtro, paginacao e extracao de tabelas |
| `Services/CapchaService.cs` | `CaptchaService` | Ativo | Resolver captcha via SDK CapMonster |
| `Services/NotityService.cs` | `NotifyService` | Ativo | Enviar resumo por Slack e WhatsApp |

Observacao: os nomes de arquivo `CapchaService.cs` e `NotityService.cs` parecem conter erros de grafia, mas as classes compilaveis declaradas sao `CaptchaService` e `NotifyService`.

## Repositories

| Arquivo | Classe | Status no fluxo atual | Responsabilidades |
|---|---|---|---|
| `Repositories/PublicacoesRepository.cs` | `PublicacoesRepository` | Ativo | Consultar expedientes existentes e importar novas publicacoes |
| `Repositories/LogsRepository.cs` | `LogsRepository` | Ativo | Gravar logs de execucao do robo |
| `Repositories/WhatsAppRepository.cs` | `WhatsAppRepository` | Ativo | Enviar mensagem para procedure de WhatsApp |

## Models

| Arquivo | Tipo | Status | Campos |
|---|---|---|---|
| `Models/PublicacoesTable.cs` | Classe | Ativo | `p_EXPEDIENTE`, `p_AREAJUDICIAL`, `p_SITUACAOCEF`, `p_DATAFASE`, `p_DESCRICAO`, `p_FASEPROCESSUAL` |
| `Models/ResumoPublicacoes.cs` | Struct | Ativo | Totais de portal, extraidos, nao duplicados, existentes, novos, sucesso e erro |
| `Models/CredentialsModel.cs` | Classe | Usado por worker legado | `Username`, `Password` |
| `Models/TableDataModel.cs` | Classe interna | Usado por worker legado | `expediente`, `area_judicial`, `situacao_cef`, `data_fase`, `descricao` |

## Constants

| Arquivo | Classe | Constantes |
|---|---|---|
| `Constants/FasesProcessuais.cs` | `FasesProcessuais` | `1a. Fase`, `2a. Fase` |
| `Constants/DateFormat.cs` | `TipoDatas` | `dd/MM/yyyy`, `dd/MM/yyyy HH:mm:ss` |
| `Constants/RobotExecutionState.cs` | `RobotExecutionState` | `INICIANDO`, `EM_PROCESSO`, `FINALIZADO`, `ERRO` |

## Utils

| Arquivo | Classe | Status | Responsabilidades |
|---|---|---|---|
| `Utils/HtmlTableParser.cs` | `HtmlTableParser` | Ativo | Parsear HTML de tabela para dicionarios e objetos tipados |

## Workers e codigo alternativo/legado

| Arquivo | Classe | Status no fluxo atual | Observacao |
|---|---|---|---|
| `Workers/Extractor.cs` | `Extractor` | Nao chamado pelo `Main` atual | Implementa consulta/extracao usando XPath e `TableDataExtractor` |
| `Workers/TableDataExtractor.cs` | `TableDataExtractor` | Nao chamado pelo `Main` atual | Extrai linhas da tabela diretamente e chama `MySqlDatabase.InsertProcessesByProcedure` |
| `Workers/LoginAutomator.cs` | `LoginAutomator` | Nao chamado pelo `Main` atual | Login legado por XPath |
| `Workers/CaptchaBreaker.cs` | `CaptchaSolver` | Nao chamado pelo `Main` atual | Captcha legado via HTTP direto para CapMonster |
| `Workers/CredentialsFetcher.cs` | `CredentialsFetcher` | Nao chamado pelo `Main` atual | Le credenciais do `config.json` |
| `MySqlDatabase/MySqlDatabase.cs` | `MySqlDatabase` | Usado pelo worker legado | Chamada direta da procedure de publicacoes |

## Arquivos sem conteudo funcional

| Arquivo | Observacao |
|---|---|
| `README.md` | Contem somente titulo `ROBO-CEF` |
| `config.json` na raiz | Arquivo vazio |

