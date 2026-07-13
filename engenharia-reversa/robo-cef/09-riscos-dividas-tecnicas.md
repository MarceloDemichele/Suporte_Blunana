# 09 - Riscos e Dividas Tecnicas

| ID | Risco/divida | Evidencia | Impacto |
|---|---|---|---|
| RISK-001 | Segredos em claro no repositorio | `Robo-CEF/config.json`, `Services/NotityService.cs` | Vazamento de credenciais, banco, CapMonster e webhook |
| RISK-002 | Possivel falha de compilacao por dependencias ausentes | `HtmlTableParser.cs` usa `HtmlAgilityPack`; `CaptchaBreaker.cs` usa `Newtonsoft.Json.Linq`; `.csproj` nao lista esses pacotes | Build pode falhar em ambiente limpo |
| RISK-003 | .NET SDK ausente no ambiente analisado | `dotnet build` retornou `No .NET SDKs were found` | Nao foi possivel validar build/testes |
| RISK-004 | Ausencia de testes automatizados | Nenhum projeto/arquivo de teste identificado | Alto risco de regressao |
| RISK-005 | Dependencia forte do HTML do portal CEF | Seletores CSS/XPath hardcoded | Mudanca no portal quebra robo |
| RISK-006 | Webhook Slack hardcoded | `Services/NotityService.cs` | Dificulta troca por ambiente e expõe segredo |
| RISK-007 | Codigo legado nao usado permanece no projeto | `Workers/*`, `MySqlDatabase/MySqlDatabase.cs` sem chamada pelo `Main` atual | Confusao, superficie de manutencao e dependencias extras |
| RISK-008 | Nome de arquivo com typo | `Services/NotityService.cs`, `Services/CapchaService.cs` | Baixo impacto funcional, piora legibilidade |
| RISK-009 | Falta de schema/migrations | Nao ha DDL no repositorio | Dificulta reproduzir ambiente |
| RISK-010 | `CloseAndClean(driver)` no `finally` sem null-check/try-catch | `Program.cs` | Erro ao fechar pode mascarar falha anterior |
| RISK-011 | Notificacoes no `finally` podem falhar e afetar encerramento | `NotifyService.NotificarSlackAsync` usa `EnsureSuccessStatusCode` | Falha de Slack pode gerar excecao no final |
| RISK-012 | Logs finais podem ser registrados mesmo apos erro global, mas sem isolamento de falhas | `Program.cs` | Problemas de banco/notificacao podem interferir no fechamento |
| RISK-013 | Connection string e credenciais nao usam variaveis de ambiente | `config.json` | Pouca seguranca e portabilidade |
| RISK-014 | Formato de data da procedure nao validado | `p_DATAFASE` como string | Pode falhar conforme expectativa do banco |
| RISK-015 | Sem interface para repositories/services | Instanciacao concreta no `Program.cs` | Dificulta testes e substituicao |

