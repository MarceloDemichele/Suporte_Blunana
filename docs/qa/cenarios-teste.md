# Cenarios de Teste

Fonte principal: `outputs/relatorios/inventario-projeto.md`.

## Cenarios funcionais

| ID | Modulo | Cenario | Pre-condicao | Resultado esperado | Evidencia |
|---|---|---|---|---|---|
| QA-001 | Configuracao | Executar com configuracao valida | `config.json` valido e acessos disponiveis | Robo inicia e registra log de inicializacao | `Robo-CEF/Program.cs`, `LogsRepository.cs` |
| QA-002 | Configuracao | Executar sem connection string | Remover/invalidar `ConnectionStrings:DefaultConnection` | Execucao falha com erro de configuracao | `Robo-CEF/Program.cs` |
| QA-003 | Login | Login com credenciais validas | Portal acessivel e captcha resolvido | Login conclui e fluxo continua | `Robo-CEF/Services/LoginService.cs` |
| QA-004 | Login | Login falha nas tres tentativas | Credenciais invalidas ou portal indisponivel | Erro apos tres tentativas | `Robo-CEF/Services/LoginService.cs` |
| QA-005 | Captcha | CapMonster retorna erro | Chave invalida ou erro simulado | Excecao no servico de captcha | `Robo-CEF/Services/CapchaService.cs` |
| QA-006 | Consulta | Pesquisa 1a. fase | Login realizado | Tabelas HTML sao coletadas | `Robo-CEF/Services/PublicacoesService.cs` |
| QA-007 | Consulta | Pesquisa 2a. fase | Login realizado | Filtro `nGrauExpediente` usa valor `2` | `Robo-CEF/Services/PublicacoesService.cs` |
| QA-008 | Consulta | Portal sem caption de total | Tela carregada sem caption esperado | Total do portal retorna `0` | `Robo-CEF/Services/PublicacoesService.cs` |
| QA-009 | Parser | Converter tabela HTML valida | HTML com tabela e cabecalhos esperados | Lista de `PublicacoesTable` preenchida | `Robo-CEF/Utils/HtmlTableParser.cs` |
| QA-010 | Parser | Converter HTML vazio | Entrada vazia | Lista vazia sem erro | `Robo-CEF/Utils/HtmlTableParser.cs` |
| QA-011 | Importacao | Filtrar expedientes existentes | Banco retorna expedientes ja cadastrados | Apenas novos expedientes sao importados | `Robo-CEF/Program.cs`, `PublicacoesRepository.cs` |
| QA-012 | Importacao | Lista sem novas publicacoes | Todos expedientes ja existem | Nenhuma importacao e executada | `Robo-CEF/Program.cs` |
| QA-013 | Importacao | Erro em uma publicacao | Procedure falha para um item | Erro registrado e lote continua | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| QA-014 | Logs | Registrar erro de processamento | Falha em item importado | Registro com status `ERRO` | `Robo-CEF/Repositories/LogsRepository.cs` |
| QA-015 | Notificacao | Enviar resumo Slack | Webhook valido | `EnsureSuccessStatusCode` sem excecao | `Robo-CEF/Services/NotityService.cs` |
| QA-016 | Notificacao | Enviar resumo WhatsApp | Banco e procedure disponiveis | Procedure de WhatsApp chamada com mensagem | `Robo-CEF/Repositories/WhatsAppRepository.cs` |
| QA-017 | Encerramento | Erro global no processamento | Forcar erro no fluxo | Resumo final inclui mensagem de erro | `Robo-CEF/Program.cs` |

## Cenarios tecnicos

| ID | Area | Cenario | Resultado esperado | Evidencia |
|---|---|---|---|---|
| QA-T001 | Build | Restaurar e compilar projeto em ambiente limpo | Build deve concluir ou revelar dependencias ausentes | `Robo-CEF/Robo-CEF.csproj`, `outputs/relatorios/inventario-projeto.md` |
| QA-T002 | Banco | Validar parametros das procedures | Contratos confirmados contra banco real | `PublicacoesRepository.cs`, `WhatsAppRepository.cs` |
| QA-T003 | Seguranca | Validar ausencia de segredos em artefatos versionados | Segredos movidos para mecanismo seguro | `outputs/relatorios/inventario-projeto.md` |
| QA-T004 | Portal | Validar seletores Selenium apos mudancas do portal | Seletores continuam encontrando elementos | `LoginService.cs`, `PublicacoesService.cs` |

## Pontos a validar

Nao foram encontrados testes automatizados no inventario. Os cenarios acima sao sugeridos a partir das regras e fluxos comprovados no codigo.

Evidencia: `outputs/relatorios/inventario-projeto.md`.

