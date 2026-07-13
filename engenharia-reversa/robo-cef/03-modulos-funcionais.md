# 03 - Modulos Funcionais

## Entrada e orquestracao

Arquivo: `Robo-CEF/Program.cs`.

Responsabilidades:

- Ler `config.json`.
- Criar ChromeDriver.
- Instanciar repositorios e servicos.
- Registrar log inicial.
- Executar login.
- Processar primeiro e segundo grau.
- Montar resumo final.
- Enviar notificacoes Slack e WhatsApp.
- Registrar log final e fechar driver.

## Login

Arquivo principal: `Robo-CEF/Services/LoginService.cs`.

Funcionalidades:

- Navega para `https://www.juridico.caixa.gov.br`.
- Tenta login com timeouts de 5, 15 e 30 segundos.
- Se a URL nao contem `logon`, considera usuario ja logado.
- Preenche usuario, senha e captcha.
- Aguarda loading aparecer/desaparecer e URL sair de `logon`.
- Lanca erro apos 3 tentativas sem sucesso.

## Captcha

Arquivo principal: `Robo-CEF/Services/CapchaService.cs`.

Funcionalidades:

- Usa `Zennolab.CapMonsterCloud.Client`.
- Cria `ImageToTextRequest` com `CaseSensitive = false`.
- Envia imagem base64.
- Lanca excecao se `task.Error` vier preenchido.
- Retorna `task.Solution.Value`.

Implementacao alternativa/legada: `Robo-CEF/Workers/CaptchaBreaker.cs`, usando HTTP direto para `api.capmonster.cloud/createTask` e `getTaskResult`.

## Consulta e extracao de publicacoes

Arquivo principal: `Robo-CEF/Services/PublicacoesService.cs`.

Funcionalidades:

- Acessa tela de fases a classificar.
- Preenche data inicial e final no formato `dd/MM/yyyy`.
- Opcionalmente seleciona segundo grau com valor `2`.
- Clica em filtrar.
- Seleciona quantidade por pagina conforme `ItemsPerPage`.
- Extrai `outerHTML` da tabela em todas as paginas.
- Extrai total do portal via regex sobre o caption.

## Parse de tabela HTML

Arquivo: `Robo-CEF/Utils/HtmlTableParser.cs`.

Funcionalidades:

- Carrega HTML com `HtmlAgilityPack`.
- Usa primeira linha da tabela como cabecalho.
- Limpa quebras de linha, tabulacoes e entidades HTML.
- Converte linhas para dicionario.
- Serializa/desserializa para classe de destino.

## Importacao de publicacoes

Arquivo: `Robo-CEF/Repositories/PublicacoesRepository.cs`.

Funcionalidades:

- Consulta expedientes existentes em `T_PROCESSOS_TERCEIRIZACAO_CEF`.
- Importa novas publicacoes pela stored procedure `EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760`.
- Processa em lotes de 100.
- Conta sucessos e erros.
- Registra erro de item no `LogsRepository`.

## Logs

Arquivo: `Robo-CEF/Repositories/LogsRepository.cs`.

Funcionalidades:

- Insere registros em `EPM_ROCHA.T_EXECUCOES_ROBOTS`.
- Usa `RobotId = 178`.
- Status usados: `INICIANDO`, `EM_PROCESSO`, `ERRO`, `FINALIZADO`.

## Notificacoes

Arquivos: `Robo-CEF/Services/NotityService.cs`, `Robo-CEF/Repositories/WhatsAppRepository.cs`.

Funcionalidades:

- Envia mensagem para Slack via webhook.
- Adiciona mensagem WhatsApp pela procedure `EPM_ROCHA.PRC_NOTIFICA_SUPORTE_ROCHA_ZAP`.

## Workers legados/alternativos

Arquivos em `Robo-CEF/Workers` e `Robo-CEF/MySqlDatabase/MySqlDatabase.cs`.

Observacao: estes arquivos implementam fluxo semelhante, mas nao sao chamados pelo `Main` atual em `Program.cs`.

