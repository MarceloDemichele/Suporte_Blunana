# 06 - Regras de Negocio

| ID | Regra | Evidencia | Arquivo | Impacto |
|---|---|---|---|---|
| RN-001 | O periodo pesquisado inicia em `DateTime.Now.AddDays(-DiasRetroativos)` e termina em `DateTime.Now`. | Calculo de `dataInicio` e `dataFim` | `Program.cs` | Define janela de busca no portal |
| RN-002 | O robo processa duas fases: primeiro grau e segundo grau. | Duas chamadas de `ProcessarFaseAsync`, com `isSegundoGrau` falso e verdadeiro | `Program.cs` | Gera resumo separado por grau |
| RN-003 | Primeiro grau recebe fase processual `1a. Fase`; segundo grau recebe `2a. Fase`. | Constantes e atribuicao em `ProcessarFaseAsync` | `Constants/FasesProcessuais.cs`, `Program.cs` | Valor enviado para importacao |
| RN-004 | Segundo grau e filtrado selecionando `nGrauExpediente` com valor `2`. | `SelectByValue("2")` | `Services/PublicacoesService.cs` | Diferencia consulta de segundo grau |
| RN-005 | Datas do portal usam formato `dd/MM/yyyy`. | `TipoDatas.DataBrasil` | `Constants/DateFormat.cs`, `Services/PublicacoesService.cs` | Formato de entrada no portal |
| RN-006 | O total do portal e extraido do caption por regex `Total:`. | `Regex.Match(captionTotal, @"Total:\s*([.,\d]+)")` | `Services/PublicacoesService.cs` | Alimenta resumo |
| RN-007 | Publicacoes extraidas sao deduplicadas por `p_EXPEDIENTE`. | `ToHashSet()` e `DistinctBy(p => p.p_EXPEDIENTE)` | `Program.cs` | Evita importar expedientes duplicados na mesma execucao |
| RN-008 | Publicacoes ja existentes no banco nao sao reimportadas. | Consulta `WHERE EXPEDIENTE IN @Expedientes` | `Repositories/PublicacoesRepository.cs`, `Program.cs` | Evita duplicidade com base existente |
| RN-009 | Importacao e feita em lotes de 100. | `publicacoes.Chunk(100)` | `Repositories/PublicacoesRepository.cs` | Controla processamento e progresso |
| RN-010 | Erros por item nao interrompem toda a importacao. | `catch` interno incrementa erro e registra log | `Repositories/PublicacoesRepository.cs` | Permite continuar lote |
| RN-011 | Falha global define `Environment.ExitCode = 1`, guarda erro e relanca excecao. | `catch (Exception ex)` no `Main` | `Program.cs` | Sinaliza falha da execucao |
| RN-012 | O resumo final e enviado no `finally`, mesmo com erro global. | Montagem e notificacao no `finally` | `Program.cs` | Garante comunicacao de termino/erro |
| RN-013 | Login possui tres tentativas com timeouts de 5, 15 e 30 segundos. | `listaDeTimeouts` | `Services/LoginService.cs` | Resiliencia de login |
| RN-014 | Se a URL nao contem `logon`, o usuario e considerado ja logado. | `if (!driver.Url.Contains("logon"))` | `Services/LoginService.cs` | Evita login desnecessario |
| RN-015 | Se a selecao de quantidade por pagina falhar, o fluxo apenas registra aviso e continua. | `catch` em `SelectCountByPage` | `Services/PublicacoesService.cs` | Consulta pode seguir com paginacao padrao |
| RN-016 | Expedientes vazios ou nulos nao sao enviados para a consulta de existentes no banco, mas ainda podem entrar no conjunto de novas publicacoes, limitado por `DistinctBy(p => p.p_EXPEDIENTE)`. | `Where(expediente => !string.IsNullOrEmpty(expediente))` no `HashSet` e filtro posterior por `expedientesExistentes.Contains(p.p_EXPEDIENTE ?? string.Empty)` | `Program.cs` | Pode tentar importar uma publicacao sem expediente por fase; comportamento final depende da procedure |
| RN-017 | Falhas nas notificacoes do `finally` nao sao tratadas isoladamente; uma excecao no Slack pode impedir WhatsApp, log final e fechamento do driver. | Chamadas sequenciais `NotificarSlackAsync`, `NotificarWhatsAppAsync`, `LogFinalizacaoAsync` e `CloseAndClean` sem `try/catch` interno | `Program.cs`, `Services/NotityService.cs` | Risco de encerramento incompleto quando integracao de notificacao falha |

## Atualizacao 2026-07-07

O ajuste de caminhos dos artefatos do crawler TypeScript (`config/paths.ts`, `crawler-interface/test-login.ts`, `crawler-interface/collectors/*.ts`, `package.json`) nao alterou regras de negocio do robo CEF documentadas nesta matriz. A mudanca afeta somente configuracao operacional de testes/documentacao por ambiente.
