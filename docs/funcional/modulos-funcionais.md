# Modulos Funcionais

## Orquestracao

Modulo responsavel por iniciar o robo, montar dependencias, executar as fases de processamento, gerar resumo e encerrar recursos.

Evidencia: `Robo-CEF/Program.cs`.

## Login no portal CEF

Modulo responsavel por autenticar o robo no portal juridico CEF usando usuario, senha e captcha.

Evidencias:

- `Robo-CEF/Services/LoginService.cs`
- `Robo-CEF/Services/CapchaService.cs`

## Consulta de publicacoes

Modulo responsavel por acessar a tela de fases/publicacoes, aplicar filtros de periodo e grau, selecionar quantidade por pagina, paginar resultados e extrair tabelas HTML.

Evidencia: `Robo-CEF/Services/PublicacoesService.cs`.

## Parser de publicacoes

Modulo responsavel por converter tabela HTML em objetos tipados para importacao.

Campos funcionais identificados em publicacoes:

| Campo | Origem/uso | Evidencia |
|---|---|---|
| `Expediente` | Identificacao usada para deduplicacao e consulta de existentes | `Robo-CEF/Models/PublicacoesTable.cs`, `Robo-CEF/Program.cs` |
| `Area Judicial` | Campo extraido da tabela | `Robo-CEF/Models/PublicacoesTable.cs` |
| `Situacao CEF` | Campo extraido da tabela | `Robo-CEF/Models/PublicacoesTable.cs` |
| `Data Fase` | Campo extraido da tabela | `Robo-CEF/Models/PublicacoesTable.cs` |
| `Descricao` | Campo extraido da tabela | `Robo-CEF/Models/PublicacoesTable.cs` |
| `Fase Processual` | Definida pelo robo como 1a. ou 2a. fase | `Robo-CEF/Program.cs`, `Robo-CEF/Constants/FasesProcessuais.cs` |

Evidencias:

- `Robo-CEF/Utils/HtmlTableParser.cs`
- `Robo-CEF/Models/PublicacoesTable.cs`

## Importacao de publicacoes

Modulo responsavel por verificar expedientes existentes, filtrar publicacoes novas e chamar a procedure de importacao.

Evidencia: `Robo-CEF/Repositories/PublicacoesRepository.cs`.

## Logs de execucao

Modulo responsavel por registrar estados do robo no banco.

Status identificados:

- `INICIANDO`
- `EM_PROCESSO`
- `FINALIZADO`
- `ERRO`

Evidencias:

- `Robo-CEF/Repositories/LogsRepository.cs`
- `Robo-CEF/Constants/RobotExecutionState.cs`

## Notificacoes

Modulo responsavel por enviar o resumo final para Slack e WhatsApp.

Evidencias:

- `Robo-CEF/Services/NotityService.cs`
- `Robo-CEF/Repositories/WhatsAppRepository.cs`

## Codigos alternativos ou legados

Foram identificados workers alternativos/legados para login, captcha, extracao e insercao. Eles nao aparecem como chamados pelo `Main` atual.

Evidencias:

- `Robo-CEF/Workers/*.cs`
- `Robo-CEF/MySqlDatabase/MySqlDatabase.cs`
- `outputs/relatorios/inventario-projeto.md`

Ponto a validar: confirmar se esses arquivos devem ser mantidos, removidos ou reativados.
