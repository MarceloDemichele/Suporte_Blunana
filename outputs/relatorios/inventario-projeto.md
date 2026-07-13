# Inventario Tecnico e Funcional do Projeto

Data da analise: 2026-07-06

## Escopo analisado

Este inventario foi gerado a partir do codigo-fonte, configuracoes e documentacao Markdown disponiveis no workspace.

Fontes lidas:

- Instrucoes do agente: `AGENTS.md`
- Prompt executado: `prompts/01-mapear-projeto.md`
- Documentacao existente: `docs/*.md`
- Codigo-fonte principal: `Robo-CEF/**/*.cs`
- Configuracoes e scripts: `Robo-CEF/config.json`, `Robo-CEF/Robo-CEF.csproj`, `package.json`, `config/repositories.json`, `scripts/*.ps1`
- Fonte principal adicional solicitada em `repositories/documentacao/docs/`: nao encontrada neste checkout.

## Visao geral

O projeto `Robo-CEF` e uma aplicacao console .NET 8 para automatizar consulta de publicacoes no portal juridico da Caixa, extrair publicacoes, evitar importacao duplicada por expediente, importar novas publicacoes no MySQL e enviar resumo por Slack e WhatsApp.

Evidencias:

- `README.md`
- `Robo-CEF/Program.cs`
- `Robo-CEF/Robo-CEF.csproj`
- `docs/robo-cef-README.md`
- `docs/robo-cef-arquitetura.md`

## Estrutura de pastas

| Caminho | Finalidade aparente | Evidencia |
|---|---|---|
| `Robo-CEF/` | Projeto console .NET principal | `Robo-CEF/Robo-CEF.csproj`, `Robo-CEF/Program.cs` |
| `Robo-CEF/Services/` | Automacao, login, captcha e notificacoes | `Robo-CEF/Services/*.cs` |
| `Robo-CEF/Repositories/` | Persistencia MySQL e chamadas a procedures | `Robo-CEF/Repositories/*.cs` |
| `Robo-CEF/Models/` | DTOs/modelos usados na extracao e resumo | `Robo-CEF/Models/*.cs` |
| `Robo-CEF/Constants/` | Constantes de data, fases e status | `Robo-CEF/Constants/*.cs` |
| `Robo-CEF/Utils/` | Parser de tabela HTML | `Robo-CEF/Utils/HtmlTableParser.cs` |
| `Robo-CEF/Workers/` | Implementacoes alternativas/legadas de login, captcha e extracao | `Robo-CEF/Workers/*.cs`; nao ha chamada no `Main` atual |
| `Robo-CEF/MySqlDatabase/` | Insercao legada por procedure | `Robo-CEF/MySqlDatabase/MySqlDatabase.cs`; nao ha chamada no `Main` atual |
| `docs/` | Documentacao tecnica e funcional existente | `docs/*.md` |
| `engenharia-reversa/robo-cef/` | Documentacao de engenharia reversa ja gerada | `engenharia-reversa/robo-cef/*.md` |
| `prompts/` | Prompts operacionais do agente | `prompts/*.md` |
| `scripts/` | Scripts PowerShell para repositorios e geracao de docs | `scripts/*.ps1` |
| `config/` | Configuracao dos repositorios externos usados pelos scripts | `config/repositories.json` |
| `repositories/` | Pasta prevista para repositorios externos | `repositories/.gitkeep`, `config/repositories.json` |

## Arquitetura

Arquitetura atual identificada: console .NET com orquestracao procedural em `Program.cs`, composicao manual de dependencias, automacao via Selenium WebDriver, persistencia via Dapper/MySql.Data e notificacoes por HTTP/Stored Procedure.

Fluxo principal comprovado:

1. Le `config.json`.
2. Cria `ChromeDriver`.
3. Instancia repositories e services.
4. Registra log de inicializacao.
5. Executa login no portal juridico CEF.
6. Processa publicacoes de 1a. fase.
7. Processa publicacoes de 2a. fase.
8. Monta resumo final.
9. Envia notificacao Slack.
10. Insere mensagem para WhatsApp.
11. Registra log de finalizacao.
12. Fecha o driver.

Evidencias:

- `Robo-CEF/Program.cs`
- `docs/robo-cef-arquitetura.md`
- `docs/robo-cef-fluxo-operacional.md`

## Modulos principais

| Modulo | Responsabilidade | Evidencia |
|---|---|---|
| Orquestracao | Inicializar configuracao, driver, servicos, fluxo por fase, resumo e encerramento | `Robo-CEF/Program.cs` |
| Login | Navegar ao portal CEF, preencher usuario/senha/captcha e validar saida da URL de logon | `Robo-CEF/Services/LoginService.cs` |
| Captcha | Resolver captcha por CapMonster Cloud | `Robo-CEF/Services/CapchaService.cs` |
| Publicacoes | Filtrar periodo, grau, paginar e coletar HTML da tabela | `Robo-CEF/Services/PublicacoesService.cs` |
| Parser HTML | Converter tabela HTML em dicionarios e objetos tipados | `Robo-CEF/Utils/HtmlTableParser.cs` |
| Persistencia de publicacoes | Consultar expedientes existentes e importar novas publicacoes | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| Logs | Registrar status da execucao do robo | `Robo-CEF/Repositories/LogsRepository.cs` |
| WhatsApp | Inserir mensagem por procedure | `Robo-CEF/Repositories/WhatsAppRepository.cs` |
| Notificacoes | Enviar resumo por Slack e WhatsApp | `Robo-CEF/Services/NotityService.cs` |
| Workers legados/alternativos | Login, captcha, extracao e insercao com outro desenho de implementacao | `Robo-CEF/Workers/*.cs`, `Robo-CEF/MySqlDatabase/MySqlDatabase.cs` |

## Telas e rotas externas

Nao existe API web propria, controllers ou rotas HTTP internas no projeto. As rotas identificadas sao URLs externas acessadas pela automacao Selenium ou por HTTP.

| Tela/endpoint | Uso | Evidencia |
|---|---|---|
| `https://www.juridico.caixa.gov.br` | Entrada do login no fluxo ativo | `Robo-CEF/Services/LoginService.cs` |
| `https://www.juridico.caixa.gov.br/logon.asp` | Login no fluxo legado | `Robo-CEF/Workers/LoginAutomator.cs` |
| `https://www.juridico.caixa.gov.br/modulos/CtrlSistemico/_Ajustes/?pg=AjustesSIJURFaseAClassificar` | Tela de pesquisa de fases/publicacoes | `Robo-CEF/Services/PublicacoesService.cs`, `Robo-CEF/Workers/Extractor.cs` |
| Slack webhook | Envio de resumo final | `Robo-CEF/Services/NotityService.cs` |
| `https://api.capmonster.cloud/createTask` | Criacao de tarefa de captcha no fluxo legado | `Robo-CEF/Workers/CaptchaBreaker.cs` |
| `https://api.capmonster.cloud/getTaskResult` | Consulta de resultado do captcha no fluxo legado | `Robo-CEF/Workers/CaptchaBreaker.cs` |

## Servicos e integracoes

| Integracao | Tipo | Finalidade | Evidencia |
|---|---|---|---|
| Portal juridico CEF | Selenium/ChromeDriver | Login, filtros, paginacao e extracao de tabela | `LoginService.cs`, `PublicacoesService.cs` |
| CapMonster Cloud | SDK `Zennolab.CapMonsterCloud.Client` | Resolver imagem de captcha no fluxo ativo | `CapchaService.cs`, `Robo-CEF.csproj` |
| CapMonster Cloud legado | HTTP direto | Resolver captcha no fluxo legado | `Workers/CaptchaBreaker.cs` |
| MySQL | Dapper/MySql.Data | Consulta, importacao, logs e notificacao WhatsApp | `Repositories/*.cs`, `Robo-CEF.csproj` |
| Slack | HTTP webhook | Enviar resumo de processamento | `Services/NotityService.cs` |
| WhatsApp | Stored procedure | Inserir mensagem para suporte/notificacao | `Repositories/WhatsAppRepository.cs` |

## Banco de dados

Objetos citados diretamente no codigo:

| Objeto | Tipo | Uso | Evidencia |
|---|---|---|---|
| `T_PROCESSOS_TERCEIRIZACAO_CEF` | Tabela | Consultar expedientes ja existentes | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| `EPM_ROCHA.T_EXECUCOES_ROBOTS` | Tabela | Registrar logs de execucao | `Robo-CEF/Repositories/LogsRepository.cs` |
| `EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760` | Stored procedure | Importar publicacoes no fluxo ativo | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| `PRC_PUBLICACOES_PORTAL_CEF_MER_760` | Stored procedure sem schema no codigo legado | Inserir processos no fluxo legado | `Robo-CEF/MySqlDatabase/MySqlDatabase.cs` |
| `EPM_ROCHA.PRC_NOTIFICA_SUPORTE_ROCHA_ZAP` | Stored procedure | Adicionar mensagem WhatsApp | `Robo-CEF/Repositories/WhatsAppRepository.cs` |

Ponto a validar: nao ha DDL, migrations ou schema completo no repositorio. Parametros, efeitos colaterais e contratos das stored procedures dependem do banco externo.

## Regras de negocio aparentes

| Regra/fluxo | Evidencia |
|---|---|
| O periodo pesquisado vai de `DateTime.Now.AddDays(-DiasRetroativos)` ate `DateTime.Now` | `Robo-CEF/Program.cs` |
| O processamento ocorre para 1a. fase e depois 2a. fase | `Robo-CEF/Program.cs`, `Robo-CEF/Constants/FasesProcessuais.cs` |
| Para segundo grau, o filtro `nGrauExpediente` recebe valor `2` | `Robo-CEF/Services/PublicacoesService.cs` |
| O total do portal e extraido do texto do caption da tabela | `Robo-CEF/Services/PublicacoesService.cs` |
| Linhas extraidas sao convertidas para `PublicacoesTable` a partir dos cabecalhos HTML | `Robo-CEF/Utils/HtmlTableParser.cs`, `Robo-CEF/Models/PublicacoesTable.cs` |
| Duplicidades sao removidas por `p_EXPEDIENTE` | `Robo-CEF/Program.cs` |
| Publicacoes ja existentes sao filtradas por consulta de `EXPEDIENTE` no banco | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| Novas publicacoes sao importadas em lotes de 100 | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| Erros por item importado geram log e nao interrompem todo o lote | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| Login tenta tres timeouts: 5, 15 e 30 segundos | `Robo-CEF/Services/LoginService.cs` |
| Ao final, o resumo e enviado mesmo quando houve erro global, incluindo mensagem de erro no texto | `Robo-CEF/Program.cs` |

## Validacoes identificadas

| Validacao/tratamento | Evidencia |
|---|---|
| Configuracoes obrigatorias de banco e CapMonster lancam excecao se ausentes | `Robo-CEF/Program.cs` |
| Usuario e senha ausentes lancam excecao no login ativo | `Robo-CEF/Services/LoginService.cs` |
| Falha na resolucao do captcha lanca excecao no servico ativo | `Robo-CEF/Services/CapchaService.cs` |
| Falha ao obter total do portal retorna `0` e registra mensagem no console | `Robo-CEF/Services/PublicacoesService.cs` |
| Falha ao selecionar quantidade por pagina gera aviso e continua | `Robo-CEF/Services/PublicacoesService.cs` |
| Falha de importacao por publicacao incrementa erro, registra log e continua | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| Caminhos dos scripts PowerShell sao resolvidos dentro do workspace | `scripts/*.ps1` |

## Permissoes e autenticacao

Nao foram encontradas regras internas de permissao, perfis, roles, claims ou autorizacao por usuario no codigo.

Autenticacao identificada:

- Login no portal juridico CEF com `LoginUser:UserName`, `LoginUser:PassWord` e captcha.
- Credenciais sao lidas de `config.json`.

Evidencias:

- `Robo-CEF/Services/LoginService.cs`
- `Robo-CEF/Workers/CredentialsFetcher.cs`
- `Robo-CEF/config.json`

Ponto a validar: o projeto nao documenta politicas de permissao no portal externo nem perfis exigidos para o usuario configurado.

## Arquivos de configuracao

| Arquivo | Uso | Evidencia |
|---|---|---|
| `Robo-CEF/config.json` | Connection string, login, CapMonster, timeouts, itens por pagina, dias retroativos e modo desenvolvimento | `Robo-CEF/Program.cs`, `Robo-CEF/config.json` |
| `Robo-CEF/Robo-CEF.csproj` | Target `.NET 8`, dependencias, publicacao single-file `win-x64` | `Robo-CEF/Robo-CEF.csproj` |
| `package.json` | Dependencias Node usadas no workspace, incluindo Playwright, dotenv e otplib | `package.json` |
| `config/repositories.json` | Repositorios externos para scripts de clone/update/docs | `config/repositories.json`, `scripts/*.ps1` |
| `.env.dev`, `.env.hml`, `.env.prod` | Arquivos de ambiente presentes no workspace | listagem do projeto; conteudo nao necessario para o inventario |

Ponto de atencao: `Robo-CEF/config.json` contem segredos em claro no workspace. Os valores nao foram reproduzidos neste inventario.

## Documentacao existente

Arquivos Markdown encontrados em `docs/`:

- `docs/documentation-agent.md`
- `docs/reverse-engineering-prompt.md`
- `docs/robo-cef-api.md`
- `docs/robo-cef-arquitetura.md`
- `docs/robo-cef-banco.md`
- `docs/robo-cef-engenharia-reversa.md`
- `docs/robo-cef-fluxo-operacional.md`
- `docs/robo-cef-inventario-codigo-fonte.md`
- `docs/robo-cef-matriz-rastreabilidade.md`
- `docs/robo-cef-modulos-funcionais.md`
- `docs/robo-cef-pontos-a-validar.md`
- `docs/robo-cef-qa.md`
- `docs/robo-cef-README.md`
- `docs/robo-cef-regras-negocio.md`
- `docs/robo-cef-riscos.md`
- `docs/robo-cef-telas.md`

Arquivos Markdown ja existentes em `engenharia-reversa/robo-cef/`:

- `README.md`
- `01-visao-geral.md`
- `02-mapa-de-rotas.md`
- `03-modulos-funcionais.md`
- `04-apis-servicos-integracoes.md`
- `05-catalogo-de-dados-formularios-banco.md`
- `06-regras-de-negocio.md`
- `07-cenarios-de-teste-qa.md`
- `08-arquitetura-tecnica.md`
- `09-riscos-dividas-tecnicas.md`
- `10-pontos-a-validar.md`
- `11-inventario-codigo-fonte.md`
- `12-fluxo-operacional-detalhado.md`
- `13-matriz-rastreabilidade.md`

## Lacunas de documentacao e pontos a validar

| Item | Lacuna/Ponto a validar | Evidencia |
|---|---|---|
| Fonte documental principal | `repositories/documentacao/docs/` nao foi encontrada neste checkout | listagem do workspace |
| Banco de dados | Nao ha DDL, migrations ou schema completo | `Robo-CEF/Repositories/*.cs`, ausencia de arquivos SQL/migrations no inventario |
| Stored procedures | Contratos e efeitos das procedures nao estao no repositorio | `PublicacoesRepository.cs`, `WhatsAppRepository.cs`, `MySqlDatabase.cs` |
| Workers | Confirmar se `Robo-CEF/Workers/*` deve ser mantido, removido ou reativado | busca por chamadas mostra uso interno nos workers, sem chamada no `Program.cs` |
| Dependencias | `HtmlTableParser.cs` usa `HtmlAgilityPack` e `CaptchaBreaker.cs` usa `Newtonsoft.Json`, mas esses pacotes nao aparecem no `.csproj` lido | `HtmlTableParser.cs`, `CaptchaBreaker.cs`, `Robo-CEF/Robo-CEF.csproj` |
| Testes | Nao foram encontrados testes automatizados no codigo lido | busca por `Fact`, `Theory`, `Assert`, `describe`, `it`, `test` |
| Segredos | Configuracao sensivel aparece em arquivo versionado/local | `Robo-CEF/config.json`, `Services/NotityService.cs` |
| Permissoes | Nao ha matriz de perfis/permissoes do portal externo | `LoginService.cs`, documentacao existente |
| Execucao local | Build/testes nao foram executados nesta etapa, pois o prompt pediu mapeamento sem alterar codigo | `prompts/01-mapear-projeto.md` |

## Inventario resumido de arquivos de codigo

| Arquivo | Papel |
|---|---|
| `Robo-CEF/Program.cs` | Entrada e orquestracao do fluxo ativo |
| `Robo-CEF/Services/LoginService.cs` | Login ativo no portal |
| `Robo-CEF/Services/CapchaService.cs` | Captcha ativo via SDK CapMonster |
| `Robo-CEF/Services/PublicacoesService.cs` | Pesquisa, filtros, paginacao e coleta de tabelas |
| `Robo-CEF/Services/NotityService.cs` | Notificacoes Slack e WhatsApp |
| `Robo-CEF/Repositories/PublicacoesRepository.cs` | Consulta de expedientes e importacao |
| `Robo-CEF/Repositories/LogsRepository.cs` | Logs em tabela de execucoes |
| `Robo-CEF/Repositories/WhatsAppRepository.cs` | Procedure de WhatsApp |
| `Robo-CEF/Utils/HtmlTableParser.cs` | Parser generico de tabela HTML |
| `Robo-CEF/Models/PublicacoesTable.cs` | Campos da publicacao extraida |
| `Robo-CEF/Models/ResumoPublicacoes.cs` | Contadores do processamento |
| `Robo-CEF/Constants/*.cs` | Formatos, fases e status |
| `Robo-CEF/Workers/*.cs` | Fluxos alternativos/legados |
| `Robo-CEF/MySqlDatabase/MySqlDatabase.cs` | Insercao legada por procedure |

## Conclusao

O projeto ja possui documentacao tecnica extensa em `docs/` e `engenharia-reversa/robo-cef/`. O fluxo ativo esta centralizado em `Robo-CEF/Program.cs` e depende de Selenium, portal CEF, CapMonster, MySQL, Slack e procedure WhatsApp. As principais lacunas comprovadas sao ausencia da fonte `repositories/documentacao/docs/`, falta de schema/DDL do banco, ausencia de testes automatizados, presenca de segredos em configuracao local e existencia de codigo legado/alternativo nao chamado pelo `Main` atual.
