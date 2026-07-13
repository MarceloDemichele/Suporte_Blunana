# 07 - Cenarios de Teste QA

| ID | Modulo | Cenario | Pre-condicao | Passos | Resultado esperado | Prioridade |
|---|---|---|---|---|---|---|
| QA-001 | Configuracao | Executar com `config.json` valido | Arquivo presente com chaves esperadas | Iniciar aplicacao | Configuracoes sao lidas e servicos instanciados | Alta |
| QA-002 | Configuracao | Ausencia de connection string | Remover/omitir `ConnectionStrings:DefaultConnection` | Iniciar aplicacao | Erro `Erro ao obter configuração do banco` | Alta |
| QA-003 | Login | Usuario ja autenticado | Browser abre URL sem `logon` | Executar `LoginService.RunAsync` | Login considerado bem-sucedido | Media |
| QA-004 | Login | Login com captcha resolvido | Credenciais e CapMonster validos | Executar fluxo de login | URL sai de `logon` e metodo retorna sucesso | Alta |
| QA-005 | Login | Falha nas 3 tentativas | Portal/captcha/credenciais invalidas | Executar login | Excecao apos terceira tentativa | Alta |
| QA-006 | Publicacoes | Pesquisa primeiro grau | Login realizado | Processar fase com `isSegundoGrau=false` | Datas preenchidas, filtro acionado e tabela extraida | Alta |
| QA-007 | Publicacoes | Pesquisa segundo grau | Login realizado | Processar fase com `isSegundoGrau=true` | Select `nGrauExpediente` recebe valor `2` | Alta |
| QA-008 | Publicacoes | Paginacao com botao proxima | Portal retorna varias paginas | Executar pesquisa | HTML de todas as paginas e coletado | Alta |
| QA-009 | Publicacoes | Sem botao proxima | Portal retorna uma pagina | Executar pesquisa | Loop encerra sem erro | Media |
| QA-010 | Parser | Tabela HTML valida | HTML com cabecalhos esperados | Executar `HtmlTableParser.Parse<PublicacoesTable>` | Lista tipada preenchida | Alta |
| QA-011 | Parser | HTML vazio ou sem tabela | Entrada vazia/sem `table` | Executar parser | Retorna lista vazia | Media |
| QA-012 | Importacao | Expedientes existentes | Banco retorna expedientes | Processar fase | Registros existentes nao sao importados | Alta |
| QA-013 | Importacao | Expedientes duplicados no portal | Tabela contem mesmo expediente repetido | Processar fase | Apenas um por expediente segue para importacao | Alta |
| QA-014 | Importacao | Erro em um item | Procedure falha para um registro | Importar lote | Erro e logado e proximos itens continuam | Alta |
| QA-015 | Logs | Log inicial/final | Banco disponivel | Executar fluxo | Registros em `T_EXECUCOES_ROBOTS` com status esperados | Media |
| QA-016 | Notificacoes | Slack indisponivel | Webhook invalido/fora | Finalizar fluxo | `EnsureSuccessStatusCode` gera erro | Media |
| QA-017 | Notificacoes | WhatsApp via procedure | Banco disponivel | Finalizar fluxo | Procedure `PRC_NOTIFICA_SUPORTE_ROCHA_ZAP` chamada | Media |
| QA-018 | Resumo | Execucao sem publicacoes novas | Banco ja contem todos expedientes | Processar fase | Totais refletem existentes e novas igual a zero | Alta |

Ponto critico para E2E: os testes dependem do portal externo da CEF, captcha, ChromeDriver e banco MySQL. Para automacao robusta, seria necessario isolar Selenium, CapMonster e repositorios por interfaces/mocks; isso nao existe no codigo atual.

## Pontos de automacao recomendados

| Camada | O que automatizar | Motivo |
|---|---|---|
| Unidade | `HtmlTableParser` com tabelas validas, vazias e malformadas | Parser concentra transformacao de dados |
| Unidade | Dedupe por `p_EXPEDIENTE` em `ProcessarFaseAsync` | Regra critica para evitar duplicidade |
| Integracao controlada | `PublicacoesRepository` contra banco de teste | Procedure e SQL sao parte central do fluxo |
| Contrato externo | Seletores Selenium do portal | Mudancas no HTML quebram o robo |
| E2E | Login + consulta + resumo em ambiente homologado | Valida fluxo real ponta a ponta |
