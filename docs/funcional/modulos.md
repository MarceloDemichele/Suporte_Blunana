# Modulos Funcionais

Fonte principal: `outputs/relatorios/inventario-projeto.md`.

## Orquestracao da execucao

| Item | Descricao |
|---|---|
| Nome | Orquestracao da execucao |
| Objetivo | Iniciar configuracoes, abrir navegador, executar login, processar fases, gerar resumo, notificar e encerrar recursos. |
| Usuarios impactados | Operacao, suporte, desenvolvimento e atendimento ao cliente. |
| Fluxo principal | Le `config.json`, cria `ChromeDriver`, instancia servicos e repositorios, registra logs, processa 1a. e 2a. fase, envia notificacoes e fecha driver. |
| Regras de negocio | Executar 1a. fase antes da 2a. fase; incluir erro global no resumo quando ocorrer. |
| Campos e validacoes | `DiasRetroativos`, `IsDevelopment`, connection string e chave CapMonster sao lidos da configuracao; ausencia de banco ou chave CapMonster gera excecao. |
| Integracoes | Selenium, portal CEF, MySQL, Slack, WhatsApp e CapMonster por meio dos servicos chamados. |
| Permissoes | Nao ha permissao interna no codigo; depende de credenciais validas do portal CEF e acesso ao banco. |
| Possiveis erros | Falha de configuracao, login, portal, banco, captcha, notificacao ou driver. |
| Cenarios de teste sugeridos | Executar fluxo completo com configuracao valida; simular erro de login; simular ausencia de config obrigatoria; verificar resumo final. |

Evidencias: `Robo-CEF/Program.cs`, `outputs/relatorios/inventario-projeto.md`.

## Login no portal CEF

| Item | Descricao |
|---|---|
| Nome | Login no portal CEF |
| Objetivo | Autenticar o robo no portal juridico CEF usando usuario, senha e captcha. |
| Usuarios impactados | Operacao e suporte. |
| Fluxo principal | Acessa `https://www.juridico.caixa.gov.br`, preenche matricula, senha e captcha, envia login e aguarda sair da URL de logon. |
| Regras de negocio | Tenta login com tres janelas de timeout: 5, 15 e 30 segundos. |
| Campos e validacoes | `LoginUser:UserName`, `LoginUser:PassWord`, captcha resolvido; usuario/senha ausentes geram erro. |
| Integracoes | Portal juridico CEF e CapMonster Cloud. |
| Permissoes | Ponto a validar: perfil/permissao exigido no portal externo nao esta documentado no codigo. |
| Possiveis erros | Portal indisponivel, credenciais invalidas, captcha incorreto, loading nao finalizado ou URL continuar em logon. |
| Cenarios de teste sugeridos | Login com credenciais validas; credenciais ausentes; captcha falhando; pagina de login lenta. |

Evidencia: `Robo-CEF/Services/LoginService.cs`.

## Captcha

| Item | Descricao |
|---|---|
| Nome | Resolucao de captcha |
| Objetivo | Resolver a imagem de captcha exigida no login. |
| Usuarios impactados | Operacao e suporte. |
| Fluxo principal | Captura a imagem do captcha como base64 e envia ao CapMonster Cloud. |
| Regras de negocio | Se o CapMonster retornar erro, o servico lanca excecao. |
| Campos e validacoes | `Capmonster:Key` e imagem base64 do captcha. |
| Integracoes | SDK `Zennolab.CapMonsterCloud.Client`. |
| Permissoes | Depende de chave valida do CapMonster. |
| Possiveis erros | Chave invalida, saldo/servico indisponivel, imagem invalida ou resposta com erro. |
| Cenarios de teste sugeridos | Resolver captcha valido; simular erro do CapMonster; executar sem chave configurada. |

Evidencia: `Robo-CEF/Services/CapchaService.cs`.

## Consulta de publicacoes

| Item | Descricao |
|---|---|
| Nome | Consulta de publicacoes |
| Objetivo | Pesquisar publicacoes no portal por periodo e grau processual. |
| Usuarios impactados | Operacao, suporte, QA e atendimento ao cliente. |
| Fluxo principal | Acessa a tela de fases a classificar, preenche datas, aplica filtro de grau quando necessario, pesquisa, ajusta itens por pagina, coleta HTML da tabela e pagina resultados. |
| Regras de negocio | Para segundo grau, seleciona `nGrauExpediente` com valor `2`; total do portal e extraido do caption da tabela. |
| Campos e validacoes | Data inicial, data final, filtro de grau, `ItemsPerPage`; falha ao obter total retorna `0`; falha ao alterar itens por pagina gera aviso e continua. |
| Integracoes | Portal juridico CEF via Selenium. |
| Permissoes | Depende da sessao autenticada no portal. |
| Possiveis erros | Mudanca de seletores HTML, loading permanente, pagina sem tabela ou paginacao indisponivel. |
| Cenarios de teste sugeridos | Pesquisa 1a. fase; pesquisa 2a. fase; portal sem resultados; falha na selecao de itens por pagina. |

Evidencia: `Robo-CEF/Services/PublicacoesService.cs`.

## Parser de publicacoes

| Item | Descricao |
|---|---|
| Nome | Parser de publicacoes |
| Objetivo | Converter tabelas HTML do portal em objetos de publicacao. |
| Usuarios impactados | Desenvolvimento, QA e suporte. |
| Fluxo principal | Le cabecalhos da tabela, limpa texto HTML, monta dicionarios e converte para `PublicacoesTable`. |
| Regras de negocio | A fase processual e definida apos o parse pelo fluxo de processamento da fase. |
| Campos e validacoes | `Expediente`, `Area Judicial`, `Situacao CEF`, `Data Fase`, `Descricao`, `Fase Processual`; HTML vazio retorna lista vazia. |
| Integracoes | Usa `HtmlAgilityPack` no parser. |
| Permissoes | Nao aplicavel no codigo. |
| Possiveis erros | Cabecalhos divergentes, HTML sem tabela ou dependencia ausente. |
| Cenarios de teste sugeridos | Tabela valida; tabela vazia; tabela sem cabecalho; campos com quebras de linha. |

Evidencias: `Robo-CEF/Utils/HtmlTableParser.cs`, `Robo-CEF/Models/PublicacoesTable.cs`.

## Importacao de publicacoes

| Item | Descricao |
|---|---|
| Nome | Importacao de publicacoes |
| Objetivo | Importar no banco apenas publicacoes novas. |
| Usuarios impactados | Operacao, suporte, atendimento ao cliente e areas que consomem os dados importados. |
| Fluxo principal | Deduplica expedientes, consulta existentes, filtra novas publicacoes e executa procedure de importacao em lotes. |
| Regras de negocio | Duplicidade e controlada por `p_EXPEDIENTE`; importacao em lotes de 100; erro por item nao interrompe todo o processamento. |
| Campos e validacoes | Propriedades de `PublicacoesTable`; expediente vazio e ignorado na lista de expedientes usados para consulta. |
| Integracoes | MySQL, tabela `T_PROCESSOS_TERCEIRIZACAO_CEF`, procedure `EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760`. |
| Permissoes | Depende de usuario de banco com acesso a tabela e procedure. |
| Possiveis erros | Falha de conexao, procedure indisponivel, parametro incompativel ou registro recusado. |
| Cenarios de teste sugeridos | Importar novas publicacoes; reprocessar expedientes existentes; erro em item isolado; lista vazia. |

Evidencias: `Robo-CEF/Program.cs`, `Robo-CEF/Repositories/PublicacoesRepository.cs`.

## Logs de execucao

| Item | Descricao |
|---|---|
| Nome | Logs de execucao |
| Objetivo | Registrar status e detalhes da execucao do robo. |
| Usuarios impactados | Operacao, suporte e desenvolvimento. |
| Fluxo principal | Insere registros de inicializacao, processamento, erro e finalizacao na tabela de execucoes. |
| Regras de negocio | Usa `RobotId` fixo `178` e status constantes. |
| Campos e validacoes | `ROBOT_ID`, `STATUS`, `DETALHES`, `DATA_EXECUCAO`, `LAST_UPDATE`. |
| Integracoes | MySQL, tabela `EPM_ROCHA.T_EXECUCOES_ROBOTS`. |
| Permissoes | Depende de permissao de INSERT na tabela de logs. |
| Possiveis erros | Falha de conexao ou permissao no banco. |
| Cenarios de teste sugeridos | Registrar inicio; registrar quantidade em processamento; registrar erro; registrar finalizacao. |

Evidencias: `Robo-CEF/Repositories/LogsRepository.cs`, `Robo-CEF/Constants/RobotExecutionState.cs`.

## Notificacoes

| Item | Descricao |
|---|---|
| Nome | Notificacoes |
| Objetivo | Enviar o resumo de processamento por Slack e WhatsApp. |
| Usuarios impactados | Operacao, suporte e atendimento ao cliente. |
| Fluxo principal | Envia payload JSON para Slack e insere mensagem WhatsApp por procedure. |
| Regras de negocio | O resumo e montado no encerramento do fluxo e inclui totais por fase. |
| Campos e validacoes | Mensagem de resumo; `EnsureSuccessStatusCode` valida resposta Slack. |
| Integracoes | Slack webhook e procedure `EPM_ROCHA.PRC_NOTIFICA_SUPORTE_ROCHA_ZAP`. |
| Permissoes | Depende de webhook valido e usuario de banco com permissao na procedure. |
| Possiveis erros | Webhook invalido, falha HTTP, procedure indisponivel ou permissao insuficiente. |
| Cenarios de teste sugeridos | Enviar resumo com sucesso; simular falha Slack; simular falha WhatsApp; validar conteudo do resumo. |

Evidencias: `Robo-CEF/Program.cs`, `Robo-CEF/Services/NotityService.cs`, `Robo-CEF/Repositories/WhatsAppRepository.cs`.

