# 04 - APIs, Servicos e Integracoes

## Integracoes HTTP e externas

O fluxo principal chamado por `Program.cs` usa `Services/*` e `Repositories/*`. As entradas marcadas como legado existem no codigo, mas nao foram encontradas chamadas a elas no `Main` atual.

| Metodo | URL/servico | Finalidade | Arquivo | Dados enviados | Tratamento de erro |
|---|---|---|---|---|---|
| Navegacao Selenium | `https://www.juridico.caixa.gov.br` | Entrar no portal CEF | `Services/LoginService.cs` | Nao se aplica | Captura excecao por tentativa; erro final apos 3 tentativas |
| Navegacao Selenium | `/modulos/CtrlSistemico/_Ajustes/?pg=AjustesSIJURFaseAClassificar` | Consultar fases a classificar | `Services/PublicacoesService.cs` | Datas e grau via formulario | Excecoes de Selenium podem interromper fluxo |
| SDK CapMonster | CapMonsterCloud `SolveAsync` | Resolver captcha por imagem | `Services/CapchaService.cs` | Base64 da imagem captcha | Lanca excecao se `task.Error` existir |
| POST | Slack webhook | Enviar resumo de processamento | `Services/NotityService.cs` | JSON `{ text }` | `EnsureSuccessStatusCode()` |
| POST legado | `https://api.capmonster.cloud/createTask` | Criar tarefa de captcha | `Workers/CaptchaBreaker.cs` | `clientKey`, `task.type`, `task.body` | `EnsureSuccessStatusCode()` |
| POST legado | `https://api.capmonster.cloud/getTaskResult` | Buscar resultado do captcha | `Workers/CaptchaBreaker.cs` | `clientKey`, `taskId` | Loop ate `status == ready` |

Webhooks/chaves reais foram mascarados nesta documentacao.

## Servicos internos

| Servico | Responsabilidade | Dependencias |
|---|---|---|
| `LoginService` | Login no portal CEF | `IWebDriver`, `CaptchaService`, `IConfiguration` |
| `CaptchaService` | Resolver captcha via CapMonster | `ICapMonsterCloudClient` |
| `PublicacoesService` | Consultar e extrair tabelas no portal | `IWebDriver`, `IConfiguration` |
| `NotifyService` | Enviar Slack e WhatsApp | `WhatsAppRepository`, `HttpClient` |

## Repositorios

| Repositorio | Operacoes | Banco/procedure/tabela |
|---|---|---|
| `PublicacoesRepository` | Consultar expedientes existentes, importar publicacoes | `T_PROCESSOS_TERCEIRIZACAO_CEF` via banco configurado, `EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760` |
| `LogsRepository` | Inserir logs de execucao | `T_EXECUCOES_ROBOTS` |
| `WhatsAppRepository` | Adicionar mensagem de suporte | `PRC_NOTIFICA_SUPORTE_ROCHA_ZAP` |

## Autenticacao

Nao ha autenticacao propria da aplicacao. A autenticacao automatizada e feita no portal CEF por usuario/senha/captcha lidos de `config.json`.

Evidencia: `Services/LoginService.cs`.

## Permissoes

| Area | Permissao identificada | Evidencia | Observacao |
|---|---|---|---|
| Portal CEF | Acesso por usuario/senha/captcha | `Services/LoginService.cs` | Regras de perfil/autorizacao do portal nao estao no repositorio |
| MySQL | Usuario da connection string executa SELECT, INSERT e stored procedures | `Repositories/*.cs` | Permissoes reais do usuario devem ser validadas no banco |
| Slack | Webhook permite envio de mensagem | `Services/NotityService.cs` | Webhook esta hardcoded no codigo original |
| CapMonster | Chave permite resolver captcha | `Services/CapchaService.cs` | Chave vem de `config.json` |

## Operacoes de banco como integracoes

| Operacao | Objeto | Metodo chamado | Arquivo | Payload/parametros |
|---|---|---|---|---|
| SELECT | `T_PROCESSOS_TERCEIRIZACAO_CEF` | `QueryAsync<string>` | `Repositories/PublicacoesRepository.cs` | `Expedientes`; SQL usa tabela sem schema explicito e depende do banco da connection string |
| Stored procedure | `EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760` | `ExecuteAsync` | `Repositories/PublicacoesRepository.cs` | Propriedades de `PublicacoesTable` |
| INSERT | `EPM_ROCHA.T_EXECUCOES_ROBOTS` | `ExecuteAsync` | `Repositories/LogsRepository.cs` | `RobotId`, `Status`, `Detalhes` |
| Stored procedure | `EPM_ROCHA.PRC_NOTIFICA_SUPORTE_ROCHA_ZAP` | `ExecuteAsync` | `Repositories/WhatsAppRepository.cs` | `p_msg` |

## Comportamento de falha em encerramento

As notificacoes do resumo sao chamadas em sequencia no `finally` de `Program.cs`: Slack, WhatsApp, log final e fechamento do driver. Como nao ha `try/catch` individual nesse bloco e `NotificarSlackAsync` usa `EnsureSuccessStatusCode()`, uma falha no Slack pode interromper as etapas posteriores.
