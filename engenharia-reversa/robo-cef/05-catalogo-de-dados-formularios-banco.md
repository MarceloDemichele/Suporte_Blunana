# 05 - Catalogo de Dados, Formularios e Banco

## Formularios externos

### Login CEF

| Campo | Tipo inferido pelo uso | Obrigatorio | Origem | Destino | Evidencia |
|---|---|---|---|---|---|
| Usuario/matricula | Texto | Sim | `LoginUser:UserName` | `input#sMatricula` | `Services/LoginService.cs` |
| Senha | Texto/senha | Sim | `LoginUser:PassWord` | `input#sSenha` | `Services/LoginService.cs` |
| Captcha | Texto | Sim | `CaptchaService.ResolveAsync` | `input#sCaptcha` | `Services/LoginService.cs` |

### Filtro de publicacoes

| Campo | Tipo | Obrigatorio | Valor | Evidencia |
|---|---|---|---|---|
| Data inicio | Data `dd/MM/yyyy` | Sim para o fluxo | `DateTime.Now.AddDays(-DiasRetroativos)` | `Program.cs`, `Services/PublicacoesService.cs` |
| Data fim | Data `dd/MM/yyyy` | Sim para o fluxo | `DateTime.Now` | `Program.cs`, `Services/PublicacoesService.cs` |
| Grau expediente | Select | Apenas para segundo grau | Valor `2` | `Services/PublicacoesService.cs` |
| Quantidade por pagina | Select | Nao obrigatorio; tentativa best-effort | `ItemsPerPage` | `Services/PublicacoesService.cs` |

## Modelos

### `PublicacoesTable`

Arquivo: `Robo-CEF/Models/PublicacoesTable.cs`.

| Propriedade | Cabecalho JSON/HTML esperado |
|---|---|
| `p_EXPEDIENTE` | `Expediente` |
| `p_AREAJUDICIAL` | `Area Judicial` com acento no codigo: `Área Judicial` |
| `p_SITUACAOCEF` | `Situação CEF` |
| `p_DATAFASE` | `Data Fase` |
| `p_DESCRICAO` | `Descrição` |
| `p_FASEPROCESSUAL` | `Fase Processual` |

### `ResumoExtracao`

Arquivo: `Robo-CEF/Models/ResumoPublicacoes.cs`.

Campos: `TotalPortal`, `TotalEncontrado`, `TotalNaoDuplicado`, `TotalExistente`, `TotalNovos`, `TotalSucesso`, `TotalErros`.

## Banco de dados

O repositorio nao contem migrations, DDL ou schema completo. Os objetos abaixo foram identificados por uso em SQL/procedures.

| Objeto | Tipo | Uso | Arquivo |
|---|---|---|---|
| `T_PROCESSOS_TERCEIRIZACAO_CEF` | Tabela | Consultar `EXPEDIENTE` existente; SQL ativo nao informa schema e usa o banco configurado na connection string | `Repositories/PublicacoesRepository.cs` |
| `EPM_ROCHA.T_EXECUCOES_ROBOTS` | Tabela | Inserir logs de execucao | `Repositories/LogsRepository.cs` |
| `EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760` | Stored procedure | Importar publicacoes | `Repositories/PublicacoesRepository.cs`, `MySqlDatabase/MySqlDatabase.cs` |
| `EPM_ROCHA.PRC_NOTIFICA_SUPORTE_ROCHA_ZAP` | Stored procedure | Inserir mensagem WhatsApp | `Repositories/WhatsAppRepository.cs` |

## Colunas identificadas

### `T_PROCESSOS_TERCEIRIZACAO_CEF`

| Coluna | Uso |
|---|---|
| `EXPEDIENTE` | Dedupe/consulta de existencia |

### `T_EXECUCOES_ROBOTS`

| Coluna | Uso |
|---|---|
| `ROBOT_ID` | Valor fixo `178` |
| `STATUS` | Status da execucao |
| `DETALHES` | Mensagem textual |
| `DATA_EXECUCAO` | `NOW()` |
| `LAST_UPDATE` | `NOW()` |

## Parametros de procedures identificados

### `EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760`

No fluxo ativo, `PublicacoesRepository.ImportarPublicacoesAsync` chama a procedure com o objeto `PublicacoesTable` via Dapper. Os nomes enviados sao as propriedades do modelo:

| Parametro/propriedade ativa | Origem |
|---|---|
| `p_EXPEDIENTE` | Coluna HTML `Expediente` |
| `p_AREAJUDICIAL` | Coluna HTML `Área Judicial` |
| `p_SITUACAOCEF` | Coluna HTML `Situação CEF` |
| `p_DATAFASE` | Coluna HTML `Data Fase` |
| `p_DESCRICAO` | Coluna HTML `Descrição` |
| `p_FASEPROCESSUAL` | Atribuido em `Program.cs` como `1a. Fase` ou `2a. Fase` |

O codigo legado em `MySqlDatabase/MySqlDatabase.cs` chama `CALL PRC_PUBLICACOES_PORTAL_CEF_MER_760(...)` com parametros explicitos, incluindo `@p_FASE_PROCESSUAL`. Ponto a validar: confirmar no banco se a procedure aceita ambos os nomes ou se apenas um caminho e compativel.

### `EPM_ROCHA.PRC_NOTIFICA_SUPORTE_ROCHA_ZAP`

| Parametro | Origem |
|---|---|
| `p_msg` | Mensagem de resumo montada no `finally` de `Program.cs` |

## Relacionamentos

Nao ha relacionamentos declarados no repositorio. Ponto a validar no schema real do banco.

## Validacoes identificadas

| ID | Local | Validacao/comportamento | Evidencia | Mensagem/efeito |
|---|---|---|---|---|
| VAL-001 | Configuracao | Connection string deve existir | `Program.cs` | Excecao: `Erro ao obter configuração do banco` |
| VAL-002 | Configuracao | Chave CapMonster deve existir | `Program.cs` | Excecao: `Erro ao obter configuração do cap monster` |
| VAL-003 | Login | Usuario deve existir na configuracao | `LoginService.cs` | Excecao: `Erro ao obter UserName` |
| VAL-004 | Login | Senha deve existir na configuracao | `LoginService.cs` | Excecao: `Erro ao obter PassWord` |
| VAL-005 | Login | Login deve sair da URL `logon` apos loading | `LoginService.cs` | Retorna falso na tentativa; apos 3 tentativas lanca erro |
| VAL-006 | Captcha | CapMonster nao pode retornar erro | `CapchaService.cs` | Excecao com erro retornado pelo servico |
| VAL-007 | Consulta | Total do portal pode nao ser encontrado | `PublicacoesService.cs` | Loga erro e retorna `0` |
| VAL-008 | Consulta | Se quantidade por pagina falhar, fluxo continua | `PublicacoesService.cs` | Loga aviso em amarelo |
| VAL-009 | Parser | HTML vazio retorna lista vazia | `HtmlTableParser.cs` | Nenhuma excecao; lista vazia |
| VAL-010 | Parser | Tabela sem linhas/cabecalhos retorna lista vazia | `HtmlTableParser.cs` | Nenhuma excecao; lista vazia |
| VAL-011 | Importacao | Expediente vazio nao entra no HashSet de existentes | `Program.cs` | Publicacoes sem expediente nao compoem lista de dedupe por banco |
| VAL-012 | Importacao | Erro de procedure por item e tratado isoladamente | `PublicacoesRepository.cs` | Incrementa erros e registra log |
| VAL-013 | Notificacao Slack | HTTP deve retornar sucesso | `NotityService.cs` | `EnsureSuccessStatusCode()` pode lancar excecao |
| VAL-014 | Encerramento | Notificacoes/log final/cleanup nao possuem tratamento isolado no `finally` | `Program.cs`, `NotityService.cs` | Excecao em Slack pode impedir WhatsApp, log final e fechamento do driver |

## Mensagens de console e log

| Momento | Mensagem/descricao | Arquivo |
|---|---|---|
| Inicio | `RoboCEF starting...` e `BLUE PROJECTS - BOT CEF PUBLICAÇÕES` | `Program.cs` |
| Login | Tentativa e timeout atual | `LoginService.cs` |
| Consulta | Datas preenchidas, pesquisa e paginas extraidas | `PublicacoesService.cs` |
| Importacao | Processados, faltantes, sucessos e erros | `PublicacoesRepository.cs` |
| Logs | `[LOG] STATUS: detalhes` | `LogsRepository.cs` |
| Final | Resumo completo de processamento | `Program.cs` |
